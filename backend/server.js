import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import activitiesRouter from './routes/activities.js';
import settingsRouter from './routes/settings.js';
import Activity from './models/Activity.js';
import Setting from './models/Setting.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PlanetPulse backend is running'
  });
});

app.use('/api/activities', activitiesRouter);
app.use('/api/settings', settingsRouter);

app.post('/api/clear', async (req, res) => {
  try {
    await Activity.deleteMany({});
    await Setting.findOneAndUpdate(
      { key: 'default' },
      { $set: { weeklyTarget: 50 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ message: 'All data cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear data' });
  }
});

app.get('/', (req, res) => {
  res.json({
    name: 'PlanetPulse API',
    status: 'running'
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`PlanetPulse backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

startServer();
