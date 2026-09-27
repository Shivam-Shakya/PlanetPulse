import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function useAppStore() {
  const [activities, setActivities] = useState([]);
  const [weeklyTarget, setWeeklyTarget] = useState(50);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [activitiesRes, settingsRes] = await Promise.all([
          fetch(`${API_URL}/activities`),
          fetch(`${API_URL}/settings`)
        ]);

        if (!activitiesRes.ok || !settingsRes.ok) {
          throw new Error('Failed to load application data');
        }

        const activitiesData = await activitiesRes.json();
        const settingsData = await settingsRes.json();

        setActivities(activitiesData);
        setWeeklyTarget(settingsData.weeklyTarget);
      } catch (error) {
        console.error('Error fetching application data:', error);
      }
    };

    loadData();
  }, []);

  const addActivity = async (activity) => {
    try {
      const res = await fetch(`${API_URL}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
      });

      if (!res.ok) throw new Error('Failed to add activity');

      const newActivity = await res.json();
      setActivities(prev => [newActivity, ...prev]);
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const deleteActivity = async (id) => {
    try {
      const res = await fetch(`${API_URL}/activities/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete activity');

      setActivities(prev =>
        prev.filter(activity => activity._id !== id && activity.id !== id)
      );
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const updateWeeklyTarget = async (newTarget) => {
    try {
      const res = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeklyTarget: Number(newTarget) })
      });

      if (!res.ok) throw new Error('Failed to update weekly target');

      const data = await res.json();
      setWeeklyTarget(data.weeklyTarget);
    } catch (error) {
      console.error('Error updating weekly target:', error);
    }
  };

  const clearAllData = async () => {
    try {
      const res = await fetch(`${API_URL}/clear`, { method: 'POST' });

      if (!res.ok) throw new Error('Failed to clear database');

      setActivities([]);
      setWeeklyTarget(50);
    } catch (error) {
      console.error('Error clearing database:', error);
    }
  };

  return {
    activities,
    weeklyTarget,
    addActivity,
    deleteActivity,
    updateWeeklyTarget,
    clearAllData
  };
}
