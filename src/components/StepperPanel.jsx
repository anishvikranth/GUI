import { useStepper } from '../ros/hooks/useStepper';

export function StepperPanel() {

  const stepper = useStepper();

  const stepperValue =
    stepper.data?.value ?? 0;

  return (

    <div className="border border-red-600 rounded-xl p-3 font-mono">

      <p className="text-gray-500 text-xs uppercase tracking-widest">
        Stepper
      </p>

      <p className="text-gray-300">
        {stepperValue}
      </p>

    </div>

  );
}