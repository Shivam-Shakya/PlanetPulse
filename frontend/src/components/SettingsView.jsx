import React, { useEffect, useState } from 'react';
import { Button, Card } from './ui';

export default function SettingsView({
  weeklyTarget,
  updateWeeklyTarget,
  clearAllData
}) {
  const [tempTarget, setTempTarget] = useState(weeklyTarget);

  useEffect(() => {
    setTempTarget(weeklyTarget);
  }, [weeklyTarget]);

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Settings</h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium">
            Weekly Target (kg CO₂)
          </label>

          <div className="flex gap-4">
            <input
              type="number"
              min="0"
              value={tempTarget}
              onChange={event => setTempTarget(event.target.value)}
              className="w-full p-2 border rounded-lg"
            />
            <Button
              onClick={() => updateWeeklyTarget(tempTarget)}
            >
              Update
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t mt-6">
          <Button
            variant="danger"
            onClick={clearAllData}
            className="w-full"
          >
            Clear Database
          </Button>
        </div>
      </div>
    </Card>
  );
}
