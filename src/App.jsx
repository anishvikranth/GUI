import { NetworkStatus } from "./components/NetworkStatus";
import { RoverInfo } from "./components/RoverInfo";
import { Title } from "./components/Title";
import { CameraPanel } from "./components/CameraPanel";
import CameraFeed from "./components/CameraFeed"
import React, { useState } from "react";
import { NeonAnveshakLogo } from "./components/NeonAnveshakLogo";
import { MapPanel } from "./components/MapPanel";
import { ArmVisualizer } from "./components/ArmVisualizer";
import OrinHealthPanel from "./components/OrinHealthPanel";

// Maintenance imports
// import Maintenance_tab from './components/Maintenance_tab';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('main');
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
          {/* Tab Navigation */}
          <div className="flex gap-4 mt-4 mb-2 font-mono">
            {/* <button onClick={() => setActiveTab('main')} className={`px-4 py-1 border ${activeTab === 'main' ? 'bg-red-600 text-white' : 'text-red-600 border-red-600'}`}>MAIN SYSTEMS</button> */}
            <button onClick={() => setActiveTab('maintenance')} className={`px-4 py-1 border ${activeTab === 'maintenance' ? 'bg-red-600 text-white' : 'text-red-600 border-red-600'}`}>MAINTENANCE MISSION</button>
            <button onClick={() => setActiveTab('navigation')} className={`px-4 py-1 border ${activeTab === 'navigation' ? 'bg-red-600 text-white' : 'text-red-600 border-red-600'}`}>NAVIGATION MISSION</button>
          </div>

          {/* Conditional Rendering */}
          <div className="flex flex-row flex-wrap gap-2">
            
            {/* Tab 1: Main */}
            {/* {activeTab === 'main' && (
              <>
                <ArmVisualizer />
                <NetworkStatus />
                <RoverInfo />
                <CameraPanel />
                <MapPanel />
                <OrinHealthPanel />
              </>
            )} */}

            {/* Tab 1: Maintenance */}
            {activeTab === 'maintenance' && (
              <>
                <ArmVisualizer />
                <NetworkStatus />
                <CameraPanel />
                <OrinHealthPanel />
                {/* Large Primary Feed */}
                <CameraFeed width="500px" height="400px" feed_name="1" />
                
                {/* Small Secondary Feed (if you want to call it again) */}
                <CameraFeed width="900px" height="400px" feed_name="2"/>
              </>
            )}

            {/* Tab 2: Navigation */}
            {activeTab === 'navigation' && (
              <>
                <NetworkStatus />
                <RoverInfo />
                <CameraPanel />
                <MapPanel />
                <OrinHealthPanel />
                <CameraFeed />
                {/* Large Primary Feed */}
                <CameraFeed width="500px" height="400px" feed_name="1" />
                
                {/* Small Secondary Feed (if you want to call it again) */}
                <CameraFeed width="900px" height="400px" feed_name="2"/>
              </>
            )}

</div>
        </div>

      </div>
    </div>
  );
}

export default App;