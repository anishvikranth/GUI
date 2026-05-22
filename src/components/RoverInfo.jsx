import { useOdometry } from '../ros/hooks/useOdometry';
import { useGNSS } from '../ros/hooks/useGNSS';
import { useConfig } from '../ros/hooks/useConfig';
import { useArmPWM } from '../ros/hooks/useArmPWM';
import { useDrivePWM } from '../ros/hooks/useDrivePWM';
import { useMode } from '../ros/hooks/useMode';
import { useArmMode } from '../ros/hooks/useArmMode';

export function RoverInfo() {
  const { data: odom } = useOdometry();
  const { data: vel }  = useConfig();
  const { data: gnss } = useGNSS();
  const { data: armPWM }   = useArmPWM();
  const { data: drivePWM } = useDrivePWM();
  const { data: mode }     = useMode();
  const { data: arm_mode } = useArmMode();

  const x        = odom?.position.x.toFixed(3)      ?? '—';
  const y        = odom?.position.y.toFixed(3)      ?? '—';
  const theta    = odom?.position.z.toFixed(3)      ?? '—';
  const velocity = vel?.velocity.linear.toFixed(2)  ?? '—';
  const omega    = vel?.velocity.angular.toFixed(2) ?? '—';
  const lat      = gnss?.latitude.toFixed(6)        ?? '—';
  const long     = gnss?.longitude.toFixed(6)       ?? '—';

  const armValues = armPWM
    ? [armPWM.base, armPWM.shoulder, armPWM.elbow, armPWM.pitch, armPWM.roll, armPWM.gripper]
    : Array(6).fill(null);

  const driveValues = drivePWM
    ? [drivePWM.front_left, drivePWM.front_right, drivePWM.middle_left, drivePWM.middle_right, drivePWM.back_left, drivePWM.back_right]
    : Array(6).fill(null);

  const fmt    = (v) => v != null ? v.toFixed(1) : '—';
  const fmtInt = (v) => v != null ? Math.round(v).toString() : '—';

  const PWMRow = ({ labels, values, fmt }) => (
    <div className="grid grid-cols-6 gap-x-1 text-center">
      {labels.map((lbl, i) => (
        <div key={lbl} className="flex flex-col">
          <span className="text-gray-600 text-[10px]">{lbl}</span>
          <span className="text-gray-300 text-[10px] tabular-nums">{fmt(values[i])}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-black border-2 border-red-600 rounded-lg p-3 w-72 font-mono">

      <h2 className="text-red-600 text-2xl font-bold border-b border-red-600 pb-1 mb-3">
        Rover Info
      </h2>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">Odometry</p>
            <p className="text-gray-300">x &nbsp;&nbsp;{x}</p>
            <p className="text-gray-300">y &nbsp;&nbsp;{y}</p>
            <p className="text-gray-300">θ &nbsp;&nbsp;{theta}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">Velocity</p>
            <p className="text-gray-300">{velocity} m/s</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">Omega</p>
            <p className="text-gray-300">{omega} rad/s</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">Mode</p>
            <p className="text-gray-300">Drive {mode ?? '—'}</p>
            <p className="text-gray-300">Arm {arm_mode ?? '—'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">GNSS</p>
            <p className="text-gray-300 text-xs">Lat {lat}</p>
            <p className="text-gray-300 text-xs">Lon {long}</p>
          </div>

        </div>
      </div>

      <div className="mt-2 pt-1 border-t border-gray-800 flex flex-col gap-2">
        <p className="text-gray-500 text-xs uppercase tracking-widest text-center">Arm</p>
        <PWMRow
          labels={['B', 'S', 'E', 'P', 'R', 'G']}
          values={armValues}
          fmt={fmt}
        />
        <p className="text-gray-500 text-xs uppercase tracking-widest text-center">Drive</p>
        <PWMRow
          labels={['FR', 'FL', 'MR', 'ML', 'BR', 'BL']}
          values={driveValues}
          fmt={fmtInt}
        />
      </div>

    </div>
  );
}