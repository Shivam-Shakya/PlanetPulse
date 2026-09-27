import express from 'express';
import Activity from '../models/Activity.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find().sort({ date: -1, createdAt: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch activities' });
  }
});

router.post('/', async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({
      message: 'Failed to create activity',
      error: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Activity.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid activity ID' });
  }
});

export default router;
