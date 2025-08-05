'use client';

import React, { useState, useEffect } from 'react';
import { QECapabilityFormData } from '@/types/forms';
import { dataManager } from '@/lib/dataManager';

interface QECapabilityFormProps {
  onSave?: (data: QECapabilityFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<QECapabilityFormData>;
}

export function QECapabilityForm({ 
  onSave, 
  onCancel, 
  initialData 
}: QECapabilityFormProps) {
  const [formData, setFormData] = useState<QECapabilityFormData>({
    id: initialData?.id || `qe-capability-${Date.now()}`,
    createdAt: initialData?.createdAt || new Date(),
    updatedAt: new Date(),
    createdBy: initialData?.createdBy || 'current-user',
    lastModifiedBy: 'current-user',
    
    // Maturity Assessment (1-5 scale)
    processMaturity: initialData?.processMaturity || 3,
    toolsAndAutomation: initialData?.toolsAndAutomation || 4,
    skillsAndCompetency: initialData?.skillsAndCompetency || 3,
    metricsAndReporting: initialData?.metricsAndReporting || 4,
    continuousImprovement: initialData?.continuousImprovement || 3,
    
    // Organization Metrics
    qeTeamSize: initialData?.qeTeamSize || 12,
    testAutomationEngineers: initialData?.testAutomationEngineers || 4,
    performanceTestEngineers: initialData?.performanceTestEngineers || 2,
    securityTestEngineers: initialData?.securityTestEngineers || 1,
    
    // Capability Scores (0-100)
    functionalTestingCapability: initialData?.functionalTestingCapability || 85,
    automationCapability: initialData?.automationCapability || 78,
    performanceTestingCapability: initialData?.performanceTestingCapability || 72,
    securityTestingCapability: initialData?.securityTestingCapability || 65,
    devOpsIntegrationCapability: initialData?.devOpsIntegrationCapability || 88
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (dataManager) {
      const existingData = dataManager.getFormData('qe-capability');
      if (existingData && !initialData) {
        setFormData(existingData as QECapabilityFormData);
      }
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate maturity scores (1-5)
    const maturityFields = [
      'processMaturity', 'toolsAndAutomation', 'skillsAndCompetency',
      'metricsAndReporting', 'continuousImprovement'
    ];
    
    maturityFields.forEach(field => {
      const value = formData[field as keyof QECapabilityFormData] as number;
      if (value < 1 || value > 5) {
        newErrors[field] = 'Maturity score must be between 1 and 5';
      }
    });

    // Validate capability scores (0-100)
    const capabilityFields = [
      'functionalTestingCapability', 'automationCapability', 'performanceTestingCapability',
      'securityTestingCapability', 'devOpsIntegrationCapability'
    ];
    
    capabilityFields.forEach(field => {
      const value = formData[field as keyof QECapabilityFormData] as number;
      if (value < 0 || value > 100) {
        newErrors[field] = 'Capability score must be between 0 and 100';
      }
    });

    // Validate team size constraints
    if (formData.qeTeamSize <= 0) {
      newErrors.qeTeamSize = 'QE team size must be greater than 0';
    }

    const totalSpecialists = formData.testAutomationEngineers + 
                           formData.performanceTestEngineers + 
                           formData.securityTestEngineers;
    
    if (totalSpecialists > formData.qeTeamSize) {
      newErrors.testAutomationEngineers = 'Total specialists cannot exceed total team size';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof QECapabilityFormData, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date(),
      lastModifiedBy: 'current-user'
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      if (dataManager) {
        dataManager.saveFormData('qe-capability', formData);
      }
      onSave?.(formData);
      alert('QE Capability data saved successfully!');
    } catch (error) {
      console.error('Failed to save QE capability data:', error);
      alert('Failed to save data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all fields to default values?')) {
      setFormData({
        ...formData,
        processMaturity: 3,
        toolsAndAutomation: 4,
        skillsAndCompetency: 3,
        metricsAndReporting: 4,
        continuousImprovement: 3,
        qeTeamSize: 12,
        testAutomationEngineers: 4,
        performanceTestEngineers: 2,
        securityTestEngineers: 1,
        functionalTestingCapability: 85,
        automationCapability: 78,
        performanceTestingCapability: 72,
        securityTestingCapability: 65,
        devOpsIntegrationCapability: 88,
        updatedAt: new Date()
      });
      setErrors({});
    }
  };

  const getMaturityLabel = (score: number): string => {
    const labels = ['', 'Initial', 'Managed', 'Defined', 'Quantitatively Managed', 'Optimizing'];
    return labels[score] || '';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">QE Capability Assessment Form</h2>
        <p className="text-gray-600 mt-2">
          Evaluate your organization&apos;s Quality Engineering maturity and capabilities across key dimensions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Maturity Assessment Section */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-purple-500 pl-4">
            Maturity Assessment (1-5 Scale)
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {[
              { field: 'processMaturity', label: 'Process Maturity', desc: 'Formalization and standardization of QE processes' },
              { field: 'toolsAndAutomation', label: 'Tools & Automation', desc: 'Adoption and effectiveness of QE tools and automation' },
              { field: 'skillsAndCompetency', label: 'Skills & Competency', desc: 'Team skills, training, and expertise levels' },
              { field: 'metricsAndReporting', label: 'Metrics & Reporting', desc: 'Quality metrics collection and reporting capabilities' },
              { field: 'continuousImprovement', label: 'Continuous Improvement', desc: 'Culture and practices for ongoing QE enhancement' }
            ].map(({ field, label, desc }) => (
              <div key={field} className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label}
                </label>
                <p className="text-xs text-gray-600 mb-3">{desc}</p>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={formData[field as keyof QECapabilityFormData] as number}
                    onChange={(e) => handleInputChange(field as keyof QECapabilityFormData, parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex items-center space-x-2 min-w-[120px]">
                    <span className="text-lg font-bold text-purple-600">
                      {formData[field as keyof QECapabilityFormData] as number}
                    </span>
                    <span className="text-sm text-gray-600">
                      ({getMaturityLabel(formData[field as keyof QECapabilityFormData] as number)})
                    </span>
                  </div>
                </div>
                {errors[field] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Organization Metrics Section */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-green-500 pl-4">
            Organization Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total QE Team Size
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={formData.qeTeamSize}
                onChange={(e) => handleInputChange('qeTeamSize', parseInt(e.target.value))}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.qeTeamSize ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.qeTeamSize && (
                <p className="text-red-500 text-sm mt-1">{errors.qeTeamSize}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Automation Engineers
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.testAutomationEngineers}
                onChange={(e) => handleInputChange('testAutomationEngineers', parseInt(e.target.value))}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.testAutomationEngineers ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.testAutomationEngineers && (
                <p className="text-red-500 text-sm mt-1">{errors.testAutomationEngineers}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Performance Test Engineers
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.performanceTestEngineers}
                onChange={(e) => handleInputChange('performanceTestEngineers', parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Security Test Engineers
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.securityTestEngineers}
                onChange={(e) => handleInputChange('securityTestEngineers', parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Team Composition Summary */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Team Composition Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Total Team:</span>
                <span className="font-medium text-blue-900 ml-1">{formData.qeTeamSize}</span>
              </div>
              <div>
                <span className="text-blue-700">Automation:</span>
                <span className="font-medium text-blue-900 ml-1">
                  {formData.testAutomationEngineers} ({Math.round((formData.testAutomationEngineers / formData.qeTeamSize) * 100)}%)
                </span>
              </div>
              <div>
                <span className="text-blue-700">Performance:</span>
                <span className="font-medium text-blue-900 ml-1">
                  {formData.performanceTestEngineers} ({Math.round((formData.performanceTestEngineers / formData.qeTeamSize) * 100)}%)
                </span>
              </div>
              <div>
                <span className="text-blue-700">Security:</span>
                <span className="font-medium text-blue-900 ml-1">
                  {formData.securityTestEngineers} ({Math.round((formData.securityTestEngineers / formData.qeTeamSize) * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Capability Scores Section */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-blue-500 pl-4">
            Capability Scores (0-100)
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {[
              { field: 'functionalTestingCapability', label: 'Functional Testing', color: 'bg-green-100 border-green-300' },
              { field: 'automationCapability', label: 'Test Automation', color: 'bg-blue-100 border-blue-300' },
              { field: 'performanceTestingCapability', label: 'Performance Testing', color: 'bg-yellow-100 border-yellow-300' },
              { field: 'securityTestingCapability', label: 'Security Testing', color: 'bg-red-100 border-red-300' },
              { field: 'devOpsIntegrationCapability', label: 'DevOps Integration', color: 'bg-purple-100 border-purple-300' }
            ].map(({ field, label, color }) => (
              <div key={field} className={`p-4 rounded-lg border ${color}`}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label} Capability
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={formData[field as keyof QECapabilityFormData] as number}
                    onChange={(e) => handleInputChange(field as keyof QECapabilityFormData, parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="min-w-[80px] text-right">
                    <span className="text-lg font-bold text-gray-900">
                      {formData[field as keyof QECapabilityFormData] as number}%
                    </span>
                  </div>
                </div>
                {errors[field] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Overall Capability Summary */}
        <section>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">QE Capability Overview</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Average Maturity Score</h5>
                <div className="text-2xl font-bold text-purple-600">
                  {((formData.processMaturity + formData.toolsAndAutomation + formData.skillsAndCompetency + 
                     formData.metricsAndReporting + formData.continuousImprovement) / 5).toFixed(1)}/5
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Average Capability Score</h5>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round((formData.functionalTestingCapability + formData.automationCapability + 
                              formData.performanceTestingCapability + formData.securityTestingCapability + 
                              formData.devOpsIntegrationCapability) / 5)}%
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset to Defaults
            </button>
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
              {isLoading ? 'Saving...' : 'Save QE Capability Data'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
