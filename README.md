import React, { useState } from 'react';
import NetworkDashboard from './views/NetworkDashboard';
import VoiceDashboard from './views/VoiceDashboard';

const App = () => {
  const [currentView, setCurrentView] = useState('network');
  
  const handleAlertClick = (alertId) => {
    console.log('Alert clicked:', alertId);
    // You can implement alert modal functionality here
  };
  
  const handleTabChange = (tab) => {
    setCurrentView(tab.toLowerCase());
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-pink-500 text-white shadow">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center">
            <button className="p-2">
              <svg 
                viewBox="0 0 24 24" 
                width="24" 
                height="24" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-center">
            <svg 
              viewBox="0 0 24 24" 
              width="18" 
              height="18" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="mr-2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M2 12h20"></path>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span>UTC: 14:36</span>
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-sm">Last updated 7m ago</span>
            <button className="p-2">
              <svg 
                viewBox="0 0 24 24" 
                width="18" 
                height="18" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M23 4v6h-6"></path>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
            </button>
            <button className="p-2">
              <svg 
                viewBox="0 0 24 24" 
                width="18" 
                height="18" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </button>
            <div className="ml-2 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
              CV
            </div>
          </div>
        </div>

        {/* Title and subtitle */}
        <div className="px-4 py-2">
          <h1 className="text-xl font-semibold">
            {currentView === 'network' ? 'Network Dashboard' : 
             currentView === 'voice' ? 'Voice Service' :
             currentView === 'data' ? 'Data Service' : 'Messaging Service'}
          </h1>
          <p className="text-sm">One stop solution for network health</p>
        </div>
      </header>
      
      {/* Navigation tabs - white background */}
      <div className="bg-white border-b flex justify-between px-4">
        <div className="flex">
          <button 
            className={`px-4 py-3 ${currentView === 'network' ? 'border-b-2 border-pink-500' : ''}`}
            onClick={() => handleTabChange('network')}
          >
            Overview
          </button>
          <button 
            className={`px-4 py-3 ${currentView === 'voice' ? 'border-b-2 border-pink-500' : ''}`}
            onClick={() => handleTabChange('voice')}
          >
            Voice
          </button>
          <button 
            className={`px-4 py-3 ${currentView === 'data' ? 'border-b-2 border-pink-500' : ''}`}
            onClick={() => handleTabChange('data')}
          >
            Data
          </button>
          <button 
            className={`px-4 py-3 ${currentView === 'messaging' ? 'border-b-2 border-pink-500' : ''}`}
            onClick={() => handleTabChange('messaging')}
          >
            Messaging
          </button>
        </div>
        <div>
          <button className="px-4 py-2 my-2 text-white bg-pink-500 rounded-md flex items-center">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7z" />
              <path d="M13 2v7h7" />
            </svg>
            Report
          </button>
        </div>
      </div>
      
      {/* Main content area */}
      {currentView === 'network' && <NetworkDashboard onAlertClick={handleAlertClick} />}
      {currentView === 'voice' && <VoiceDashboard />}
      {currentView === 'data' && <div className="p-4 text-center text-xl font-medium text-gray-500">Data Dashboard - Coming Soon</div>}
      {currentView === 'messaging' && <div className="p-4 text-center text-xl font-medium text-gray-500">Messaging Dashboard - Coming Soon</div>}
    </div>
  );
};

export default App;
