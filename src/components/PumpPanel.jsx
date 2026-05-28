import { useState, useEffect } from 'react';
import { usePump } from '../ros/hooks/usePump';
import { usePublisher } from '../ros/hooks/usePublisher';
import { TOPICS } from '../ros/topics';

export function PumpPanel() {

  const pump = usePump();
  const { publish: publishPump } =
    usePublisher(
      TOPICS.PUMP,
      "std_msgs/msg/Int32"
    );
  const [pumpCommand, setPumpCommand] =
    useState(0);
  useEffect(() => {
    const interval = setInterval(() => {

      publishPump({
        data: pumpCommand
      });
    }, 50);
    return () => clearInterval(interval);
  }, [pumpCommand]);

  const pumpState =
    pump.data?.state ?? "OFF";
  return (
    <div className="border border-red-600 rounded-xl p-3 font-mono">

      <p className="text-gray-500 text-xs uppercase tracking-widest">
        Pump
      </p>

      <p className="text-gray-300 mb-2">
          {pumpState}
      </p>

      <div className="flex gap-2">

        <button
          onClick={() =>
            setPumpCommand(1)
          }
          className="bg-green-700 px-2 py-1 text-white rounded"
        >
          ON
        </button>

        <button
          onClick={() =>
            setPumpCommand(0)
          }
          className="bg-gray-700 px-2 py-1 text-white rounded"
        >
          OFF
        </button>

        <button
          onClick={() =>
            setPumpCommand(-1)
          }
          className="bg-red-700 px-2 py-1 text-white rounded"
        >
          REV
        </button>

      </div>

    </div>

  );
}