import express from 'express';
import { body } from 'express-validator';
import {
  createTask,
  getNotifications,
  getOpenAiRecommendations,
  getRecommendations,
  getSchedule,
  listTasks,
  markNotificationRead,
  reorderTasks,
  updateTask,
  weeklyAnalytics
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.post('/', [body('title').notEmpty(), body('importance').optional().isInt({ min: 1, max: 5 })], validate, createTask);
router.get('/', listTasks);
router.put('/:id', updateTask);
router.post('/reorder', reorderTasks);
router.get('/recommendations', getRecommendations);
router.post('/recommendations/openai', getOpenAiRecommendations);
router.post('/schedule', getSchedule);
router.get('/analytics/weekly', weeklyAnalytics);
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);

export default router;
