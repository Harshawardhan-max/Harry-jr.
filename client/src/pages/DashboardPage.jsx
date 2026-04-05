import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api/client';
import TaskBoard from '../components/TaskBoard';
import PomodoroTimer from '../components/PomodoroTimer';
import MotivationBanner from '../components/MotivationBanner';
import ProfilePage from './ProfilePage';

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [analytics, setAnalytics] = useState({ total: 0, completed: 0, completionRate: 0 });
  const [message, setMessage] = useState('Welcome to FocusFlow AI!');
  const [taskInput, setTaskInput] = useState({ title: '', importance: 3, estimatedMinutes: 30, totalMinutes: 300 });
  const [consent, setConsent] = useState({ behaviorTracking: false, recommendations: true });
  const [aiPrompt, setAiPrompt] = useState('');

  const completionPct = useMemo(() => {
    if (!tasks.length) return 0;
    return Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100);
  }, [tasks]);

  const bootstrap = async () => {
    const [taskRes, recRes, analyticsRes] = await Promise.all([
      api.get('/tasks'),
      api.get('/tasks/recommendations'),
      api.get('/tasks/analytics/weekly')
    ]);
    setTasks(taskRes.data.tasks);
    setRecommendations(recRes.data.recommendations);
    setAnalytics(analyticsRes.data);
  };

  useEffect(() => {
    bootstrap();
    const inactivity = setTimeout(() => setMessage('Take a focus breath and restart your momentum.'), 120000);
    return () => clearTimeout(inactivity);
  }, []);

  const generateSchedule = async () => {
    const { data } = await api.post('/tasks/schedule', { totalMinutes: Number(taskInput.totalMinutes) });
    setTimeline(data.timeline);
  };

  const addTask = async (event) => {
    event.preventDefault();
    await api.post('/tasks', {
      title: taskInput.title,
      importance: Number(taskInput.importance),
      estimatedMinutes: Number(taskInput.estimatedMinutes)
    });
    setTaskInput({ ...taskInput, title: '' });
    bootstrap();
  };

  const markDone = async (task) => {
    await api.put(`/tasks/${task._id}`, { completed: true });
    setMessage('Task completed! Great consistency.');
    bootstrap();
  };

  const reorder = async (ordered) => {
    setTasks(ordered);
    await api.post('/tasks/reorder', { orderedIds: ordered.map((task) => task._id) });
  };

  const requestAi = async () => {
    const { data } = await api.post('/tasks/recommendations/openai', { prompt: aiPrompt });
    setRecommendations((prev) => [...new Set([...data.recommendations, ...prev])]);
  };

  const updateConsent = async (next) => {
    setConsent(next);
    await api.patch('/profile/consent', next);
  };

  return (
    <div className="space-y-4">
      <MotivationBanner message={message} />

      <motion.div layout className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <form onSubmit={addTask} className="rounded-xl bg-white p-4 shadow-md dark:bg-slate-900">
            <h3 className="mb-3 text-lg font-semibold">Create task</h3>
            <div className="grid gap-2 md:grid-cols-4">
              <input className="rounded border p-2 dark:bg-slate-800 md:col-span-2" placeholder="Task title" value={taskInput.title} onChange={(e) => setTaskInput({ ...taskInput, title: e.target.value })} required />
              <input className="rounded border p-2 dark:bg-slate-800" type="number" min="1" max="5" placeholder="Importance" value={taskInput.importance} onChange={(e) => setTaskInput({ ...taskInput, importance: e.target.value })} />
              <input className="rounded border p-2 dark:bg-slate-800" type="number" min="5" placeholder="Minutes" value={taskInput.estimatedMinutes} onChange={(e) => setTaskInput({ ...taskInput, estimatedMinutes: e.target.value })} />
            </div>
            <button className="mt-3 rounded bg-brand-500 px-4 py-2 text-white">Add Task</button>
          </form>

          <TaskBoard tasks={tasks} onReorder={reorder} onComplete={markDone} />

          <div className="rounded-xl bg-white p-4 shadow-md dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Today's schedule</h3>
              <button onClick={generateSchedule} className="rounded bg-brand-500 px-3 py-1 text-white">Generate</button>
            </div>
            <input className="mt-2 w-full rounded border p-2 dark:bg-slate-800" type="number" placeholder="Total available minutes" value={taskInput.totalMinutes} onChange={(e) => setTaskInput({ ...taskInput, totalMinutes: e.target.value })} />
            <ul className="mt-3 space-y-2 text-sm">
              {timeline.map((block, idx) => (
                <li key={`${block.title}-${idx}`} className="rounded border border-slate-200 p-2 dark:border-slate-700">
                  {block.startMinute}m - {block.endMinute}m: {block.title} ({block.duration}m)
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-white p-4 shadow-md dark:bg-slate-900">
            <h3 className="text-lg font-semibold">Productivity stats</h3>
            <p className="mt-2 text-sm">Weekly completion rate: {analytics.completionRate}%</p>
            <p className="text-sm">Current progress: {completionPct}%</p>
            <p className="text-sm">Streak estimate: {Math.floor(analytics.completed / 2)} days</p>
            <div className="mt-2 h-2 rounded bg-slate-200 dark:bg-slate-700">
              <div className="h-2 rounded bg-emerald-500" style={{ width: `${completionPct}%` }} />
            </div>
          </div>

          <PomodoroTimer />

          <div className="rounded-xl bg-white p-4 shadow-md dark:bg-slate-900">
            <h3 className="text-lg font-semibold">Recommendations</h3>
            <div className="mt-2 space-y-2">
              {recommendations.map((item) => (
                <div key={item} className="flex items-center justify-between rounded border border-slate-200 px-2 py-1 dark:border-slate-700">
                  <span>{item}</span>
                  <button className="text-xs text-emerald-500" onClick={() => setTaskInput({ ...taskInput, title: item })}>
                    Accept
                  </button>
                </div>
              ))}
            </div>
            <input className="mt-3 w-full rounded border p-2 dark:bg-slate-800" placeholder="Ask AI for suggestions" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} />
            <button onClick={requestAi} className="mt-2 w-full rounded bg-slate-800 py-2 text-white dark:bg-slate-100 dark:text-slate-900">Get GPT Suggestions</button>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-md dark:bg-slate-900">
            <h3 className="text-lg font-semibold">Consent settings</h3>
            <label className="mt-2 flex items-center justify-between text-sm">
              Track behavior
              <input type="checkbox" checked={consent.behaviorTracking} onChange={(e) => updateConsent({ ...consent, behaviorTracking: e.target.checked })} />
            </label>
            <label className="mt-2 flex items-center justify-between text-sm">
              AI recommendations
              <input type="checkbox" checked={consent.recommendations} onChange={(e) => updateConsent({ ...consent, recommendations: e.target.checked })} />
            </label>
          </div>
        </div>
      </motion.div>

      <ProfilePage />
    </div>
  );
};

export default DashboardPage;
