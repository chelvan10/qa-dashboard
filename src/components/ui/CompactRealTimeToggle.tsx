"use client";

import React, { useState } from 'react';

interface CompactRealTimeToggleProps {
  isRealTime: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
}

export function CompactRealTimeToggle({ 
  isRealTime, 
  onToggle, 
  className = '' 
}: CompactRealTimeToggleProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div 
        className="flex items-center space-x-2 group"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className="text-xs font-medium text-gray-600">Data:</span>
        <button
          onClick={() => onToggle(!isRealTime)}
          className={`
            relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
            transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${isRealTime ? 'bg-blue-600' : 'bg-gray-200'}
          `}
        >
          <span
            className={`
              pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 
              transition duration-200 ease-in-out
              ${isRealTime ? 'translate-x-4' : 'translate-x-0'}
            `}
          />
        </button>
        <span className={`text-xs font-medium ${isRealTime ? 'text-blue-600' : 'text-gray-500'}`}>
          {isRealTime ? 'Live' : 'Mock'}
        </span>
        
        {/* Status Indicator */}
        <div className={`w-2 h-2 rounded-full ${isRealTime ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50">
          <div className="font-medium mb-1">
            {isRealTime ? 'Real-time Data Active' : 'Mock Data Mode'}
          </div>
          <div className="text-gray-300">
            {isRealTime 
              ? 'Connected to external systems: Jira, BrowserStack, Bitbucket, APIs'
              : 'Using sample data for demonstration. Toggle to enable live integrations.'
            }
          </div>
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}
