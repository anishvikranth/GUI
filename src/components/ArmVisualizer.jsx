import { useEncoderAngles } from '../ros/hooks/useEncoderAngles';
import { useArmState } from '../ros/hooks/useArmState';
import { useInputSpace } from '../ros/hooks/useInputSpace';

// ─── Kinematics config ───────────────────────────────────────────────────────
const L = { shoulder: 0.46 * 250, elbow: 0.2 * 250, wrist: 0.15 * 250 };

const SVG_W = 350;
const SVG_H = 225;
const BASE = { x: 30, y: 195 };

const DEG2RAD = Math.PI / 180;

// ─── 2D planar forward kinematics ────────────────────────────────────────────
// Expects angles in RADIANS internally.
function fk(shoulder, elbow, pitch) {
  const a1 = shoulder;
  const p1 = {
    x: BASE.x + L.shoulder * Math.cos(a1),
    y: BASE.y - L.shoulder * Math.sin(a1),
  };
  const a2 = a1 + elbow;
  const p2 = {
    x: p1.x + L.elbow * Math.cos(a2),
    y: p1.y - L.elbow * Math.sin(a2),
  };
  const a3 = a2 + pitch;
  const p3 = {
    x: p2.x + L.wrist * Math.cos(a3),
    y: p2.y - L.wrist * Math.sin(a3),
  };
  return [p1, p2, p3];
}

