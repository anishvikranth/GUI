import { useDrill } from '../ros/hooks/useDrill';
import { usePump } from '../ros/hooks/usePump';
import { useServoLid } from '../ros/hooks/useServoLid';
import { useStepper } from '../ros/hooks/useStepper';

export function AstrobioPanel() {

  const drill = useDrill();
  const pump = usePump();
  const lid = useServoLid();
  const stepper = useStepper();

  const drillPWM = drill.data?.pwm ?? '—';

  const pumpState = pump.data?.state ?? '—';

  const lidNumber = lid.data?.lidNumber ?? '—';
  const lidAngle  = lid.data?.angle ?? '—';
  const lidState  = lid.data?.state ?? '—';

  const stepperValue = stepper.data?.value ?? '—';

  return (
    <div className="bg-black border-2 border-red-600 rounded-xl p-3 flex flex-col gap-3 w-fit font-mono">

      <h2 className="text-red-600 font-semibold text-left mb-1 text-2xl border-b border-red-600">
        Astrobio
      </h2>

      <div className="flex flex-col gap-2 text-sm">

        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest">
            Drill
          </p>

          <p className="text-gray-300">
            PWM {drillPWM}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest">
            Pump
          </p>

          <p className="text-gray-300">
            {pumpState}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest">
            Servo Lid
          </p>

          <p className="text-gray-300">
            Lid {lidNumber}
          </p>

          <p className="text-gray-300">
            Angle {lidAngle}°
          </p>

          <p className="text-gray-300">
            {lidState}
          </p>
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

    </div>
  );
}