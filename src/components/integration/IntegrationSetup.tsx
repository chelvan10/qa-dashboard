"use client";

import React, { useState } from 'react';

export interface IntegrationConfig {
  id: string;
  name: string;
  type: 'jira' | 'browserstack' | 'bitbucket' | 'custom-api';
  enabled: boolean;
  config: {
    url?: string;
    apiKey?: string;
    username?: string;
    token?: string;
    projectKey?: string;
    [key: string]: string | undefined;
  };
  lastSync?: Date;
  status: 'connected' | 'disconnected' | 'error' | 'configuring';
}

interface IntegrationSetupProps {
  integrations: IntegrationConfig[];
  onUpdateIntegration: (integration: IntegrationConfig) => void;
  onTestConnection: (integration: IntegrationConfig) => Promise<boolean>;
}

export function IntegrationSetup({ 
  integrations, 
  onUpdateIntegration, 
  onTestConnection 
}: IntegrationSetupProps) {
  const [editingIntegration, setEditingIntegration] = useState<string | null>(null);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  const getIntegrationIcon = (type: IntegrationConfig['type']) => {
    switch (type) {
      case 'jira': return '🎫';
      case 'browserstack': return '🌐';
      case 'bitbucket': return '📦';
      case 'custom-api': return '🔗';
      default: return '⚙️';
    }
  };

  const getStatusColor = (status: IntegrationConfig['status']) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'configuring': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTestConnection = async (integration: IntegrationConfig) => {
    setTestingConnection(integration.id);
    try {
      const success = await onTestConnection(integration);
      const updatedIntegration = {
        ...integration,
        status: success ? 'connected' as const : 'error' as const,
        lastSync: success ? new Date() : integration.lastSync
      };
      onUpdateIntegration(updatedIntegration);
    } catch (error) {
      console.error('Connection test failed:', error);
    } finally {
      setTestingConnection(null);
    }
  };

  const handleConfigUpdate = (integration: IntegrationConfig, field: string, value: string) => {
    const updatedIntegration = {
      ...integration,
      config: {
        ...integration.config,
        [field]: value
      },
      status: 'configuring' as const
    };
    onUpdateIntegration(updatedIntegration);
  };

  const renderConfigForm = (integration: IntegrationConfig) => {
    const fields = {
      jira: [
        { key: 'url', label: 'Jira URL', placeholder: 'https://your-company.atlassian.net', type: 'url' },
        { key: 'username', label: 'Email/Username', placeholder: 'user@company.com', type: 'email' },
        { key: 'apiKey', label: 'API Token', placeholder: 'Your Jira API token', type: 'password' },
        { key: 'projectKey', label: 'Project Key', placeholder: 'PROJ', type: 'text' }
      ],
      browserstack: [
        { key: 'username', label: 'Username', placeholder: 'BrowserStack username', type: 'text' },
        { key: 'apiKey', label: 'Access Key', placeholder: 'Your access key', type: 'password' }
      ],
      bitbucket: [
        { key: 'url', label: 'Bitbucket URL', placeholder: 'https://api.bitbucket.org/2.0', type: 'url' },
        { key: 'username', label: 'Username', placeholder: 'bitbucket-username', type: 'text' },
        { key: 'token', label: 'App Password', placeholder: 'App password or token', type: 'password' },
        { key: 'projectKey', label: 'Repository', placeholder: 'username/repository', type: 'text' }
      ],
      'custom-api': [
        { key: 'url', label: 'API Endpoint', placeholder: 'https://api.example.com', type: 'url' },
        { key: 'apiKey', label: 'API Key', placeholder: 'Your API key', type: 'password' },
        { key: 'token', label: 'Bearer Token', placeholder: 'Optional bearer token', type: 'password' }
      ]
    };

    const configFields = fields[integration.type] || [];

    return (
      <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h4 className="font-medium text-gray-900 mb-3">Configuration</h4>
        <div className="space-y-3">
          {configFields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                value={integration.config[field.key] || ''}
                onChange={(e) => handleConfigUpdate(integration, field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}
          
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => handleTestConnection(integration)}
              disabled={testingConnection === integration.id}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {testingConnection === integration.id ? 'Testing...' : 'Test Connection'}
            </button>
            
            <button
              onClick={() => setEditingIntegration(null)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 border-l-4 border-blue-500 pl-4">
          External System Integrations
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Configure connections to external systems for real-time data sync
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration) => (
          <div key={integration.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getIntegrationIcon(integration.type)}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{integration.name}</h4>
                  <p className="text-sm text-gray-500 capitalize">{integration.type.replace('-', ' ')}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(integration.status)}`}>
                  {integration.status}
                </span>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={integration.enabled}
                    onChange={(e) => onUpdateIntegration({
                      ...integration,
                      enabled: e.target.checked
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {integration.lastSync && (
              <div className="text-xs text-gray-500 mb-3">
                Last sync: {integration.lastSync.toLocaleString()}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {integration.status === 'connected' ? (
                  <span className="text-green-600">✓ Connected and syncing</span>
                ) : integration.status === 'error' ? (
                  <span className="text-red-600">✗ Connection error</span>
                ) : (
                  <span className="text-gray-500">Not configured</span>
                )}
              </div>
              
              <button
                onClick={() => setEditingIntegration(
                  editingIntegration === integration.id ? null : integration.id
                )}
                className="text-blue-600 text-sm hover:text-blue-800 focus:outline-none"
              >
                {editingIntegration === integration.id ? 'Hide Config' : 'Configure'}
              </button>
            </div>

            {editingIntegration === integration.id && renderConfigForm(integration)}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="text-blue-500 text-xl">💡</div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Integration Benefits</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Jira:</strong> Automatic defect tracking, sprint data, story progress</li>
              <li>• <strong>BrowserStack:</strong> Live test execution results, browser coverage</li>
              <li>• <strong>Bitbucket:</strong> Build status, commit metrics, deployment frequency</li>
              <li>• <strong>Custom APIs:</strong> Performance monitoring, security scans, custom metrics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
