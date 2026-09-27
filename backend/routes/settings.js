import express from 'express';
import Setting from '../models/Setting.js';

const router = express.Router();

const getOrCreateSettings = async () => {
  let settings = await Setting.findOne({ key: 'default' });

  if (!settings) {
    settings = await Setting.create({
      key: 'default',
      weeklyTarget: 50
    });
  }

  return settings;
};

router.get('/', async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({ weeklyTarget: settings.weeklyTarget });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

router.put('/', async (req, res) => {
  try {
    const weeklyTarget = Number(req.body.weeklyTarget);

    if (!Number.isFinite(weeklyTarget) || weeklyTarget < 0) {
      return res.status(400).json({
        message: 'weeklyTarget must be a non-negative number'
      });
    }

    const settings = await Setting.findOneAndUpdate(
      { key: 'default' },
      { $set: { weeklyTarget } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ weeklyTarget: settings.weeklyTarget });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update settings' });
  }
});

export default router;
