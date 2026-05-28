import { useEffect, useRef, useState } from 'react';
import { useDrill } from '../ros/hooks/useDrill';
import { useTopic } from '../ros/hooks/useTopic';
import { TOPICS } from '../ros/topics';

export function AugerVisualizer() {

  /*
    Drill Topic
  */
  const drill = useDrill();

  const pwm =
    (drill.data?.direction ?? 0) *
    (drill.data?.magnitude ?? 0);

  /*
    Stepper Topic Subscription
  */
  const stepper =
    useTopic(
      TOPICS.STEPPER,
      "std_msgs/msg/Float32"
    );

  const stepperValue =
    stepper.msg?.data ?? 0;

  /*
    Depth State
    Starts at 45 cm
  */
  const [depth, setDepth] =
    useState(45);

  /*
    Time Reference
  */
  const lastTimeRef =
    useRef(Date.now());

  /*
    Motion Model

    PWM = 255
    Stepper = 10

    => 5 cm/s
  */
  useEffect(() => {

    const interval =
      setInterval(() => {

        const now = Date.now();

        const dt =
          (now - lastTimeRef.current) / 1000;

        lastTimeRef.current = now;

        /*
          Velocity Equation

          v = (PWM * Stepper) / 510

          Example:
          255 * 10 / 510 = 5 cm/s
        */
        const velocity =
          (pwm * stepperValue) / 510;

        /*
          Positive PWM:
          move downward

          Negative PWM:
          move upward
        */
        setDepth((prevDepth) => {

          let newDepth =
            prevDepth - velocity * dt;

          /*
            Clamp:
            0 cm to 45 cm
          */
          newDepth =
            Math.max(
              0,
              Math.min(45, newDepth)
            );

          return newDepth;

        });

      }, 50);

    return () =>
      clearInterval(interval);

  }, [pwm, stepperValue]);

  /*
    Convert depth to SVG Y position

    45 cm -> top
    0 cm  -> bottom
  */
  const arrowY =
    30 + ((45 - depth) / 45) * 240;

  return (

    <div className="bg-black/40 backdrop-blur-sm border-2 border-red-600 rounded-xl p-3 font-mono h-full w-full flex flex-col">

      <h2 className="text-red-600 text-2xl border-b border-red-600 mb-2">

        Auger Visualizer

      </h2>

      <svg
        width="100%"
        height="320"
        className="bg-zinc-900 rounded-lg"
      >

        {/* Vertical Scale */}
        <line
          x1="90"
          y1="30"
          x2="90"
          y2="270"
          stroke="#ef4444"
          strokeWidth="4"
        />

        {/* Scale Markings */}
        {[45, 40, 35, 30, 25, 20, 15, 10, 5, 0].map((mark) => {

          const y =
            30 + ((45 - mark) / 45) * 240;

          return (

            <g key={mark}>

              {/* Tick */}
              <line
                x1="80"
                y1={y}
                x2="100"
                y2={y}
                stroke="#ffffff"
                strokeWidth="2"
              />

              {/* Label */}
              <text
                x="110"
                y={y + 4}
                fill="white"
                fontSize="12"
              >

                {mark} cm

              </text>

            </g>

          );

        })}

        {/* Moving Arrow */}
        <polygon
          points={`
            40,${arrowY}
            65,${arrowY - 10}
            65,${arrowY + 10}
          `}
          fill="#ef4444"
        />

        {/* Arrow Shaft */}
        <line
          x1="65"
          y1={arrowY}
          x2="90"
          y2={arrowY}
          stroke="#ef4444"
          strokeWidth="4"
        />

      </svg>

      <div className="mt-3 text-sm text-gray-300">

        Depth:
        {' '}
        {depth.toFixed(2)}
        {' '}
        cm

      </div>

      <div className="text-sm text-gray-500">

        PWM:
        {' '}
        {pwm}

      </div>

      <div className="text-sm text-gray-500">

        Stepper:
        {' '}
        {stepperValue}

      </div>

    </div>

  );

}