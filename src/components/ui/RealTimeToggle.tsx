'use client';

import React, { useState, useEffect } from 'react';
import { dataManager } from '@/lib/dataManager';

interface RealTimeToggleProps {
  className?: string;
}

export function RealTimeToggle({ className = '' }: RealTimeToggleProps) {
  const [isRealTime, setIsRealTime] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize state from data manager
    if (dataManager) {
      setIsRealTime(dataManager.isRealTimeEnabled());
    }
  }, []);

  const handleToggle = async () => {
    if (!dataManager) return;
    
    setIsLoading(true);
    try {
      const newState = !isRealTime;
      dataManager.setRealTimeMode(newState);
      setIsRealTime(newState);
      
      // Optional: Show toast notification
      if (newState) {
        console.log('Real-time mode enabled. Dashboard will show live data from external sources.');
      } else {
        console.log('Real-time mode disabled. Dashboard will show data from forms.');
      }
    } catch (error) {
      console.error('Failed to toggle real-time mode:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[280px]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              Real-time Data
            </span>
            <span className="text-xs text-gray-500">
              {isRealTime 
                ? 'Live data from external sources' 
                : 'Static data from forms'
              }
            </span>
          </div>
          
          <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${isRealTime 
                ? 'bg-blue-600' 
                : 'bg-gray-200'
              }
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            role="switch"
            aria-checked={isRealTime}
            aria-label="Toggle real-time data mode"
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${isRealTime ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
        
        {/* Status Indicator */}
        <div className="mt-2 flex items-center space-x-2">
          <div 
            className={`
              w-2 h-2 rounded-full
              ${isRealTime 
                ? 'bg-green-500 animate-pulse' 
                : 'bg-gray-400'
              }
            `}
          />
          <span className="text-xs text-gray-600">
            {isRealTime ? 'Connected to live sources' : 'Using form data'}
          </span>
        </div>

        {/* Quick Info */}
        {isRealTime && (
          <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
            <p className="text-xs text-blue-700">
              📊 Dashboards now display real-time data from:
            </p>
            <ul className="text-xs text-blue-600 mt-1 space-y-1">
              <li>• Jira (Defects, Stories, Sprints)</li>
              <li>• BrowserStack (Test Results)</li>
              <li>• Bitbucket (Build Status)</li>
              <li>• Custom APIs (Performance, Security)</li>
            </ul>
          </div>
        )}

        {!isRealTime && (
          <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
            <p className="text-xs text-gray-700">
              📝 Dashboards show data from manually entered forms.
              Enable real-time mode for live external data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
