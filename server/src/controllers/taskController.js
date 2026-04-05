import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';
import { getAiRecommendations, getPatternBasedRecommendations } from '../services/recommendationService.js';
import { buildSchedule } from '../services/scheduleService.js';
import { randomMotivation } from '../services/motivationService.js';

export const createTask = async (req, res) => {
  const task = await Task.create({ ...req.body, user: req.user._id });
  return res.status(201).json({ task });
};

export const listTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
  return res.json({ tasks });
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findOneAndUpdate({ _id: id, user: req.user._id }, req.body, {
    new: true,
    runValidators: true
  });

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (task.completed) {
    await Notification.create({
      user: req.user._id,
      type: 'motivation',
      message: randomMotivation()
    });
  }

  return res.json({ task });
};

export const reorderTasks = async (req, res) => {
  const { orderedIds } = req.body;
  const tasks = await Task.find({ _id: { $in: orderedIds }, user: req.user._id });

  const orderMap = new Map(orderedIds.map((id, index) => [id, index]));
  tasks.sort((a, b) => orderMap.get(String(a._id)) - orderMap.get(String(b._id)));

  return res.json({ orderedTasks: tasks });
};

export const getRecommendations = async (req, res) => {
  const patternRecommendations = await getPatternBasedRecommendations(req.user._id);
  return res.json({ recommendations: patternRecommendations });
};

export const getOpenAiRecommendations = async (req, res) => {
  const { prompt } = req.body;
  const recommendations = await getAiRecommendations({ userId: req.user._id, prompt });
  return res.json({ recommendations });
};

export const getSchedule = async (req, res) => {
  const { totalMinutes = 300 } = req.body;
  const tasks = await Task.find({ user: req.user._id, completed: false }).lean();
  const user = await User.findById(req.user._id);
  const timeline = buildSchedule({ tasks, totalMinutes, productivityScore: user.productivityScore });
  return res.json({ timeline });
};

export const weeklyAnalytics = async (req, res) => {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);

  const weeklyTasks = await Task.find({
    user: req.user._id,
    createdAt: { $gte: weekAgo }
  });

  const completed = weeklyTasks.filter((task) => task.completed).length;
  const total = weeklyTasks.length;

  return res.json({
    total,
    completed,
    completionRate: total ? Math.round((completed / total) * 100) : 0,
    byCategory: weeklyTasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {})
  });
};

export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(30);
  return res.json({ notifications });
};

export const markNotificationRead = async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  return res.json({ notification });
};
