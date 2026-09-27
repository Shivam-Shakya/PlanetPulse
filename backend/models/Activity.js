import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'car',
        'bus',
        'flight',
        'electricity',
        'vegetarian_meal',
        'non_vegetarian_meal'
      ]
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      required: true
    },
    co2: {
      type: Number,
      required: true,
      min: 0
    },
    date: {
      type: Date,
      required: true
    },
    note: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export default mongoose.model('Activity', activitySchema);
