import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { signToken } from '../utils/token.js';

const shapeAuthResponse = (user) => ({
  token: signToken(user._id),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    consent: user.consent,
    profile: user.profile,
    streak: user.streak
  }
});

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });

  if (existing) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  return res.status(201).json(shapeAuthResponse(user));
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  return res.json(shapeAuthResponse(user));
};

export const me = async (req, res) => {
  return res.json({ user: req.user });
};
