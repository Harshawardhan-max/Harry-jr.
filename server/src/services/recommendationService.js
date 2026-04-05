import OpenAI from 'openai';
import { env } from '../config/env.js';
import { Task } from '../models/Task.js';

const commonMappings = {
  study: ['revision', 'practice problems', 'mock test'],
  gym: ['mobility work', 'cardio session', 'strength training'],
  work: ['inbox zero', 'priority planning', 'deep work block']
};

const openaiClient = env.openAiKey ? new OpenAI({ apiKey: env.openAiKey }) : null;

export const getPatternBasedRecommendations = async (userId) => {
  const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 }).limit(80);
  const textBlob = tasks.map((task) => task.title.toLowerCase()).join(' ');

  const recommendations = new Set();

  Object.entries(commonMappings).forEach(([key, values]) => {
    if (textBlob.includes(key)) {
      values.forEach((value) => recommendations.add(value));
    }
  });

  if (recommendations.size === 0) {
    ['daily review', 'focus sprint', 'stretch break'].forEach((value) => recommendations.add(value));
  }

  return [...recommendations];
};

export const getAiRecommendations = async ({ userId, prompt }) => {
  if (!openaiClient) {
    return [];
  }

  const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 }).limit(20).lean();

  const completion = await openaiClient.chat.completions.create({
    model: env.openAiModel,
    messages: [
      {
        role: 'system',
        content:
          'You are a productivity assistant. Return JSON array of short actionable task suggestions based on history.'
      },
      {
        role: 'user',
        content: `History: ${tasks.map((task) => task.title).join(', ')}. User input: ${prompt}`
      }
    ],
    temperature: 0.5
  });

  const content = completion.choices[0]?.message?.content || '[]';
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return content
      .split('\n')
      .map((line) => line.replace(/^[-\d.)\s]+/, '').trim())
      .filter(Boolean)
      .slice(0, 5);
  }
};
