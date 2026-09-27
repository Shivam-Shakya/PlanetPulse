import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { CheckCircle2, Info } from 'lucide-react';
import { Card } from './ui';
import { CATEGORY_COLORS, EMISSION_FACTORS, LABELS } from '../utils/constants';
import { getNudge, getWeekBoundaries, isDateInWeek } from '../utils/emissions';

export default function DashboardView({ activities, weeklyTarget }) {
  const thisWeekBoundaries = useMemo(() => getWeekBoundaries(new Date()), []);

  const { totalCO2, thisWeekCO2, categoryData, recentActivities } = useMemo(() => {
    let total = 0;
    let thisWeek = 0;
    const catMap = {};

    Object.keys(EMISSION_FACTORS).forEach(key => {
      catMap[key] = 0;
    });

    activities.forEach(activity => {
      total += Number(activity.co2) || 0;

      if (isDateInWeek(activity.date, thisWeekBoundaries)) {
        thisWeek += Number(activity.co2) || 0;
        if (catMap[activity.type] !== undefined) {
          catMap[activity.type] += Number(activity.co2) || 0;
        }
      }
    });

    const formattedCatData = Object.keys(catMap)
      .filter(key => catMap[key] > 0)
      .map(key => ({
        name: LABELS[key],
        value: Number(catMap[key].toFixed(2)),
        color: CATEGORY_COLORS[key]
      }));

    return {
      totalCO2: total.toFixed(1),
      thisWeekCO2: thisWeek.toFixed(1),
      categoryData: formattedCatData,
      recentActivities: activities.slice(0, 5)
    };
  }, [activities, thisWeekBoundaries]);

  const weeklyCO2 = Number(thisWeekCO2);
  const target = Number(weeklyTarget) || 0;
  const isOverTarget = target > 0 && weeklyCO2 > target;
  const percentageUsed =
    target > 0 ? Math.min((weeklyCO2 / target) * 100, 100) : 0;

  const nudge = getNudge(weeklyCO2, target);
  const NudgeIcon = nudge.type === 'success' ? CheckCircle2 : Info;

  const nudgeStyles = {
    success: {
      card: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: 'text-emerald-600',
      message: 'text-emerald-700'
    },
    info: {
      card: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: 'text-blue-600',
      message: 'text-blue-700'
    },
    warning: {
      card: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: 'text-amber-600',
      message: 'text-amber-700'
    },
    danger: {
      card: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: 'text-rose-600',
      message: 'text-rose-700'
    }
  };

  const currentNudgeStyle = nudgeStyles[nudge.type] || nudgeStyles.info;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
          <h3 className="text-emerald-100 text-sm mb-1 uppercase">
            Total CO₂ Footprint
          </h3>
          <div className="text-4xl font-bold">
            {totalCO2}{' '}
            <span className="text-emerald-100 text-lg">kg</span>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-gray-500 text-sm mb-1 uppercase">This Week</h3>
          <div className="text-4xl font-bold">
            {thisWeekCO2}{' '}
            <span className="text-gray-500 text-lg">kg CO₂</span>
          </div>

          <div className="mt-4">
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className={`${isOverTarget ? 'bg-rose-500' : 'bg-emerald-500'} h-2.5 rounded-full transition-all duration-300`}
                style={{ width: `${percentageUsed}%` }}
              />
            </div>
            <p className={`text-xs mt-2 text-right font-medium ${
              isOverTarget ? 'text-rose-600' : 'text-gray-500'
            }`}>
              {isOverTarget
                ? `Over target by ${(weeklyCO2 - target).toFixed(1)} kg`
                : `Target: ${weeklyTarget} kg`}
            </p>
          </div>
        </Card>

        <Card className={`p-6 border lg:col-span-1 ${currentNudgeStyle.card}`}>
          <div className="flex gap-4">
            <NudgeIcon size={24} className={`shrink-0 ${currentNudgeStyle.icon}`} />
            <div>
              <h3 className="font-semibold">{nudge.title}</h3>
              <p className={`text-sm ${currentNudgeStyle.message}`}>{nudge.message}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-1 min-h-[300px]">
          <h3 className="text-lg font-semibold mb-4">Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="p-3">Activity</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">CO₂ (kg)</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map(activity => (
                  <tr
                    key={activity._id || activity.id}
                    className="border-b"
                  >
                    <td className="p-3 font-medium">
                      {LABELS[activity.type]}
                    </td>
                    <td className="p-3 text-gray-500">
                      {new Date(activity.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-emerald-600 font-bold">
                      +{Number(activity.co2).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
