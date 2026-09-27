import React, { useMemo, useState } from 'react';
import { Filter, Trash2, Search, CalendarDays, X, SlidersHorizontal } from 'lucide-react';
import { Card } from './ui';
import { LABELS } from '../utils/constants';

export default function HistoryView({ activities, onDelete }) {
  const [activityFilter, setActivityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredActivities = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(startOfWeek.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    const endOfLastWeek = new Date(startOfWeek);
    endOfLastWeek.setMilliseconds(-1);
    const query = search.trim().toLowerCase();

    return activities.filter(activity => {
      const activityDate = new Date(activity.date);
      const activityName = LABELS[activity.type] || activity.type;

      const matchesActivity =
        activityFilter === 'all' || activity.type === activityFilter;

      const matchesDate =
        dateFilter === 'all' ||
        (dateFilter === 'week' && activityDate >= startOfWeek) ||
        (dateFilter === 'lastWeek' && activityDate >= startOfLastWeek && activityDate <= endOfLastWeek) ||
        (dateFilter === 'month' && activityDate >= startOfMonth);

      const matchesSearch =
        !query ||
        activityName.toLowerCase().includes(query) ||
        String(activity.note || '').toLowerCase().includes(query);

      return matchesActivity && matchesDate && matchesSearch;
    });
  }, [activities, activityFilter, dateFilter, search]);

  const hasFilters =
    activityFilter !== 'all' || dateFilter !== 'all' || search.trim() !== '';

  const clearFilters = () => {
    setActivityFilter('all');
    setDateFilter('all');
    setSearch('');
  };

  return (
    <Card className="p-5 sm:p-6 animate-float-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2"><CalendarDays size={15}/> Activity Timeline</div>
          <h2 className="text-2xl font-bold text-slate-900">Activity History</h2>
          <p className="text-sm text-gray-500 mt-1">
            View and filter all your logged activities.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-2 rounded-xl">
          <SlidersHorizontal size={16} />
          <span>{filteredActivities.length} activities</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
        <div className="relative lg:col-span-2">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search activity or note..."
            className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>

        <select
          value={activityFilter}
          onChange={e => setActivityFilter(e.target.value)}
          className="px-3 py-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 transition"
        >
          <option value="all">All Activities</option>
          {Object.entries(LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className="px-3 py-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 transition"
        >
          <option value="all">All Dates</option>
          <option value="week">This Week</option>
          <option value="lastWeek">Last Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {hasFilters && (
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            <X size={14}/> Clear filters
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Activity</th>
              <th className="p-3">CO₂</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map(activity => (
              <tr
                key={activity._id || activity.id}
                className="border-b border-slate-100 last:border-b-0 hover:bg-emerald-50/40 transition-colors"
              >
                <td className="p-3">
                  {new Date(activity.date).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <div className="font-medium">
                    {LABELS[activity.type] || activity.type}
                  </div>
                  {activity.note && (
                    <div className="text-xs text-gray-400 mt-1">
                      {activity.note}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {activity.quantity} {activity.unit}
                  </div>
                </td>
                <td className="p-3 text-emerald-600 font-bold">
                  {Number(activity.co2).toFixed(2)} kg
                </td>
                <td className="p-3">
                  <button
                    onClick={() => onDelete(activity._id || activity.id)}
                    className="text-rose-500 hover:text-rose-700 transition-colors"
                    aria-label="Delete activity"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredActivities.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <Filter className="mx-auto mb-3 text-gray-300" size={28} />
            <p className="font-medium">No activities found</p>
            <p className="text-sm mt-1">
              Try changing the filters or log a new activity.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
