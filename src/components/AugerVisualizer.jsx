import { useDrill } from '../ros/hooks/useDrill';

export function AugerVisualizer() {

  const drill = useDrill();

  const direction = drill.data?.direction ?? 0;
  const magnitude = drill.data?.magnitude ?? 0;

  const spinning = magnitude > 0;

  const duration =
    magnitude > 0
      ? `${Math.max(0.2, 1.5 - magnitude / 255)}s`
      : '0s';

  return (

    <div className="bg-black border-2 border-red-600 rounded-xl p-3 font-mono w-fit">

      <h2 className="text-red-600 text-2xl border-b border-red-600 mb-2">
        Auger Visualizer
      </h2>

      <svg
        width="220"
        height="320"
        className="bg-zinc-900 rounded-lg"
        style={{
          perspective: '800px'
        }}
      >

        {/* Motor Housing */}
        <rect
          x="70"
          y="15"
          width="80"
          height="45"
          rx="6"
          fill="#374151"
        />

        {/* Top Shaft */}
        <rect
          x="106"
          y="60"
          width="8"
          height="35"
          rx="3"
          fill="#9ca3af"
        />

        {/* Main Shaft */}
        <rect
          x="104"
          y="95"
          width="12"
          height="170"
          rx="6"
          fill="#d1d5db"
        />

        {/* Rotating Auger Flights */}
        <g
          style={{

            animation: spinning
              ? `augerSpin ${duration} linear infinite`
              : 'none',
            transformOrigin: '50px 180px',
            transformBox: 'fill-box',
            animationDirection:
              direction === -1
                ? 'reverse'
                : 'normal',
          }}
        >

          {[0, 45, 90, 135].map((y) => (

            <ellipse
              key={y}
              cx="110"
              cy={120 + y}
              rx="48"
              ry="12"
              fill="none"
              stroke="#ef4444"
              strokeWidth="8"
            />

          ))}

        </g>

        {/* Drill Tip */}
        <polygon
          points="110,285 95,260 125,260"
          fill="#9ca3af"
        />

      </svg>

      <div className="mt-2 text-sm text-gray-300">
        PWM: {direction * magnitude}
      </div>

    </div>

  );
}