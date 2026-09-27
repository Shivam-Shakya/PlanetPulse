import React, { useState } from 'react';
import { PlusCircle, CarFront, CalendarDays, Hash, StickyNote } from 'lucide-react';
import { Button, Card, Modal } from './ui';
import { LABELS, MAX_THRESHOLDS, UNITS } from '../utils/constants';
import { calculateCO2 } from '../utils/emissions';

export default function LogActivityView({ onSave }) {
  const [formData, setFormData] = useState({
    type: 'car',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });
  const [pendingActivity, setPendingActivity] = useState(null);

  const handleSubmit = event => {
    event.preventDefault();

    const quantity = parseFloat(formData.quantity);
    if (Number.isNaN(quantity) || quantity <= 0) return;

    const activity = {
      type: formData.type,
      quantity,
      unit: UNITS[formData.type],
      co2: calculateCO2(formData.type, quantity),
      date: formData.date,
      note: formData.note
    };

    if (quantity > MAX_THRESHOLDS[formData.type]) {
      setPendingActivity(activity);
    } else {
      finalizeSave(activity);
    }
  };

  const editPending = () => {
    if (!pendingActivity) return;
    setFormData({ type: pendingActivity.type, quantity: String(pendingActivity.quantity), date: pendingActivity.date, note: pendingActivity.note || '' });
    setPendingActivity(null);
  };

  const finalizeSave = activity => {
    onSave(activity);

    setFormData({
      type: 'car',
      quantity: '',
      date: new Date().toISOString().split('T')[0],
      note: ''
    });

    setPendingActivity(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6 sm:p-8 animate-float-in">
        <div className="mb-7">
          <div className="inline-flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2"><PlusCircle size={15}/> Carbon entry</div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <PlusCircle className="text-emerald-500" />
          Log Activity
        </h2>
          <p className="text-sm text-slate-500 mt-2">Track your daily activities and keep your footprint under control.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={formData.type}
            onChange={event =>
              setFormData({ ...formData, type: event.target.value })
            }
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-emerald-500 transition"
          >
            {Object.keys(LABELS).map(key => (
              <option key={key} value={key}>
                {LABELS[key]}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={formData.date}
            onChange={event =>
              setFormData({ ...formData, date: event.target.value })
            }
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-emerald-500 transition"
            required
          />

          <input
            type="number"
            min="0"
            step="any"
            placeholder={`Quantity in ${UNITS[formData.type]}`}
            value={formData.quantity}
            onChange={event =>
              setFormData({ ...formData, quantity: event.target.value })
            }
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-emerald-500 transition"
            required
          />

          <input
            type="text"
            placeholder="Note (Optional)"
            value={formData.note}
            onChange={event =>
              setFormData({ ...formData, note: event.target.value })
            }
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-emerald-500 transition"
          />

          <Button type="submit" className="w-full py-3.5">
            Save Data to DB
          </Button>
        </form>
      </Card>

      <Modal
        isOpen={!!pendingActivity}
        title="Unusually High Value"
        onClose={() => setPendingActivity(null)}
      >
        <p className="mb-4">
          The value you entered is unusually high for this activity. You can edit it or save it anyway.
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={editPending}>
            Edit
          </Button>
          <Button onClick={() => finalizeSave(pendingActivity)}>
            Yes, Save
          </Button>
        </div>
      </Modal>
    </div>
  );
}
