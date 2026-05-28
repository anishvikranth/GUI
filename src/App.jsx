import { NetworkStatus } from "./components/NetworkStatus";
import { RoverInfo } from "./components/RoverInfo";
import { Title } from "./components/Title";
import { CameraPanel } from "./components/CameraPanel";
import CameraFeed from "./components/CameraFeed";
import { VisionInfo } from "./components/VisionInfo";
import { AstrobioPanel } from "./components/AstrobioPanel";


import React, { useState } from "react";
import { NeonAnveshakLogo } from "./components/NeonAnveshakLogo";
import { MapPanel } from "./components/MapPanel";
import { ArmVisualizer } from "./components/ArmVisualizer";
import { AugerVisualizer } from './components/AugerVisualizer';
import OrinHealthPanel from "./components/OrinHealthPanel";


// Maintenance imports
// import Maintenance_tab from './components/Maintenance_tab';
import './index.css';
import { DrillPanel } from "./components/DrillPanel";
import { PumpPanel } from "./components/PumpPanel";
import { LidPanel } from "./components/LidPanel";
import { StepperPanel } from "./components/StepperPanel";

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
    <div className="bg-stone-950 min-h-screen flex items-center justify-center relative overflow-visible p-2">
      
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
          <OrinHealthPanel></OrinHealthPanel>
          {/* Tab Navigation */}
          <div className="flex gap-4 mt-4 mb-2 font-mono">
            {/* <button onClick={() => setActiveTab('main')} className={`px-4 py-1 border ${activeTab === 'main' ? 'bg-red-600 text-white' : 'text-red-600 border-red-600'}`}>MAIN SYSTEMS</button> */}
            <button onClick={() => setActiveTab('maintenance')} className={`px-4 py-1 rounded-xl border ${activeTab === 'maintenance' ? 'bg-red-600 text-white' : 'text-red-600 border-red-600'}`}>MAINTENANCE MISSION</button>
            <button onClick={() => setActiveTab('navigation')} className={`px-4 py-1 rounded-xl border ${activeTab === 'navigation' ? 'bg-red-600 text-white' : 'text-red-600 border-red-600'}`}>NAVIGATION MISSION</button>
            <button onClick={() => setActiveTab('astrobio')} className={`px-4 py-1 rounded-xl border ${activeTab === 'astrobio' ? 'bg-red-600 text-white' : 'text-red-600 border-red-600'}`}>ASTROBIO MISSION</button>
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

            {activeTab === 'maintenance' && (
              <div className="w-full h-[calc(100vh-180px)] grid grid-cols-12 gap-3 overflow-hidden">

                {/* LEFT */}
                <div className="col-span-5 flex flex-col gap-3 min-h-0">

                  <div className="shrink-0">
                    <ArmVisualizer />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <NetworkStatus />
                    <VisionInfo />
                  </div>

                  <div className="shrink-0">
                    <CameraPanel />
                  </div>

                </div>

                {/* RIGHT */}
                <div className="col-span-7 grid grid-rows-2 gap-3 min-h-0">

                  <div className="min-h-0">
                    <CameraFeed width="100%" height="100%" feed_name="1" />
                  </div>

                  <div className="min-h-0">
                    <CameraFeed width="100%" height="100%" feed_name="2" />
                  </div>

                </div>

              </div>
            )}
             

            {activeTab === 'navigation' && (
              <div className="w-full h-[calc(100vh-180px)] grid grid-cols-12 gap-3 overflow-hidden">

                {/* TOP ROW */}
                <div className="col-span-3">
                  <NetworkStatus />
                </div>

                <div className="col-span-3">
                  <RoverInfo />
                </div>

                {/* SWITCHED HERE */}
                <div className="col-span-6">
                  <MapPanel />
                </div>

                {/* BOTTOM ROW */}
                <div className="col-span-3">
                  <CameraPanel />
                </div>

                <div className="col-span-3">
                  <VisionInfo />
                </div>

                <div className="col-span-6">
                  <CameraFeed
                    width="100%"
                    height="100%"
                    feed_name="1"
                  />
                </div>

              </div>
            )}

            {activeTab === 'astrobio' && (
              <div className="w-full h-[calc(100vh-180px)] grid grid-cols-12 gap-3 overflow-hidden">

                {/* LEFT - Auger + Astrobio + CameraPanel stacked */}
                <div className="col-span-5 flex flex-col gap-3 min-h-0 overflow-hidden">

                  <div className="shrink-0">
                    <AugerVisualizer />
                  </div>

                  <div className="shrink-0">
                    <AstrobioPanel />
                  </div>

                  {/* CameraPanel fills remaining left space */}
                  <div className="flex-1 min-h-0">
                    <CameraPanel />
                  </div>

                </div>

                {/* RIGHT - Two feeds splitting full height equally */}
                <div className="col-span-7 flex flex-col gap-3 min-h-0">

                  <div className="flex-1 min-h-0">
                    <CameraFeed width="100%" height="100%" feed_name="1" />
                  </div>

                  <div className="flex-1 min-h-0">
                    <CameraFeed width="100%" height="100%" feed_name="2" />
                  </div>

                </div>

              </div>
            )}

</div>
        </div>

      </div>
    </div>
  );
}

export default App;