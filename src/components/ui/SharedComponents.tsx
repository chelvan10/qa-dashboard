'use client';

import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  className?: string;
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit = '',
  trend,
  trendValue,
  className = '',
  icon
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      case 'stable': return '→';
      default: return '';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline mt-2">
            <p className="text-2xl font-semibold text-gray-900">
              {value}{unit}
            </p>
            {trend && trendValue && (
              <div className={`ml-2 flex items-center text-sm ${getTrendColor()}`}>
                <span>{getTrendIcon()}</span>
                <span className="ml-1">{trendValue}</span>
              </div>
            )}
          </div>
        </div>
        {icon && (
          <div className="flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

interface StatusBadgeProps {
  status: 'available' | 'unavailable' | 'maintenance' | 'passed' | 'failed' | 'in-progress' | 'planned' | 'completed';
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  text, 
  size = 'md' 
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'available':
      case 'passed':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unavailable':
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance':
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'planned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return 'px-2 py-1 text-xs';
      case 'lg': return 'px-4 py-2 text-base';
      default: return 'px-3 py-1 text-sm';
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${getStatusStyles()} ${getSizeStyles()}`}>
      {text || status}
    </span>
  );
};

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'blue',
  size = 'md'
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getColorStyles = () => {
    switch (color) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return 'h-2';
      case 'lg': return 'h-6';
      default: return 'h-4';
    }
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${getSizeStyles()}`}>
        <div
          className={`${getColorStyles()} transition-all duration-300 ease-in-out ${getSizeStyles()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface TabNavigationProps {
  tabs: Array<{
    id: string;
    name: string;
    icon?: React.ReactNode;
    count?: number;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = ''
}) => {
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.name}
            {tab.count !== undefined && (
              <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

interface ViewModeToggleProps {
  currentMode: 'dashboard' | 'form';
  onModeChange: (mode: 'dashboard' | 'form') => void;
  className?: string;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  currentMode,
  onModeChange,
  className = ''
}) => {
  return (
    <div className={`inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1 ${className}`}>
      <button
        onClick={() => onModeChange('dashboard')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          currentMode === 'dashboard'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        📊 Dashboard
      </button>
      <button
        onClick={() => onModeChange('form')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          currentMode === 'form'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        📝 Data Form
      </button>
    </div>
  );
};
