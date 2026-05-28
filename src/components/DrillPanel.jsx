import { useState, useEffect } from 'react';

import { useDrill } from '../ros/hooks/useDrill';
import { usePublisher } from '../ros/hooks/usePublisher';

import { TOPICS } from '../ros/topics';

export function DrillPanel() {

  const drill = useDrill();

  const { publish: publishDrill } =
    usePublisher(
      TOPICS.DRILL,
      "std_msgs/msg/Int32MultiArray"
    );

  const [drillCommand, setDrillCommand] =
    useState([0,0]);

  useEffect(() => {

    const interval = setInterval(() => {

      publishDrill({
        data: drillCommand
      });

    }, 50);

    return () => clearInterval(interval);

  }, [drillCommand]);

  const drillPWM =
    drill.data?.pwm ?? 0;

  return (

    <div className="border border-red-600 rounded-xl p-3 font-mono">

      <p className="text-gray-500 text-xs uppercase tracking-widest">
        Drill
      </p>

      <p className="text-gray-300 mb-2">
        PWM {drillPWM}
      </p>

      <div className="flex gap-2">

        <button
          onClick={() =>
            setDrillCommand([1,255])
          }
          className="bg-green-700 px-2 py-1 text-white rounded"
        >
          ON
        </button>

        <button
          onClick={() =>
            setDrillCommand([0,0])
          }
          className="bg-gray-700 px-2 py-1 text-white rounded"
        >
          OFF
        </button>

        <button
          onClick={() =>
            setDrillCommand([-1,255])
          }
          className="bg-red-700 px-2 py-1 text-white rounded"
        >
          REV
        </button>

      </div>

    </div>

  );
}