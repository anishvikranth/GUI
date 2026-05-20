import { useOdometry } from '../ros/hooks/useOdometry';
import { useGNSS } from '../ros/hooks/useGNSS';
import { useConfig } from '../ros/hooks/useConfig';
import { useArmPWM } from '../ros/hooks/useArmPWM';
import { useDrivePWM } from '../ros/hooks/useDrivePWM';

export function RoverInfo() {
  const { data: odom, connected } = useOdometry();
  const { data: vel }  = useConfig();
  const { data: gnss } = useGNSS();
  const { data: armPWM }   = useArmPWM();
  const { data: drivePWM } = useDrivePWM();

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

  const fmt = (v) => v?.toFixed(1) ?? '—';
  const fmtInt = (v) => v != null ? Math.round(v).toString() : '—';

  return (
    <div className="bg-black border-2 border-red-600 rounded-lg p-3 w-64 font-mono">

      {/* Title */}
      <h2 className="text-red-600 text-2xl font-bold border-b border-red-600 pb-1 mb-3">
        Rover Info
      </h2>

      {/* Odom / velocity / GNSS */}
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
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">Omega</p>
            <p className="text-gray-300">{omega} rad/s</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">GNSS</p>
            <p className="text-gray-300">Lat {lat}</p>
            <p className="text-gray-300">Lon {long}</p>
          </div>
        </div>
      </div>

      {/* PWM section */}
      <div className="mt-2 pt-1 border-t border-gray-800 flex flex-col gap-2">

        {/* Arm PWM */}
        <p className="text-gray-500 text-xs uppercase tracking-widest text-center">Arm</p>
        <div className="grid grid-cols-6 text-center">
          {/* {['B', 'S', 'E', 'P', 'R', 'G'].map((lbl) => (
            <span key={lbl} className="text-gray-600 text-xs">{lbl}</span>
          ))} */}
          {armValues.map((v, i) => (
            <span key={i} className="text-gray-300 text-xs tabular-nums">{fmt(v)}</span>
          ))}
        </div>

        {/* Drive PWM */}
        <p className="text-gray-500 text-xs uppercase tracking-widest text-center">Drive</p>
        <div className="grid grid-cols-6 text-center">
          {/* {['FL', 'FR', 'ML', 'MR', 'BL', 'BR'].map((lbl) => (
            <span key={lbl} className="text-gray-600 text-xs">{lbl}</span>
          ))} */}
          {driveValues.map((v, i) => (
            <span key={i} className="text-gray-300 text-xs tabular-nums">{fmtInt(v)}</span>
          ))}
        </div>

      </div>
    </div>
  );
}