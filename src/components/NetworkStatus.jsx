import { useNetworkStatus } from '../ros/hooks/useNetworkStatus';


// // This below section is for only testing
// const useNetworkStatus = () => ({
//   connected: true,
//   devices: [
//     { name: 'Orin', ip: '10.42.0.253', online: true },
//     { name: 'Xavier', ip: '10.42.0.51', online: true },
//     { name: 'IMOU', ip: '10.42.0.69', online: false },
//     { name: 'Rover Mikrotik', ip: '10.42.0.100', online: false },
//     { name: 'Base Mikrotik', ip: '10.42.0.99', online: false },
//   ]
// })

export function NetworkStatus() {
  const { devices } = useNetworkStatus();

  const dotColor = (online) => {
    if (online === null) return 'bg-gray-500';   // still pinging
    return online ? 'bg-green-500' : 'bg-red-500';
  };

  return (
    <div className="bg-black border-2 border-red-600 rounded-xl p-3 flex flex-col gap-2 w-fit font-mono">
      <h2 className="text-red-600 font-semibold text-left mb-1 text-2xl border-b">Network Status</h2>
      {devices.map(device => (
        <div key={device.name} className="grid grid-cols-[1fr_1.1fr_0.25fr] items-center px-2 py-1">
          <span className="text-gray-300 font-bold text-sm">{device.name}</span>
          <span className="text-gray-600 text-sm text-center">{device.ip}</span>
          <div className="flex justify-end">
            <div className={`w-3 h-3 rounded-full ${dotColor(device.online)}`} />
          </div>
        </div>
      ))}
    </div>
  );
}