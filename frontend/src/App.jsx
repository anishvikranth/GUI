import { NetworkStatus } from "./components/NetworkStatus";
import { RoverInfo } from "./components/RoverInfo";
import { Title } from "./components/Title";
import { CameraPanel } from "./components/CameraPanel";
import React, { useState } from "react";
import { NeonAnveshakLogo } from "./components/NeonAnveshakLogo";
import { MapPanel } from "./components/MapPanel";
import { ArmVisualizer } from "./components/ArmVisualizer";

function App() {
  const [isStarting, setIsStarting] = useState(false);
  const [showUI, setShowUI] = useState(false);

  const handleStart = () => {
    // 1. Immediately trigger the expanding border animation
    setIsStarting(true);
    
    // 2. Wait exactly 200ms, then fade in the internal UI components
    setTimeout(() => {
      setShowUI(true);
    }, 200); 
  };

  return (
    <div className="bg-stone-950 min-h-screen flex items-center justify-center relative overflow-hidden p-2">
      
      {/* Start Screen (Disappears when clicked) */}
      {!isStarting && (
        <div onClick={handleStart} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-50 bg-stone-950">
          <NeonAnveshakLogo />
        </div>
      )}

      {/* The Expanding Container */}
      <div 
        className={`relative w-full h-[calc(100vh-16px)] p-6 flex transition-transform duration-500 ease-out origin-center ${
          isStarting ? "scale-100" : "scale-0"
        }`}
      >
        
        {/* Corner Arc Borders (HUD Style) */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-red-600 rounded-tl-3xl pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-red-600 rounded-tr-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-red-600 rounded-bl-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-red-600 rounded-br-3xl pointer-events-none"></div>

        {/* The Internal UI (Fades in after the 200ms delay) */}
        <div 
          className={`transition-opacity duration-700 ease-in-out h-full w-full ${
            showUI ? "opacity-100" : "opacity-0"
          }`}
        >
          <Title />
          <div className="flex flex-row flex-wrap gap-2 mt-4">
            <ArmVisualizer />
            <NetworkStatus />
            <RoverInfo />
            <CameraPanel />
            <MapPanel />
            
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;