// ─── Gripper jaws ────────────────────────────────────────────────────────────
function GripperJaws({ tipPrev, tip, gripperDeg }) {
  const dx = tip.x - tipPrev.x;
  const dy = tip.y - tipPrev.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const fwd = { x: dx / len, y: dy / len };
  const side = { x: -dy / len, y: dx / len };

  const jawLen = 24;
  // clamp gripper degrees (0–90 deg range typical for a gripper)
  const gap = 5 + Math.max(0, Math.min(gripperDeg, 90)) * 0.12;

  return (
    <>
      {[1, -1].map((sign) => (
        <line
          key={sign}
          x1={tip.x + sign * gap * side.x}
          y1={tip.y + sign * gap * side.y}
          x2={tip.x + sign * gap * side.x + jawLen * fwd.x}
          y2={tip.y + sign * gap * side.y + jawLen * fwd.y}
          stroke="#6b7280"
          strokeWidth={4}
          strokeLinecap="round"
        />
      ))}
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ArmVisualizer() {
  const { connected, data } = useEncoderAngles();
  const { data: isAutonomous } = useArmState();    // true → autonomous, false → manual
  const { data: isPosition }   = useInputSpace();  // true → position space, false → joint space

  // hook returns all angles in DEGREES
  const { base, shoulder, elbow, pitch, roll, gripper } = data ?? {
    base: 0,
    shoulder: 49,   // ~0.85 rad
    elbow: -60,     // ~-1.05 rad
    pitch: -26,     // ~-0.45 rad
    roll: 0,
    gripper: 23,    // ~0.4 rad
  };

  // Convert to radians only for FK geometry
  const [p1, p2, p3] = fk(shoulder * DEG2RAD, elbow * DEG2RAD, pitch * DEG2RAD);

  const eeX = (p3.x - BASE.x).toFixed(0);
  const eeY = (BASE.y - p3.y).toFixed(0);

  const readouts = [
    { label: 'Base',     value: base,     inPlane: false },
    { label: 'Shoulder', value: shoulder, inPlane: true  },
    { label: 'Elbow',    value: elbow,    inPlane: true  },
    { label: 'Pitch',    value: pitch,    inPlane: true  },
    { label: 'Roll',     value: roll,     inPlane: false },
    { label: 'Gripper',  value: gripper,  inPlane: false },
  ];

  return (
    <div className="bg-black border-2 border-red-600 rounded-xl p-3 font-mono flex flex-col gap-3 h-full min-h-0 w-full overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-red-600 pb-1">
        <h2 className="text-red-600 font-semibold text-2xl">Arm Visualizer</h2>
        <span className={`text-sm ${connected ? 'text-green-500' : 'text-red-500'}`}>
          {connected ? '● live' : '● disconnected'}
        </span>
      </div>

      <div className="flex gap-4 items-start">

        {/* ── SVG canvas ── */}
        <svg
          width={SVG_W}
          height={SVG_H}
          className="rounded-lg bg-zinc-900 shrink-0"
        >
          {/* Subtle grid */}
          {Array.from({ length: Math.ceil(SVG_W / 30) }).map((_, i) => (
            <line key={`v${i}`} x1={i * 30} y1={0} x2={i * 30} y2={SVG_H} stroke="#ffffff08" strokeWidth={1} />
          ))}
          {Array.from({ length: Math.ceil(SVG_H / 30) }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 30} x2={SVG_W} y2={i * 30} stroke="#ffffff08" strokeWidth={1} />
          ))}

          {/* Base mount block */}
          <rect x={BASE.x - 22} y={BASE.y - 14} width={22} height={28} rx={3} fill="#1f2937" stroke="#374151" strokeWidth={1.5} />
          <line x1={BASE.x - 20} y1={BASE.y} x2={BASE.x - 2} y2={BASE.y} stroke="#374151" strokeWidth={1} />
          <line x1={BASE.x - 11} y1={BASE.y - 12} x2={BASE.x - 11} y2={BASE.y + 12} stroke="#374151" strokeWidth={1} />

          {/* Links */}
          <line x1={BASE.x} y1={BASE.y} x2={p1.x} y2={p1.y} stroke="#374151" strokeWidth={12} strokeLinecap="round" />
          <line x1={BASE.x} y1={BASE.y} x2={p1.x} y2={p1.y} stroke="#4b5563" strokeWidth={8}  strokeLinecap="round" />

          <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#374151" strokeWidth={9}  strokeLinecap="round" />
          <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#4b5563" strokeWidth={6}  strokeLinecap="round" />

          <line x1={p2.x} y1={p2.y} x2={p3.x} y2={p3.y} stroke="#374151" strokeWidth={7}  strokeLinecap="round" />
          <line x1={p2.x} y1={p2.y} x2={p3.x} y2={p3.y} stroke="#4b5563" strokeWidth={4}  strokeLinecap="round" />

          {/* Gripper jaws — degrees passed directly, gap math handles unit */}
          <GripperJaws tipPrev={p2} tip={p3} gripperDeg={gripper} />

          {/* Joints */}
          <circle cx={BASE.x} cy={BASE.y} r={16} fill="#1f2937" stroke="#dc2626" strokeWidth={2.5} />
          <circle cx={BASE.x} cy={BASE.y} r={7}  fill="#374151" stroke="#dc2626" strokeWidth={1.5} />
          <circle cx={BASE.x} cy={BASE.y} r={3}  fill="#dc2626" />

          <circle cx={p1.x} cy={p1.y} r={13} fill="#1f2937" stroke="#6b7280" strokeWidth={2} />
          <circle cx={p1.x} cy={p1.y} r={6}  fill="#374151" stroke="#6b7280" strokeWidth={1} />
          <circle cx={p1.x} cy={p1.y} r={2.5} fill="#9ca3af" />

          <circle cx={p2.x} cy={p2.y} r={9}  fill="#1f2937" stroke="#6b7280" strokeWidth={1.5} />
          <circle cx={p2.x} cy={p2.y} r={3.5} fill="#374151" />
        </svg>

        {/* ── Joint readouts ── */}
        <div className="flex flex-col min-w-35">
          {readouts.map(({ label, value, inPlane }) => (
            <div key={label} className="grid grid-cols-[72px_54px_10px] items-center gap-0.5">
              <span className="text-gray-300 text-sm">{label}</span>
              <span className="text-gray-500 text-sm text-right tabular-nums">
                {value}°
              </span>
            </div>
          ))}

        {/* ── Mode & input space ── */}
        <div className="mt-2 pt-2 border-t border-gray-800 flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-1">
                <span className="text-gray-500 text-xs">Mode</span>
                <span className={`text-xs font-semibold ${isAutonomous ? 'text-yellow-400' : 'text-green-400'}`}>
                {isAutonomous ? 'AUTO' : 'MANUAL'}
                </span>
            </div>
            <div className="flex items-center justify-between px-1">
                <span className="text-gray-500 text-xs">Input</span>
                <span className="text-gray-300 text-xs">
                {isPosition ? 'Position' : 'Joint'}
                </span>
            </div>
        </div>
        </div>
      </div>
    </div>
  );
}