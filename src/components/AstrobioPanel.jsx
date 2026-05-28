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
  const { publish: publishDrill } = usePublisher(TOPICS.DRILL, "std_msgs/msg/Int32MultiArray");
  const { publish: publishPump } = usePublisher(TOPICS.PUMP, "std_msgs/msg/Int32");
  const { publish: publishLid1 } = usePublisher(TOPICS.LID1, "std_msgs/msg/Int32");
  const { publish: publishLid2 } = usePublisher(TOPICS.LID2, "std_msgs/msg/Int32");
  const { publish: publishLid3 } = usePublisher(TOPICS.LID3, "std_msgs/msg/Int32");
  const [drillCommand, setDrillCommand] = useState([0, 0]);
  const [pumpCommand, setPumpCommand] = useState(0);
  const [lid1State, setLid1State] = useState("CLOSED");
  const [lid2State, setLid2State] = useState("CLOSED");
  const [lid3State, setLid3State] = useState("CLOSED");

  useEffect(() => {
    const interval = setInterval(() => { publishDrill({ data: drillCommand }); }, 50);
    return () => clearInterval(interval);
  }, [drillCommand]);

  useEffect(() => {
    const interval = setInterval(() => { publishPump({ data: pumpCommand }); }, 50);
    return () => clearInterval(interval);
  }, [pumpCommand]);

  const drillPWM = drill.data?.pwm ?? '—';
  const pumpState = pump.data?.state ?? '—';
  const stepperValue = stepper.data?.value ?? '—';

  const lidStates = [lid1State, lid2State, lid3State];
  const lidSetters = [setLid1State, setLid2State, setLid3State];
  const lidPublishers = [publishLid1, publishLid2, publishLid3];

  const row = "flex items-center gap-2 py-0.5";
  const label = "text-red-500 text-[10px] uppercase tracking-widest w-14 shrink-0";
  const val = "text-white text-xs w-8 text-right shrink-0";
  const btn = "px-2 py-0.5 text-[10px] text-white rounded font-mono";

  return (
    <div className="bg-black/40 backdrop-blur-sm border-2 border-red-600 rounded-xl p-2 w-full font-mono">

      <h2 className="text-red-600 font-semibold text-base border-b border-red-600 mb-1.5">
        Astrobio
      </h2>

      <div className="grid grid-cols-2 gap-x-3">

        {/* LEFT COL — Drill, Pump, Stepper */}
        <div className="flex flex-col gap-0.5 border-r border-red-900 pr-3">

          {/* DRILL */}
          <div className={row}>
            <span className={label}>Drill</span>
            <span className="text-gray-400 text-[10px]">PWM</span>
            <span className={val}>{drillPWM}</span>
            <div className="flex gap-1 ml-auto">
              <button onClick={() => setDrillCommand([1, 255])}  className={`${btn} bg-green-700 hover:bg-green-600`}>ON</button>
              <button onClick={() => setDrillCommand([0, 0])}    className={`${btn} bg-gray-700 hover:bg-gray-600`}>OFF</button>
              <button onClick={() => setDrillCommand([-1, 255])} className={`${btn} bg-red-700 hover:bg-red-600`}>REV</button>
            </div>
          </div>

          {/* PUMP */}
          <div className={row}>
            <span className={label}>Pump</span>
            <span className={val}>{pumpState}</span>
            <div className="flex gap-1 ml-auto">
              <button onClick={() => setPumpCommand(1)}  className={`${btn} bg-green-700 hover:bg-green-600`}>ON</button>
              <button onClick={() => setPumpCommand(0)}  className={`${btn} bg-gray-700 hover:bg-gray-600`}>OFF</button>
              <button onClick={() => setPumpCommand(-1)} className={`${btn} bg-red-700 hover:bg-red-600`}>REV</button>
            </div>
          </div>

          {/* STEPPER */}
          <div className={row}>
            <span className={label}>Stepper</span>
            <span className="text-gray-400 text-[10px]">pos</span>
            <span className={val}>{stepperValue}</span>
            <span className="text-gray-500 text-[10px] ml-1">steps</span>
          </div>

        </div>

        {/* RIGHT COL — Servo Lids */}
        <div className="flex flex-col gap-0.5">
          <p className="text-red-500 text-[10px] uppercase tracking-widest mb-0.5">Servo Lid</p>
          {[1, 2, 3].map((id) => (
            <div key={id} className={row}>
              <span className={label}>Lid {id}</span>
              <span className="text-white text-[10px] w-12">{lidStates[id - 1]}</span>
              <div className="flex gap-1 ml-auto">
                <button
                  onClick={() => { lidPublishers[id-1]({ data: 180 }); lidSetters[id-1]("OPEN"); }}
                  className={`${btn} bg-green-700 hover:bg-green-600`}
                >OPEN</button>
                <button
                  onClick={() => { lidPublishers[id-1]({ data: 0 }); lidSetters[id-1]("CLOSED"); }}
                  className={`${btn} bg-red-700 hover:bg-red-600`}
                >CLOSE</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}