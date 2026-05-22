// components/MainTabContainer.jsx
import React, { useState } from 'react';
import OtherFeaturesTab from './OtherFeaturesTab'; // Import the new tab content
// You will also need to import the original components here
import ArmVisualizer from './ArmVisualizer';
import NetworkStatus from './NetworkStatus';
import RoverInfo from './RoverInfo';
import CameraPanel from './CameraPanel';
import MapPanel from './MapPanel';

const MainTabContainer = () => {
  // 1. Manage current tab state ('main' or 'other')
  const [activeTab, setActiveTab] = useState('main');

  // 2. Define the navigation/tab bar component
  const TabBar = () => (
    <div style={{ display: 'flex', borderBottom: '1px solid red', padding: '10px' }}>
      <button
        onClick={() => setActiveTab('main')}
        style={{
          color: activeTab === 'main' ? 'white' : 'red',
          backgroundColor: activeTab === 'main' ? 'red' : 'black',
          marginRight: '10px',
          padding: '5px 15px'
        }}>
        Anveshak Control
      </button>
      <button
        onClick={() => setActiveTab('other')}
        style={{
          color: activeTab === 'other' ? 'white' : 'red',
          backgroundColor: activeTab === 'other' ? 'red' : 'black',
          padding: '5px 15px'
        }}>
        Other Features
      </button>
    </div>
  );

  // 3. Define the main content rendering logic
  const renderMainContent = () => (
    <div className="main-content-panels">
      {/* This is a structural simplified layout of what you have */}
      <div className="top-row" style={{ display: 'flex' }}>
        <ArmVisualizer />
        <NetworkStatus />
        <RoverInfo />
        <CameraPanel />
      </div>
      <div className="map-row" style={{ display: 'flex' }}>
        <MapPanel />
      </div>
    </div>
  );

  // 4. Main return with tab conditional logic
  return (
    <div className="tab-container">
      <TabBar /> {/* Navigation on top */}
      <div className="tab-content" style={{ padding: '20px' }}>
        {activeTab === 'main' ? renderMainContent() : <OtherFeaturesTab />}
      </div>
    </div>
  );
};

export default MainTabContainer;