'use client';

import React, { useState, useEffect } from 'react';
import { NonProdEnvironmentsFormData, EnvironmentData } from '@/types/forms';
import { dataManager } from '@/lib/dataManager';

interface NonProdEnvironmentsFormProps {
  onSave?: (data: NonProdEnvironmentsFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<NonProdEnvironmentsFormData>;
}

export function NonProdEnvironmentsForm({ 
  onSave, 
  onCancel, 
  initialData 
}: NonProdEnvironmentsFormProps) {
  const [formData, setFormData] = useState<NonProdEnvironmentsFormData>({
    id: initialData?.id || `non-prod-env-${Date.now()}`,
    createdAt: initialData?.createdAt || new Date(),
    updatedAt: new Date(),
    createdBy: initialData?.createdBy || 'current-user',
    lastModifiedBy: 'current-user',
    
    environments: initialData?.environments || [
      {
        name: 'Development',
        type: 'dev',
        status: 'healthy',
        uptime: 98.5,
        responseTime: 250,
        deploymentFrequency: 15,
        lastDeployment: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        healthScore: 92,
        cpuUtilization: 45,
        memoryUtilization: 62,
        diskUtilization: 34,
        networkLatency: 12,
        testPassRate: 89,
        defectDensity: 2.1,
        smokeTestResults: 'pass'
      },
      {
        name: 'Test Environment 1',
        type: 'test',
        status: 'healthy',
        uptime: 99.2,
        responseTime: 180,
        deploymentFrequency: 8,
        lastDeployment: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        healthScore: 95,
        cpuUtilization: 38,
        memoryUtilization: 55,
        diskUtilization: 28,
        networkLatency: 8,
        testPassRate: 94,
        defectDensity: 1.3,
        smokeTestResults: 'pass'
      },
      {
        name: 'Staging',
        type: 'staging',
        status: 'warning',
        uptime: 96.8,
        responseTime: 320,
        deploymentFrequency: 4,
        lastDeployment: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        healthScore: 78,
        cpuUtilization: 72,
        memoryUtilization: 81,
        diskUtilization: 67,
        networkLatency: 25,
        testPassRate: 85,
        defectDensity: 3.2,
        smokeTestResults: 'fail'
      },
      {
        name: 'UAT',
        type: 'uat',
        status: 'healthy',
        uptime: 99.5,
        responseTime: 195,
        deploymentFrequency: 2,
        lastDeployment: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        healthScore: 91,
        cpuUtilization: 41,
        memoryUtilization: 58,
        diskUtilization: 32,
        networkLatency: 15,
        testPassRate: 92,
        defectDensity: 1.8,
        smokeTestResults: 'pass'
      },
      {
        name: 'Pre-Production',
        type: 'pre-prod',
        status: 'healthy',
        uptime: 99.8,
        responseTime: 165,
        deploymentFrequency: 1,
        lastDeployment: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        healthScore: 96,
        cpuUtilization: 35,
        memoryUtilization: 52,
        diskUtilization: 29,
        networkLatency: 6,
        testPassRate: 96,
        defectDensity: 0.8,
        smokeTestResults: 'pass'
      }
    ]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (dataManager) {
      const existingData = dataManager.getFormData('non-prod-environments');
      if (existingData && !initialData) {
        setFormData(existingData as NonProdEnvironmentsFormData);
      }
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    formData.environments.forEach((env, index) => {
      if (!env.name.trim()) {
        newErrors[`env-${index}-name`] = 'Environment name is required';
      }
      if (env.uptime < 0 || env.uptime > 100) {
        newErrors[`env-${index}-uptime`] = 'Uptime must be between 0 and 100%';
      }
      if (env.healthScore < 0 || env.healthScore > 100) {
        newErrors[`env-${index}-healthScore`] = 'Health score must be between 0 and 100';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEnvironmentChange = (index: number, field: keyof EnvironmentData, value: string | number | Date) => {
    setFormData(prev => ({
      ...prev,
      environments: prev.environments.map((env, i) => 
        i === index ? { ...env, [field]: value } : env
      ),
      updatedAt: new Date(),
      lastModifiedBy: 'current-user'
    }));
  };

  const addEnvironment = () => {
    const newEnv: EnvironmentData = {
      name: 'New Environment',
      type: 'test',
      status: 'healthy',
      uptime: 99.0,
      responseTime: 200,
      deploymentFrequency: 5,
      lastDeployment: new Date(),
      healthScore: 85,
      cpuUtilization: 50,
      memoryUtilization: 60,
      diskUtilization: 40,
      networkLatency: 15,
      testPassRate: 90,
      defectDensity: 2.0,
      smokeTestResults: 'pass'
    };

    setFormData(prev => ({
      ...prev,
      environments: [...prev.environments, newEnv],
      updatedAt: new Date()
    }));
  };

  const removeEnvironment = (index: number) => {
    if (formData.environments.length <= 1) {
      alert('At least one environment is required');
      return;
    }

    setFormData(prev => ({
      ...prev,
      environments: prev.environments.filter((_, i) => i !== index),
      updatedAt: new Date()
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      if (dataManager) {
        dataManager.saveFormData('non-prod-environments', formData);
      }
      onSave?.(formData);
      alert('Non-Prod Environments data saved successfully!');
    } catch (error) {
      console.error('Failed to save non-prod environments data:', error);
      alert('Failed to save data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'maintenance': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Non-Prod Environments</h2>
        <p className="text-gray-600 mt-2">
          Configure and monitor all non-production environments including development, testing, staging, UAT, and pre-production.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Environments Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 border-l-4 border-blue-500 pl-4">
              Environment Configuration
            </h3>
            <button
              type="button"
              onClick={addEnvironment}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Add Environment
            </button>
          </div>

          <div className="space-y-6">
            {formData.environments.map((env, index) => (
              <div key={index} className={`border-2 rounded-lg p-6 ${getStatusColor(env.status)}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Environment {index + 1}</h4>
                  {formData.environments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEnvironment(index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Basic Info */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Environment Name
                    </label>
                    <input
                      type="text"
                      value={env.name}
                      onChange={(e) => handleEnvironmentChange(index, 'name', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`env-${index}-name`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`env-${index}-name`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`env-${index}-name`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Environment Type
                    </label>
                    <select
                      value={env.type}
                      onChange={(e) => handleEnvironmentChange(index, 'type', e.target.value as EnvironmentData['type'])}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="dev">Development</option>
                      <option value="test">Test</option>
                      <option value="staging">Staging</option>
                      <option value="uat">UAT</option>
                      <option value="pre-prod">Pre-Production</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={env.status}
                      onChange={(e) => handleEnvironmentChange(index, 'status', e.target.value as EnvironmentData['status'])}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="healthy">Healthy</option>
                      <option value="warning">Warning</option>
                      <option value="critical">Critical</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>

                  {/* Performance Metrics */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Uptime (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={env.uptime}
                      onChange={(e) => handleEnvironmentChange(index, 'uptime', parseFloat(e.target.value))}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`env-${index}-uptime`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Response Time (ms)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={env.responseTime}
                      onChange={(e) => handleEnvironmentChange(index, 'responseTime', parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Health Score (0-100)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={env.healthScore}
                      onChange={(e) => handleEnvironmentChange(index, 'healthScore', parseInt(e.target.value))}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`env-${index}-healthScore`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  {/* Infrastructure Metrics */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CPU Utilization (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={env.cpuUtilization}
                      onChange={(e) => handleEnvironmentChange(index, 'cpuUtilization', parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Memory Utilization (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={env.memoryUtilization}
                      onChange={(e) => handleEnvironmentChange(index, 'memoryUtilization', parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Disk Utilization (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={env.diskUtilization}
                      onChange={(e) => handleEnvironmentChange(index, 'diskUtilization', parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Quality Metrics */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Pass Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={env.testPassRate}
                      onChange={(e) => handleEnvironmentChange(index, 'testPassRate', parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Defect Density
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={env.defectDensity}
                      onChange={(e) => handleEnvironmentChange(index, 'defectDensity', parseFloat(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Smoke Test Results
                    </label>
                    <select
                      value={env.smokeTestResults}
                      onChange={(e) => handleEnvironmentChange(index, 'smokeTestResults', e.target.value as EnvironmentData['smokeTestResults'])}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pass">Pass</option>
                      <option value="fail">Fail</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Environment Summary */}
        <section>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Environment Health Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formData.environments.filter(env => env.status === 'healthy').length}
                </div>
                <div className="text-sm text-gray-600">Healthy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {formData.environments.filter(env => env.status === 'warning').length}
                </div>
                <div className="text-sm text-gray-600">Warning</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {formData.environments.filter(env => env.status === 'critical').length}
                </div>
                <div className="text-sm text-gray-600">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(formData.environments.reduce((sum, env) => sum + env.healthScore, 0) / formData.environments.length)}
                </div>
                <div className="text-sm text-gray-600">Avg Health Score</div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Last updated: {formData.updatedAt.toLocaleString()}
          </div>
          
          <div className="flex space-x-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Saving...' : 'Save Environment Data'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
