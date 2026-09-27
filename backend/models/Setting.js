import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      required: true
    },
    weeklyTarget: {
      type: Number,
      required: true,
      min: 0,
      default: 50
    }
  },
  { timestamps: true }
);

export default mongoose.model('Setting', settingSchema);
