import { useRoverState } from '../ros/hooks/useRoverState';

export function RoverInfo() {
  const { 
    odometry: odom, 
    config: vel, 
    gnss, 
    arm_pwm: armPWM, 
    drive_pwm: drivePWM,
    connected 
  } = useRoverState();

  const x        = odom?.position?.x?.toFixed(3)      ?? '—';
  const y        = odom?.position?.y?.toFixed(3)      ?? '—';
  const theta    = odom?.position?.z?.toFixed(3)      ?? '—';
  const velocity = vel?.velocity?.linear?.toFixed(2)  ?? '—';
  const omega    = vel?.velocity?.angular?.toFixed(2) ?? '—';
  const lat      = gnss?.latitude?.toFixed(6)        ?? '—';
  const long     = gnss?.longitude?.toFixed(6)       ?? '—';
  
  const armValues = armPWM
    ? [armPWM.base, armPWM.shoulder, armPWM.elbow, armPWM.pitch, armPWM.roll, armPWM.gripper]
    : Array(6).fill(null);

  const driveValues = drivePWM
    ? [drivePWM.front_left, drivePWM.front_right, drivePWM.middle_left, drivePWM.middle_right, drivePWM.back_left, drivePWM.back_right]
    : Array(6).fill(null);

  const fmt = (v) => (v !== null && v !== undefined) ? v.toFixed(1) : '—';

  return (
    <div className="bg-black border-2 border-red-600 rounded-lg p-3 w-64 font-mono">

      {/* Title */}
      <h2 className="text-red-600 text-2xl font-bold border-b border-red-600 pb-1 mb-3">
        Rover Info {!connected && <span className="text-xs text-red-500 animate-pulse">(OFFLINE)</span>}
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
            <p className="text-gray-300">v &nbsp;&nbsp;{velocity}</p>
            <p className="text-gray-300">ω &nbsp;&nbsp;{omega}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">GNSS</p>
            <p className="text-gray-300">lat {lat}</p>
            <p className="text-gray-300">lon {long}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-l border-gray-800 pl-4">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">Arm PWM</p>
            <div className="grid grid-cols-2 gap-x-2">
              {armValues.map((v, i) => (
                <p key={i} className="text-gray-300 text-xs">{fmt(v)}</p>
              ))}
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">Drive PWM</p>
            <div className="grid grid-cols-2 gap-x-2">
              {driveValues.map((v, i) => (
                <p key={i} className="text-gray-300 text-xs">{fmt(v)}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
