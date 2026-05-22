// components/CameraFeed.jsx
import React from 'react';

const CameraFeed = ({ width = "800px", height = "450px", feed_name = "Feed" }) => {
  return (
    // We use style for the dimensions to ensure exact pixel control 
    // while keeping Tailwind for the borders and background
    <div 
      className="border-2 border-red-600 bg-black relative overflow-hidden group"
      style={{ width: width, height: height, borderRadius: 10}}
    >
      {/* HUD Overlay */}
      <div className="absolute top-2 left-2 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-600 animate-pulse rounded-full"></div>
          <span className="text-red-600 text-xs font-mono font-bold tracking-widest uppercase">
            Camera Feed {feed_name} // IP_RELAY_ACTIVE
          </span>
        </div>
      </div>

      <div className="w-full h-full flex items-center justify-center">
        <div className="text-red-900 font-mono text-sm">
          [ WAITING FOR STREAM DATA... ]
        </div>
      </div>

      <div className="absolute bottom-2 right-2 text-[10px] text-red-600/50 font-mono">
        FFMPEG_RELAY_V01
      </div>
    </div>
  );
};

export default CameraFeed;