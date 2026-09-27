import { EMISSION_FACTORS } from './constants';

export const calculateCO2 = (type, quantity) =>
  Number((quantity * EMISSION_FACTORS[type]).toFixed(2));

export const getWeekBoundaries = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { start: monday, end: sunday };
};

export const isDateInWeek = (dateString, weekBoundaries) => {
  const date = new Date(dateString);
  return date >= weekBoundaries.start && date <= weekBoundaries.end;
};

export const getNudge = (used, target) => {
  if (!target || target <= 0) {
    return {
      type: 'info',
      title: 'Set a weekly target',
      message: 'Set a weekly CO₂ target in Settings to start tracking your progress.'
    };
  }

  const percentage = (used / target) * 100;

  if (used === 0) {
    return {
      type: 'info',
      title: 'Ready to start?',
      message: 'Log your first activity this week to see meaningful insights.'
    };
  }

  if (percentage < 50) {
    return {
      type: 'success',
      title: 'Great start!',
      message: `You're currently ${((target - used) / target * 100).toFixed(0)}% below your weekly target. Keep it up!`
    };
  }

  if (percentage <= 80) {
    return {
      type: 'success',
      title: 'On track',
      message: 'You are managing your footprint well. Keep making mindful choices.'
    };
  }

  if (percentage <= 100) {
    return {
      type: 'warning',
      title: 'Approaching limit',
      message: `You're at ${percentage.toFixed(0)}% of your weekly target.`
    };
  }

  return {
    type: 'danger',
    title: 'Target exceeded',
    message: 'Your weekly footprint is above your target. Consider a lower-carbon commute or meal choice next week.'
  };
};
