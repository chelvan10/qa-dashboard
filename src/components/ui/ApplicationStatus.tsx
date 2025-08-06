'use client';

import React, { useState, useEffect } from 'react';
import { database, ragColors, getRAGStatus, ApplicationStatusType, ApplicationStatusRecord } from '@/lib/database';

interface ApplicationStatusTileProps {
  applicationName: string;
  initialStatus?: Partial<ApplicationStatusType>;
  showEditButton?: boolean;
  onStatusUpdate?: (status: ApplicationStatusType) => void;
}

export function ApplicationStatusTile({ 
  applicationName, 
  initialStatus,
  showEditButton = false,
  onStatusUpdate 
}: ApplicationStatusTileProps) {
  const [status, setStatus] = useState<ApplicationStatusType>({
    health: 'good',
    ragColor: 'green',
    sprint: 'Sprint 23.4',
    daysLeft: 5,
    testCoverage: 85,
    testsPassed: 80,
    ...initialStatus
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // Load status from database on mount
  useEffect(() => {
    const loadStatus = async () => {
      const savedStatus = database.getApplicationStatus(applicationName);
      if (savedStatus && typeof savedStatus === 'object' && 'status' in savedStatus) {
        const statusRecord = savedStatus as ApplicationStatusRecord;
        setStatus(statusRecord.status);
        setLastUpdated(new Date(statusRecord.timestamp));
      }
    };
    loadStatus();
  }, [applicationName]);

  const ragStyle = ragColors[status.ragColor];

  const handleStatusChange = async (newStatus: Partial<ApplicationStatusType>) => {
    const updatedStatus = { ...status, ...newStatus };
    setStatus(updatedStatus);
    
    // Save to database with timestamp
    await database.saveApplicationStatus(applicationName, updatedStatus);
    setLastUpdated(new Date());
    
    // Notify parent component
    onStatusUpdate?.(updatedStatus);
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent': return '🟢';
      case 'good': return '🔵';
      case 'warning': return '🟡';
      case 'critical': return '🔴';
      default: return '⚪';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isEditing) {
    return (
      <div className={`p-4 rounded-lg border-2 ${ragStyle.bg} ${ragStyle.border}`}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">{applicationName}</h4>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>

          {/* Health Status */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Health Status</label>
            <select
              value={status.health}
              onChange={(e) => {
                const health = e.target.value as ApplicationStatusType['health'];
                const ragColor = getRAGStatus(health);
                handleStatusChange({ health, ragColor });
              }}
              className="w-full text-xs p-1 border rounded"
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Test Coverage */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Test Coverage (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={status.testCoverage || 0}
              onChange={(e) => handleStatusChange({ testCoverage: parseInt(e.target.value) || 0 })}
              className="w-full text-xs p-1 border rounded"
            />
          </div>

          {/* Tests Passed */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tests Passed (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={status.testsPassed || 0}
              onChange={(e) => handleStatusChange({ testsPassed: parseInt(e.target.value) || 0 })}
              className="w-full text-xs p-1 border rounded"
            />
          </div>

          {/* Days Left */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Days Left</label>
            <input
              type="number"
              min="0"
              value={status.daysLeft || 0}
              onChange={(e) => handleStatusChange({ daysLeft: parseInt(e.target.value) || 0 })}
              className="w-full text-xs p-1 border rounded"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg border-2 ${ragStyle.bg} ${ragStyle.border} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className={`font-medium ${ragStyle.text}`}>{applicationName}</h4>
        <div className="flex items-center space-x-1">
          <span className="text-lg">{getHealthIcon(status.health)}</span>
          {showEditButton && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 ml-2"
              title="Edit status"
            >
              ✏️
            </button>
          )}
        </div>
      </div>
      
      <div className="text-sm space-y-2">
        <p className={`font-medium ${ragStyle.text}`}>{status.sprint}</p>
        <p className={`text-xs ${ragStyle.text}`}>⏱️ {status.daysLeft} days left</p>
        
        {/* Test Coverage Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Coverage</span>
            <span>{status.testCoverage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getProgressColor(status.testCoverage || 0)}`}
              style={{ width: `${status.testCoverage || 0}%` }}
            />
          </div>
        </div>

        {/* Test Pass Rate Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Pass Rate</span>
            <span>{status.testsPassed}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getProgressColor(status.testsPassed || 0)}`}
              style={{ width: `${status.testsPassed || 0}%` }}
            />
          </div>
        </div>

        {/* Timestamp */}
        {lastUpdated && (
          <p className="text-xs text-gray-500 mt-2">
            Updated: {lastUpdated.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}

// Grid component for multiple application tiles
interface ApplicationStatusGridProps {
  applications: Array<{
    name: string;
    status?: Partial<ApplicationStatusType>;
  }>;
  showEditButtons?: boolean;
  onStatusUpdate?: (appName: string, status: ApplicationStatusType) => void;
}

export function ApplicationStatusGrid({ 
  applications, 
  showEditButtons = false,
  onStatusUpdate 
}: ApplicationStatusGridProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          📱 Application Testing Status - Current Sprint
        </h3>
        {showEditButtons && (
          <div className="text-xs text-gray-500">
            Click edit buttons to update status
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {applications.map((app, index) => (
          <ApplicationStatusTile
            key={index}
            applicationName={app.name}
            initialStatus={app.status}
            showEditButton={showEditButtons}
            onStatusUpdate={(status) => onStatusUpdate?.(app.name, status)}
          />
        ))}
      </div>

      {/* RAG Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">RAG Status Legend:</h4>
        <div className="flex items-center space-x-6 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-100 border border-green-500 rounded"></div>
            <span>Green: Excellent/Good</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-amber-100 border border-amber-500 rounded"></div>
            <span>Amber: Warning</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-100 border border-red-500 rounded"></div>
            <span>Red: Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
}
