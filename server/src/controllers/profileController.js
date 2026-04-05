import { User } from '../models/User.js';

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  return res.json({ profile: user.profile || {}, name: user.name, email: user.email });
};

export const updateProfile = async (req, res) => {
  const { name, age, gender, profession, contact } = req.body;
  const update = {
    name,
    profile: {
      age,
      gender,
      profession,
      contact
    }
  };

  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true, runValidators: true }).select(
    '-password'
  );

  return res.json({ message: 'Profile updated', user });
};

export const updateConsent = async (req, res) => {
  const { behaviorTracking, recommendations } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      consent: { behaviorTracking, recommendations }
    },
    { new: true }
  ).select('-password');

  return res.json({ consent: user.consent });
};
