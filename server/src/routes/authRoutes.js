import express from 'express';
import passport from 'passport';
import { body } from 'express-validator';
import { login, me, signup } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { signToken } from '../utils/token.js';
import { env } from '../config/env.js';

const router = express.Router();

router.post(
  '/signup',
  [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })],
  validate,
  signup
);

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], validate, login);
router.get('/me', protect, me);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${env.clientUrl}/login` }), (req, res) => {
  const token = signToken(req.user._id);
  res.redirect(`${env.clientUrl}/oauth-success?token=${token}`);
});

export default router;
