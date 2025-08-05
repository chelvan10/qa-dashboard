'use client';

import React, { useState, useEffect } from 'react';
import { DataSourceConfig } from '@/types/forms';
import { dataManager } from '@/lib/dataManager';

interface DataSourceSetupProps {
  onClose?: () => void;
}

export function DataSourceSetup({ onClose }: DataSourceSetupProps) {
  const [dataSources, setDataSources] = useState<DataSourceConfig[]>([]);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDataSource, setNewDataSource] = useState<Partial<DataSourceConfig>>({
    name: '',
    type: 'jira',
    apiEndpoint: '',
    authMethod: 'token',
    refreshInterval: 15,
    fields: [],
    enabled: true
  });

  useEffect(() => {
    if (dataManager) {
      setDataSources(dataManager.getDataSources());
      setIsRealTimeEnabled(dataManager.isRealTimeEnabled());
    }
  }, []);

  const handleAddDataSource = () => {
    if (!dataManager) return;
    
    if (!newDataSource.name || !newDataSource.apiEndpoint) {
      alert('Please fill in required fields (name and API endpoint)');
      return;
    }

    const dataSource: DataSourceConfig = {
      name: newDataSource.name,
      type: newDataSource.type as DataSourceConfig['type'],
      apiEndpoint: newDataSource.apiEndpoint,
      authMethod: newDataSource.authMethod as DataSourceConfig['authMethod'],
      refreshInterval: newDataSource.refreshInterval || 15,
      fields: newDataSource.fields || [],
      enabled: newDataSource.enabled || true
    };

    dataManager.addDataSource(dataSource);
    setDataSources(dataManager.getDataSources());
    setShowAddForm(false);
    setNewDataSource({
      name: '',
      type: 'jira',
      apiEndpoint: '',
      authMethod: 'token',
      refreshInterval: 15,
      fields: [],
      enabled: true
    });
  };

  const handleRemoveDataSource = (name: string) => {
    if (!dataManager) return;
    
    if (confirm(`Are you sure you want to remove the "${name}" data source?`)) {
      dataManager.removeDataSource(name);
      setDataSources(dataManager.getDataSources());
    }
  };

  const handleToggleRealTime = () => {
    if (!dataManager) return;
    
    const newState = !isRealTimeEnabled;
    dataManager.setRealTimeMode(newState);
    setIsRealTimeEnabled(newState);
  };

  const getDataSourceIcon = (type: string) => {
    const icons: Record<string, string> = {
      jira: '🎯',
      browserstack: '🌐',
      bitbucket: '🔗',
      confluence: '📝',
      sonarqube: '🔍',
      jenkins: '⚙️',
      custom: '🔧'
    };
    return icons[type] || '❓';
  };

  const preConfiguredSources = [
    {
      name: 'Jira Production',
      type: 'jira' as const,
      apiEndpoint: 'https://your-company.atlassian.net/rest/api/3',
      authMethod: 'token' as const,
      refreshInterval: 15,
      fields: [
        { dashboardField: 'defectCount', sourceField: 'issues.total', transformation: 'round', fallbackToForm: true },
        { dashboardField: 'sprintProgress', sourceField: 'sprint.progress', transformation: 'percentage', fallbackToForm: true },
        { dashboardField: 'storyPoints', sourceField: 'sprint.storyPoints', transformation: 'round', fallbackToForm: true }
      ],
      enabled: true
    },
    {
      name: 'BrowserStack API',
      type: 'browserstack' as const,
      apiEndpoint: 'https://api.browserstack.com/automate',
      authMethod: 'basic' as const,
      refreshInterval: 30,
      fields: [
        { dashboardField: 'testExecutionCount', sourceField: 'builds.total_tests', transformation: 'round', fallbackToForm: true },
        { dashboardField: 'testPassRate', sourceField: 'builds.pass_rate', transformation: 'percentage', fallbackToForm: true },
        { dashboardField: 'browserCoverage', sourceField: 'browsers.count', transformation: 'round', fallbackToForm: true }
      ],
      enabled: true
    },
    {
      name: 'Bitbucket CI/CD',
      type: 'bitbucket' as const,
      apiEndpoint: 'https://api.bitbucket.org/2.0/repositories/your-workspace/your-repo',
      authMethod: 'token' as const,
      refreshInterval: 10,
      fields: [
        { dashboardField: 'buildSuccessRate', sourceField: 'pipelines.success_rate', transformation: 'percentage', fallbackToForm: true },
        { dashboardField: 'deploymentFrequency', sourceField: 'deployments.frequency', transformation: 'round', fallbackToForm: true },
        { dashboardField: 'commitCount', sourceField: 'commits.count', transformation: 'round', fallbackToForm: true }
      ],
      enabled: true
    }
  ];

  const handleAddPreConfigured = (source: DataSourceConfig) => {
    if (!dataManager) return;
    
    dataManager.addDataSource(source);
    setDataSources(dataManager.getDataSources());
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Real-Time Data Integration Setup</h2>
            <p className="text-gray-600 mt-2">
              Configure external data sources for real-time dashboard updates.
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Real-Time Mode Toggle */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Real-Time Mode</h3>
            <p className="text-blue-700 text-sm">
              {isRealTimeEnabled 
                ? 'Dashboards are receiving live data from configured sources'
                : 'Dashboards are using manual form data only'
              }
            </p>
          </div>
          <button
            onClick={handleToggleRealTime}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${isRealTimeEnabled ? 'bg-blue-600' : 'bg-gray-200'}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${isRealTimeEnabled ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
      </div>

      {/* Configured Data Sources */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Configured Data Sources</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {showAddForm ? 'Cancel' : 'Add Custom Source'}
          </button>
        </div>

        {dataSources.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-600">No data sources configured yet.</p>
            <p className="text-gray-500 text-sm">Add a data source to enable real-time integration.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataSources.map((source, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getDataSourceIcon(source.type)}</span>
                    <h4 className="font-medium text-gray-900">{source.name}</h4>
                  </div>
                  <button
                    onClick={() => handleRemoveDataSource(source.name)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="text-sm space-y-1">
                  <p><span className="text-gray-600">Type:</span> <span className="capitalize">{source.type}</span></p>
                  <p><span className="text-gray-600">Endpoint:</span> <span className="truncate">{source.apiEndpoint}</span></p>
                  <p><span className="text-gray-600">Refresh:</span> Every {source.refreshInterval} minutes</p>
                  <p><span className="text-gray-600">Fields:</span> {source.fields.length} mapped</p>
                  <div className={`inline-block px-2 py-1 rounded text-xs ${
                    source.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {source.enabled ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Custom Data Source Form */}
      {showAddForm && (
        <div className="border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Custom Data Source</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={newDataSource.name}
                onChange={(e) => setNewDataSource(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="e.g., My Custom API"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={newDataSource.type}
                onChange={(e) => setNewDataSource(prev => ({ ...prev, type: e.target.value as DataSourceConfig['type'] }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="jira">Jira</option>
                <option value="browserstack">BrowserStack</option>
                <option value="bitbucket">Bitbucket</option>
                <option value="confluence">Confluence</option>
                <option value="sonarqube">SonarQube</option>
                <option value="jenkins">Jenkins</option>
                <option value="custom">Custom API</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">API Endpoint</label>
              <input
                type="url"
                value={newDataSource.apiEndpoint}
                onChange={(e) => setNewDataSource(prev => ({ ...prev, apiEndpoint: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="https://api.example.com/endpoint"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Auth Method</label>
              <select
                value={newDataSource.authMethod}
                onChange={(e) => setNewDataSource(prev => ({ ...prev, authMethod: e.target.value as DataSourceConfig['authMethod'] }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="token">Bearer Token</option>
                <option value="apikey">API Key</option>
                <option value="basic">Basic Auth</option>
                <option value="oauth">OAuth</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Refresh Interval (minutes)</label>
              <input
                type="number"
                min="1"
                max="1440"
                value={newDataSource.refreshInterval}
                onChange={(e) => setNewDataSource(prev => ({ ...prev, refreshInterval: parseInt(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <button
              onClick={handleAddDataSource}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Add Data Source
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Pre-configured Templates */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Setup Templates</h3>
        <p className="text-gray-600 mb-4">
          Add common data sources with pre-configured field mappings. You&apos;ll need to update credentials after adding.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {preConfiguredSources.map((source, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xl">{getDataSourceIcon(source.type)}</span>
                <h4 className="font-medium text-gray-900">{source.name}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Pre-configured for {source.type} integration with {source.fields.length} mapped fields.
              </p>
              <button
                onClick={() => handleAddPreConfigured(source)}
                className="w-full px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
              >
                Add Template
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Information Panel */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">📋 Next Steps</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>1. Add your data sources using the form above or templates</li>
          <li>2. Configure authentication credentials for each source</li>
          <li>3. Map specific fields to dashboard metrics</li>
          <li>4. Enable real-time mode to start receiving live data</li>
          <li>5. Use the toggle in the bottom-right to switch between live and form data</li>
        </ul>
      </div>
    </div>
  );
}
