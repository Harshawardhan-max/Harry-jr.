import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, default: 'general' },
    importance: { type: Number, min: 1, max: 5, default: 3 },
    estimatedMinutes: { type: Number, min: 5, default: 30 },
    completed: { type: Boolean, default: false },
    source: { type: String, enum: ['manual', 'recommendation', 'openai'], default: 'manual' },
    metadata: {
      acceptedRecommendation: { type: Boolean, default: false },
      productivityWeight: { type: Number, default: 1 }
    },
    scheduledStart: Date,
    scheduledEnd: Date
  },
  { timestamps: true }
);

export const Task = mongoose.model('Task', taskSchema);
