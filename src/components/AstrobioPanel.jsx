import { useEffect, useState } from 'react';
import { useDrill } from '../ros/hooks/useDrill';
import { usePump } from '../ros/hooks/usePump';
import { useServoLid } from '../ros/hooks/useServoLid';
import { useStepper } from '../ros/hooks/useStepper';
import { usePublisher } from '../ros/hooks/usePublisher';

import { TOPICS } from '../ros/topics';

export function AstrobioPanel() {

  const drill = useDrill();
  const pump = usePump();
  const lid = useServoLid();
  const stepper = useStepper();
  const { publish: publishDrill } = usePublisher(TOPICS.DRILL,"std_msgs/msg/Int32MultiArray");
  const { publish: publishPump } = usePublisher( TOPICS.PUMP, "std_msgs/msg/Int32");
  const { publish: publishLid1 } = usePublisher(TOPICS.LID1, "std_msgs/msg/Int32");
  const { publish: publishLid2 } = usePublisher(TOPICS.LID2, "std_msgs/msg/Int32");
  const { publish: publishLid3 } = usePublisher(TOPICS.LID3, "std_msgs/msg/Int32");
  const [drillCommand, setDrillCommand] = useState([0, 0]);
  const [pumpCommand, setPumpCommand] =  useState(0);
  const [lid1State, setLid1State] =  useState("CLOSED");
  const [lid2State, setLid2State] =  useState("CLOSED");
  const [lid3State, setLid3State] =  useState("CLOSED");
  useEffect(() => {
    const interval = setInterval(() => {
      publishDrill({ data: drillCommand});
    }, 50);
    return () => clearInterval(interval);
  }, [drillCommand]);

  useEffect(() => {
  const interval = setInterval(() => {
    publishPump({data: pumpCommand});
  }, 50);
  return () => clearInterval(interval);

}, [pumpCommand]);
  const drillPWM = drill.data?.pwm ?? '—';

  const pumpState = pump.data?.state ?? '—';

  const lidNumber = lid.data?.lidNumber ?? '—';
  const lidAngle  = lid.data?.angle ?? '—';
  const lidState  = lid.data?.state ?? '—';

  const stepperValue = stepper.data?.value ?? '—';

  return (
    <div className="bg-black border-2 border-red-600 rounded-xl p-3 flex flex-col gap-3 w-fit font-mono">
      <div className="flex flex-col gap-2">

      <h2 className="text-red-600 font-semibold text-left mb-1 text-2xl border-b border-red-600">
        Astrobio
      </h2>

      <div className="grid grid-cols-2 gap-4 text-sm">

        {/* LEFT COLUMN: Drill, Pump, Stepper */}
        <div className="flex flex-col gap-4">

          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              Drill
            </p>

            <p className="text-gray-300">
              PWM {drillPWM}
            </p>

            <div className="flex gap-2 mt-2">
               <button
                 onClick={() => setDrillCommand([1, 255])}
                 className="bg-green-700 px-2 py-1 text-white rounded"
               >
                 ON
               </button>
               <button
                 onClick={() => setDrillCommand([0, 0])}
                 className="bg-gray-700 px-2 py-1 text-white rounded"
               >
                 OFF
               </button>
               <button
                 onClick={() => setDrillCommand([-1, 255])}
                 className="bg-red-700 px-2 py-1 text-white rounded"
               >
                 REV
               </button>
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              Pump
            </p>

            <p className="text-gray-300">
              {pumpState}
            </p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setPumpCommand(1)}
                className="bg-green-700 px-2 py-1 text-white rounded"
              >
                ON
              </button>
              <button
                onClick={() => setPumpCommand(0)}
                className="bg-gray-700 px-2 py-1 text-white rounded"
              >
                OFF
              </button>
              <button
                onClick={() => setPumpCommand(-1)}
                className="bg-red-700 px-2 py-1 text-white rounded"
              >
                REV
              </button>
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              Stepper
            </p>
            <p className="text-gray-300">
              {stepperValue}
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: Servo Lid */}
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest">
            Servo Lid
          </p>

          <p className="text-gray-300">
            Lid 1: {lid1State}
          </p>

          <p className="text-gray-300">
            Lid 2: {lid2State}
          </p>

          <p className="text-gray-300">
            Lid 3: {lid3State}
          </p>

          <div className="flex flex-col gap-2 mt-2">
            {/* Lid 1 */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 w-12">Lid 1</span>
              <button
                onClick={() => { publishLid1({ data: 180 }); setLid1State("OPEN"); }}
                className="bg-green-700 px-2 py-1 text-white rounded"
              >
                OPEN
              </button>
              <button
                onClick={() => { publishLid1({ data: 0 }); setLid1State("CLOSED"); }}
                className="bg-red-700 px-2 py-1 text-white rounded"
              >
                CLOSE
              </button>
            </div>

            {/* Lid 2 */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 w-12">Lid 2</span>
              <button
                onClick={() => { publishLid2({ data: 180 }); setLid2State("OPEN"); }}
                className="bg-green-700 px-2 py-1 text-white rounded"
              >
                OPEN
              </button>
              <button
                onClick={() => { publishLid2({ data: 0 }); setLid2State("CLOSED"); }}
                className="bg-red-700 px-2 py-1 text-white rounded"
              >
                CLOSE
              </button>
            </div>

            {/* Lid 3 */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 w-12">Lid 3</span>
              <button
                onClick={() => { publishLid3({ data: 180 }); setLid3State("OPEN"); }}
                className="bg-green-700 px-2 py-1 text-white rounded"
              >
                OPEN
              </button>
              <button
                onClick={() => { publishLid3({ data: 0 }); setLid3State("CLOSED"); }}
                className="bg-red-700 px-2 py-1 text-white rounded"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>

      </div>
      </div>
    </div>
  );
}