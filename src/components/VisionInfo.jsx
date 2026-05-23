// Import the relevant topics once finalized

export function VisionInfo() {
    const aruco_id = '—';
    const aruco_x = '—';
    const aruco_y = '—';
    const aruco_z = '—';
    const aruco_yaw = '—';
    const min_obstacle_dist = '—';
    const obj_name = '—';
    const obj_x = '—';
    const obj_y = '—';
    const obj_z = '—';
    const obj_yaw = '—';

    return (
        <div className="bg-black border-2 border-red-600 rounded-lg p-3 w-72 font-mono">

        <h2 className="text-red-600 text-2xl font-bold border-b border-red-600 pb-1 mb-3">
            Vision and obstacle Info
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="flex flex-col gap-2">
                <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest">Aruco Parameters</p>
                <p className="text-gray-300">ID &nbsp;&nbsp;{aruco_id}</p>
                <p className="text-gray-300">x &nbsp;&nbsp;{aruco_x}</p>
                <p className="text-gray-300">y &nbsp;&nbsp;{aruco_y}</p>
                <p className="text-gray-300">z &nbsp;&nbsp;{aruco_z}</p>
                <p className="text-gray-300">θ &nbsp;&nbsp;{aruco_yaw}</p>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest">Object Parameters</p>
                <p className="text-gray-300">Name &nbsp;&nbsp;{obj_name}</p>
                <p className="text-gray-300">x &nbsp;&nbsp;{obj_x}</p>
                <p className="text-gray-300">y &nbsp;&nbsp;{obj_y}</p>
                <p className="text-gray-300">z &nbsp;&nbsp;{obj_z}</p>
                <p className="text-gray-300">θ &nbsp;&nbsp;{obj_yaw}</p>
                </div>

            </div>
            </div>
            <div className="mt-2 pt-1 border-t border-gray-800 flex flex-col gap-2">
                <p className="text-gray-500 text-xs uppercase tracking-widest">Minimum Obstacle Distance</p>
                <p className="text-gray-300">{min_obstacle_dist} m</p>
            </div>
    </div>
    );
}