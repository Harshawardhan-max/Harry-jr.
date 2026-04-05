import express from 'express';
import { body } from 'express-validator';
import { getProfile, updateConsent, updateProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.get('/', getProfile);
router.put(
  '/',
  [body('name').notEmpty(), body('age').optional().isInt({ min: 1, max: 120 }), body('profession').optional().isLength({ max: 80 })],
  validate,
  updateProfile
);
router.patch('/consent', updateConsent);

export default router;
