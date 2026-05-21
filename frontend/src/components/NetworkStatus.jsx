import { useRoverState } from '../ros/hooks/useRoverState';

export function NetworkStatus() {
  const { network: devices } = useRoverState();

  const dotColor = (online) => {
    if (online === null) return 'bg-gray-500';   // still pinging
    return online ? 'bg-green-500' : 'bg-red-500';
  };

  return (
    <div className="bg-black border-2 border-red-600 rounded-xl p-3 flex flex-col gap-2 w-fit font-mono">
      <h2 className="text-red-600 font-semibold text-left mb-1 text-2xl border-b">Network Status</h2>
      
      {/* 💡 Added ?. to safely handle when data is still loading */}
      {devices?.map(device => (
        <div key={device.name} className="grid grid-cols-[1fr_1.1fr_0.25fr] items-center px-2 py-1">
          <span className="text-gray-300 font-bold text-sm">{device.name}</span>
          <span className="text-gray-600 text-sm text-center">{device.ip}</span>
          <div className="flex justify-end">
            <div className={`w-3 h-3 rounded-full ${dotColor(device.online)}`} />
          </div>
        </div>
      ))}

      {/* Optional: Show a quick message if the array is empty/loading */}
      {!devices && <span className="text-gray-500 text-xs text-center">Awaiting stream...</span>}
    </div>
  );
}