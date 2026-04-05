import mongoose from 'mongoose';

const consentSchema = new mongoose.Schema(
  {
    behaviorTracking: { type: Boolean, default: false },
    recommendations: { type: Boolean, default: false }
  },
  { _id: false }
);

const contactSchema = new mongoose.Schema(
  {
    phone: String,
    address: String,
    emergencyContact: String
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    googleId: String,
    profile: {
      age: { type: Number, min: 1, max: 120 },
      gender: { type: String, trim: true },
      profession: { type: String, trim: true },
      contact: contactSchema
    },
    consent: { type: consentSchema, default: () => ({}) },
    streak: { type: Number, default: 0 },
    lastActiveDate: Date,
    productivityScore: { type: Number, default: 50 }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
