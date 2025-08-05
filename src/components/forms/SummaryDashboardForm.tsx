'use client';

import React, { useState, useEffect } from 'react';
import { SummaryFormData } from '@/types/forms';
import { dataManager } from '@/lib/dataManager';

interface SummaryDashboardFormProps {
  onSave?: (data: SummaryFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<SummaryFormData>;
}

export function SummaryDashboardForm({ 
  onSave, 
  onCancel, 
  initialData 
}: SummaryDashboardFormProps) {
  const [formData, setFormData] = useState<SummaryFormData>({
    id: initialData?.id || `summary-${Date.now()}`,
    createdAt: initialData?.createdAt || new Date(),
    updatedAt: new Date(),
    createdBy: initialData?.createdBy || 'current-user',
    lastModifiedBy: 'current-user',
    
    // Executive KPIs
    overallQualityScore: initialData?.overallQualityScore || 85,
    defectEscapeRate: initialData?.defectEscapeRate || 2.5,
    testCoverage: initialData?.testCoverage || 78,
    releaseVelocity: initialData?.releaseVelocity || 12,
    customerSatisfactionScore: initialData?.customerSatisfactionScore || 87,
    
    // Strategic Metrics
    qualityGateComplianceRate: initialData?.qualityGateComplianceRate || 92,
    automationROI: initialData?.automationROI || 340,
    meanTimeToDetection: initialData?.meanTimeToDetection || 4.2,
    meanTimeToResolution: initialData?.meanTimeToResolution || 18.5,
    regressionTestEfficiency: initialData?.regressionTestEfficiency || 89,
    
    // Business Impact
    productionIncidents: initialData?.productionIncidents || 3,
    qualityDebtScore: initialData?.qualityDebtScore || 23,
    teamProductivityIndex: initialData?.teamProductivityIndex || 91
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load existing form data if available
    if (dataManager) {
      const existingData = dataManager.getFormData('summary');
      if (existingData && !initialData) {
        setFormData(existingData as SummaryFormData);
      }
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate percentage fields (0-100)
    const percentageFields = [
      'overallQualityScore', 'testCoverage', 'customerSatisfactionScore',
      'qualityGateComplianceRate', 'regressionTestEfficiency', 'teamProductivityIndex'
    ];
    
    percentageFields.forEach(field => {
      const value = formData[field as keyof SummaryFormData] as number;
      if (value < 0 || value > 100) {
        newErrors[field] = 'Value must be between 0 and 100';
      }
    });

    // Validate defect escape rate (0-100)
    if (formData.defectEscapeRate < 0 || formData.defectEscapeRate > 100) {
      newErrors.defectEscapeRate = 'Defect escape rate must be between 0 and 100%';
    }

    // Validate release velocity (positive number)
    if (formData.releaseVelocity <= 0) {
      newErrors.releaseVelocity = 'Release velocity must be greater than 0';
    }

    // Validate time fields (positive numbers)
    if (formData.meanTimeToDetection <= 0) {
      newErrors.meanTimeToDetection = 'Mean time to detection must be greater than 0';
    }
    if (formData.meanTimeToResolution <= 0) {
      newErrors.meanTimeToResolution = 'Mean time to resolution must be greater than 0';
    }

    // Validate automation ROI (can be negative, but should be reasonable)
    if (formData.automationROI < -100 || formData.automationROI > 1000) {
      newErrors.automationROI = 'Automation ROI should be between -100% and 1000%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof SummaryFormData, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date(),
      lastModifiedBy: 'current-user'
    }));
    
    // Clear error for this field when user starts typing
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
      // Save to data manager
      if (dataManager) {
        dataManager.saveFormData('summary', formData);
      }
      
      // Call parent callback
      onSave?.(formData);
      
      alert('Summary dashboard data saved successfully!');
    } catch (error) {
      console.error('Failed to save summary data:', error);
      alert('Failed to save data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all fields to default values?')) {
      setFormData({
        ...formData,
        overallQualityScore: 85,
        defectEscapeRate: 2.5,
        testCoverage: 78,
        releaseVelocity: 12,
        customerSatisfactionScore: 87,
        qualityGateComplianceRate: 92,
        automationROI: 340,
        meanTimeToDetection: 4.2,
        meanTimeToResolution: 18.5,
        regressionTestEfficiency: 89,
        productionIncidents: 3,
        qualityDebtScore: 23,
        teamProductivityIndex: 91,
        updatedAt: new Date()
      });
      setErrors({});
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Summary Dashboard Data Form</h2>
        <p className="text-gray-600 mt-2">
          Configure key performance indicators and strategic metrics for the executive summary dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Executive KPIs Section */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-blue-500 pl-4">
            Executive KPIs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Quality Score (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.overallQualityScore}
                onChange={(e) => handleInputChange('overallQualityScore', parseFloat(e.target.value))}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.overallQualityScore ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.overallQualityScore && (
                <p className="text-red-500 text-sm mt-1">{errors.overallQualityScore}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Defect Escape Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.defectEscapeRate}
                onChange={(e) => handleInputChange('defectEscapeRate', parseFloat(e.target.value))}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.defectEscapeRate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.defectEscapeRate && (
                <p className="text-red-500 text-sm mt-1">{errors.defectEscapeRate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Coverage (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.testCoverage}
                onChange={(e) => handleInputChange('testCoverage', parseFloat(e.target.value))}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.testCoverage ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.testCoverage && (
                <p className="text-red-500 text-sm mt-1">{errors.testCoverage}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Release Velocity (releases/month)
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={formData.releaseVelocity}
                onChange={(e) => handleInputChange('releaseVelocity', parseInt(e.target.value))}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.releaseVelocity ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.releaseVelocity && (
                <p className="text-red-500 text-sm mt-1">{errors.releaseVelocity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Satisfaction Score (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.customerSatisfactionScore}
                onChange={(e) => handleInputChange('customerSatisfactionScore', parseFloat(e.target.value))}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.customerSatisfactionScore ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.customerSatisfactionScore && (
                <p className="text-red-500 text-sm mt-1">{errors.customerSatisfactionScore}</p>
              )}
            </div>
          </div>
        </section>

        {/* Strategic Metrics Section */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-green-500 pl-4">
            Strategic Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality Gate Compliance Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.qualityGateComplianceRate}
                onChange={(e) => handleInputChange('qualityGateComplianceRate', parseFloat(e.target.value))}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.qualityGateComplianceRate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.qualityGateComplianceRate && (
                <p className="text-red-500 text-sm mt-1">{errors.qualityGateComplianceRate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Automation ROI (%)
              </label>
              <input
                type="number"
                min="-100"
                max="1000"
                step="0.1"
                value={formData.automationROI}
                onChange={(e) => handleInputChange('automationROI', parseFloat(e.target.value))}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.automationROI ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.automationROI && (
                <p className="text-red-500 text-sm mt-1">{errors.automationROI}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mean Time to Detection (hours)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={formData.meanTimeToDetection}
                onChange={(e) => handleInputChange('meanTimeToDetection', parseFloat(e.target.value))}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.meanTimeToDetection ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.meanTimeToDetection && (
                <p className="text-red-500 text-sm mt-1">{errors.meanTimeToDetection}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mean Time to Resolution (hours)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={formData.meanTimeToResolution}
                onChange={(e) => handleInputChange('meanTimeToResolution', parseFloat(e.target.value))}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.meanTimeToResolution ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.meanTimeToResolution && (
                <p className="text-red-500 text-sm mt-1">{errors.meanTimeToResolution}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Regression Test Efficiency (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.regressionTestEfficiency}
                onChange={(e) => handleInputChange('regressionTestEfficiency', parseFloat(e.target.value))}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.regressionTestEfficiency ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.regressionTestEfficiency && (
                <p className="text-red-500 text-sm mt-1">{errors.regressionTestEfficiency}</p>
              )}
            </div>
          </div>
        </section>

        {/* Business Impact Section */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-red-500 pl-4">
            Business Impact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Production Incidents (count)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.productionIncidents}
                onChange={(e) => handleInputChange('productionIncidents', parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality Debt Score (0-100, lower is better)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.qualityDebtScore}
                onChange={(e) => handleInputChange('qualityDebtScore', parseFloat(e.target.value))}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.qualityDebtScore ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.qualityDebtScore && (
                <p className="text-red-500 text-sm mt-1">{errors.qualityDebtScore}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Productivity Index (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.teamProductivityIndex}
                onChange={(e) => handleInputChange('teamProductivityIndex', parseFloat(e.target.value))}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.teamProductivityIndex ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.teamProductivityIndex && (
                <p className="text-red-500 text-sm mt-1">{errors.teamProductivityIndex}</p>
              )}
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
              {isLoading ? 'Saving...' : 'Save Dashboard Data'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
