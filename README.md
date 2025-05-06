import React from 'react';
import { Menu, Bell, RefreshCw, Globe } from 'lucide-react';

const Header = ({ currentView, onTabChange }) => {
  return (
    <header>
      {/* Top pink header bar */}
      <div className="bg-pink-500 text-white shadow">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center">
            <button className="p-2">
              <Menu size={20} />
            </button>
          </div>
          <div className="flex items-center justify-center">
            <Globe size={18} className="mr-2" />
            <span>UTC: 14:36</span>
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-sm">Last updated 7m ago</span>
            <button className="p-2">
              <RefreshCw size={18} />
            </button>
            <button className="p-2">
              <Bell size={18} />
            </button>
            <div className="ml-2 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
              CV
            </div>
          </div>
        </div>

        
      </div>
      
      {/* Navigation tabs - white background */}
      <div className="bg-white border-b flex justify-between px-2">
        {/* Title and subtitle */}
        <div className="px-4 py-2">
          <h1 className="text-xl font-semibold">Network Dashboard</h1>
          <p className="text-sm">One stop solution for network health</p>
        </div>
        <div className='flex'>
        <div className="flex">
          <button 
            className={`px-4 py-3 ${currentView === 'network' ? 'border-b-2 border-pink-500' : ''}`}
            onClick={() => onTabChange('Overview')}
          >
            Overview
          </button>
          <button 
            className={`px-4 py-3 ${currentView === 'voice' ? 'border-b-2 border-pink-500' : ''}`}
            onClick={() => onTabChange('Voice')}
          >
            Voice
          </button>
          <button 
            className={`px-4 py-3 ${currentView === 'data' ? 'border-b-2 border-pink-500' : ''}`}
            onClick={() => onTabChange('Data')}
          >
            Data
          </button>
          <button 
            className={`px-4 py-3 ${currentView === 'messaging' ? 'border-b-2 border-pink-500' : ''}`}
            onClick={() => onTabChange('Messaging')}
          >
            Messaging
          </button>
        </div>
        <div>
          <button className="px-4 py-2 my-2 text-white bg-pink-500 rounded-md flex items-center">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 2v7h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Report
          </button>
        </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
