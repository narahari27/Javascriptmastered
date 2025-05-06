import React from 'react';

const VoiceDashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 h-96">
      <div className="bg-white rounded-lg shadow-lg p-10 max-w-md text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Voice Dashboard</h2>
        <div className="flex items-center justify-center mb-4">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
          <span className="text-yellow-700 font-medium">Coming Soon</span>
        </div>
        <p className="text-gray-600 mb-6">
          We're working on bringing you comprehensive voice service analytics and monitoring tools. 
          Check back soon for real-time call metrics, performance trends, and service health indicators.
        </p>
        <button className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 transition-colors">
          Get Notified When Available
        </button>
      </div>
    </div>
  );
};

export default VoiceDashboard;
