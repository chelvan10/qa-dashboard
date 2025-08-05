'use client';

import React, { useState, useEffect } from 'react';
import { FunctionalTestingFormData } from '@/types/forms';
import { SquadPerformanceData } from '@/types/forms';
import { ApplicationTestData } from '@/types/forms';
import { dataManager } from '@/lib/dataManager';

interface FunctionalTestingFormProps {
  onSave?: (data: FunctionalTestingFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<FunctionalTestingFormData>;
}

export function FunctionalTestingForm({ 
  onSave, 
  onCancel, 
  initialData 
}: FunctionalTestingFormProps) {
  const [formData, setFormData] = useState<FunctionalTestingFormData>({
    id: initialData?.id || `functional-testing-${Date.now()}`,
    createdAt: initialData?.createdAt || new Date(),
    updatedAt: new Date(),
    createdBy: initialData?.createdBy || 'current-user',
    lastModifiedBy: 'current-user',
    
    // Application Test Tiles
    applications: initialData?.applications || [
      {
        id: '1',
        name: 'Customer Portal',
        testsPassed: 145,
        testsFailed: 8,
        testsTotal: 153,
        passRate: 94.8,
        avgExecutionTime: 12.5,
        lastRun: new Date().toISOString(),
        priority: 'high',
        status: 'stable'
      },
      {
        id: '2',
        name: 'Admin Dashboard',
        testsPassed: 89,
        testsFailed: 3,
        testsTotal: 92,
        passRate: 96.7,
        avgExecutionTime: 8.2,
        lastRun: new Date().toISOString(),
        priority: 'high',
        status: 'stable'
      },
      {
        id: '3',
        name: 'Payment Gateway',
        testsPassed: 67,
        testsFailed: 12,
        testsTotal: 79,
        passRate: 84.8,
        avgExecutionTime: 15.3,
        lastRun: new Date().toISOString(),
        priority: 'critical',
        status: 'unstable'
      }
    ],
    
    // Squad Performance Metrics
    squads: initialData?.squads || [
      {
        id: '1',
        name: 'Frontend Squad',
        passRate: 92.5,
        velocity: 85,
        blockers: 2,
        testsExecuted: 450,
        defectsFound: 15
      },
      {
        id: '2',
        name: 'Backend Squad',
        passRate: 94.8,
        velocity: 78,
        blockers: 1,
        testsExecuted: 320,
        defectsFound: 8
      },
      {
        id: '3',
        name: 'Mobile Squad',
        passRate: 89.2,
        velocity: 71,
        blockers: 4,
        testsExecuted: 280,
        defectsFound: 22
      }
    ],
    
    // Defect Trend Analysis
    defectTrends: initialData?.defectTrends || {
      totalDefects: 45,
      criticalDefects: 3,
      highDefects: 12,
      mediumDefects: 20,
      lowDefects: 10,
      resolvedDefects: 38,
      openDefects: 7,
      avgResolutionTime: 2.5,
      defectsByCategory: {
        ui: 15,
        functionality: 12,
        performance: 8,
        security: 5,
        integration: 5
      }
    },
    
    // Test Coverage Breakdown
    testCoverage: initialData?.testCoverage || {
      unitTests: 85.2,
      integrationTests: 78.5,
      e2eTests: 65.8,
      apiTests: 92.3,
      uiTests: 71.4,
      regressionTests: 88.7,
      smokeTests: 95.1,
      overallCoverage: 82.4,
      codebaseCoverage: {
        frontend: 79.8,
        backend: 88.9,
        mobile: 72.3,
        shared: 85.5
      }
    },
    
    // Test Execution Metrics
    executionMetrics: initialData?.executionMetrics || {
      totalTestsExecuted: 1250,
      passedTests: 1165,
      failedTests: 85,
      skippedTests: 0,
      avgExecutionTime: 45.2,
      parallelExecutionEfficiency: 78.5,
      testEnvironmentUptime: 97.8,
      flakinessFactor: 3.2
    },
    
    // Quality Metrics
    qualityMetrics: initialData?.qualityMetrics || {
      testCaseEffectiveness: 87.5,
      bugDetectionRate: 92.3,
      falsePositiveRate: 2.1,
      testMaintenanceEffort: 15.5,
      testDataQuality: 89.7,
      environmentStability: 94.2
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load existing form data if available
    if (dataManager) {
      const existingData = dataManager.getFormData('functionalTesting');
      if (existingData) {
        setFormData(existingData as FunctionalTestingFormData);
      }
    }
  }, []);

  const handleInputChange = <K extends keyof FunctionalTestingFormData>(field: K, value: FunctionalTestingFormData[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date(),
      lastModifiedBy: 'current-user'
    }));
    
    // Clear any existing errors for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleApplicationChange = <K extends keyof ApplicationTestData>(index: number, field: K, value: ApplicationTestData[K]) => {
    const updatedApplications = [...formData.applications];
    updatedApplications[index] = {
      ...updatedApplications[index],
      [field]: value
    };
    
    // Recalculate pass rate if tests changed
    if (field === 'testsPassed' || field === 'testsFailed' || field === 'testsTotal') {
      const app = updatedApplications[index];
      app.passRate = app.testsTotal > 0 ? (app.testsPassed / app.testsTotal) * 100 : 0;
    }
    
    handleInputChange('applications', updatedApplications);
  };

  const handleSquadChange = <K extends keyof SquadPerformanceData>(index: number, field: K, value: SquadPerformanceData[K]) => {
    const updatedSquads = [...formData.squads];
    updatedSquads[index] = {
      ...updatedSquads[index],
      [field]: value
    };
    handleInputChange('squads', updatedSquads);
  };

  const addApplication = () => {
    const newApp = {
      id: `app-${Date.now()}`,
      name: '',
      testsPassed: 0,
      testsFailed: 0,
      testsTotal: 0,
      passRate: 0,
      avgExecutionTime: 0,
      lastRun: new Date().toISOString(),
      priority: 'medium' as const,
      status: 'stable' as const
    };
    handleInputChange('applications', [...formData.applications, newApp]);
  };

  const removeApplication = (index: number) => {
    const updatedApplications = formData.applications.filter((_, i) => i !== index);
    handleInputChange('applications', updatedApplications);
  };

  const addSquad = () => {
    const newSquad = {
      id: `squad-${Date.now()}`,
      name: '',
      passRate: 0,
      velocity: 0,
      blockers: 0,
      testsExecuted: 0,
      defectsFound: 0
    };
    handleInputChange('squads', [...formData.squads, newSquad]);
  };

  const removeSquad = (index: number) => {
    const updatedSquads = formData.squads.filter((_, i) => i !== index);
    handleInputChange('squads', updatedSquads);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate applications
    formData.applications.forEach((app, index) => {
      if (!app.name.trim()) {
        newErrors[`application_${index}_name`] = 'Application name is required';
      }
      if (app.testsTotal < 0) {
        newErrors[`application_${index}_total`] = 'Total tests must be non-negative';
      }
      if (app.testsPassed < 0) {
        newErrors[`application_${index}_passed`] = 'Passed tests must be non-negative';
      }
      if (app.testsFailed < 0) {
        newErrors[`application_${index}_failed`] = 'Failed tests must be non-negative';
      }
    });

    // Validate squads
    formData.squads.forEach((squad, index) => {
      if (!squad.name.trim()) {
        newErrors[`squad_${index}_name`] = 'Squad name is required';
      }
      if (squad.passRate < 0 || squad.passRate > 100) {
        newErrors[`squad_${index}_passRate`] = 'Pass rate must be between 0 and 100';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        dataManager.saveFormData('functionalTesting', formData);
      }
      
      // Call onSave callback if provided
      if (onSave) {
        onSave(formData);
      }
      
      // Show success message (you can implement a toast notification here)
      console.log('Functional Testing form data saved successfully');
      
    } catch (error) {
      console.error('Error saving functional testing form data:', error);
      setErrors({ submit: 'Failed to save form data. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      ...formData,
      // Reset to default values
      applications: [],
      squads: [],
      defectTrends: {
        totalDefects: 0,
        criticalDefects: 0,
        highDefects: 0,
        mediumDefects: 0,
        lowDefects: 0,
        resolvedDefects: 0,
        openDefects: 0,
        avgResolutionTime: 0,
        defectsByCategory: {
          ui: 0,
          functionality: 0,
          performance: 0,
          security: 0,
          integration: 0
        }
      },
      testCoverage: {
        unitTests: 0,
        integrationTests: 0,
        e2eTests: 0,
        apiTests: 0,
        uiTests: 0,
        regressionTests: 0,
        smokeTests: 0,
        overallCoverage: 0,
        codebaseCoverage: {
          frontend: 0,
          backend: 0,
          mobile: 0,
          shared: 0
        }
      },
      executionMetrics: {
        totalTestsExecuted: 0,
        passedTests: 0,
        failedTests: 0,
        skippedTests: 0,
        avgExecutionTime: 0,
        parallelExecutionEfficiency: 0,
        testEnvironmentUptime: 0,
        flakinessFactor: 0
      },
      qualityMetrics: {
        testCaseEffectiveness: 0,
        bugDetectionRate: 0,
        falsePositiveRate: 0,
        testMaintenanceEffort: 0,
        testDataQuality: 0,
        environmentStability: 0
      }
    });
    setErrors({});
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Functional Testing</h2>
        <p className="text-gray-600">
          Configure functional testing metrics including application test coverage, squad performance, defect trends, and quality metrics.
        </p>
      </div>

      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{errors.submit}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Application Test Tiles Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 border-l-4 border-blue-500 pl-4">
              Application Test Tiles
            </h3>
            <button
              type="button"
              onClick={addApplication}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Application
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.applications.map((app, index) => (
              <div key={app.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-800">Application {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeApplication(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application Name
                    </label>
                    <input
                      type="text"
                      value={app.name}
                      onChange={(e) => handleApplicationChange(index, 'name', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`application_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter application name"
                    />
                    {errors[`application_${index}_name`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`application_${index}_name`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={app.priority}
                      onChange={(e) => handleApplicationChange(index, 'priority', e.target.value as ApplicationTestData['priority'])}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={app.status}
                      onChange={(e) => handleApplicationChange(index, 'status', e.target.value as ApplicationTestData['status'])}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="stable">Stable</option>
                      <option value="unstable">Unstable</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="deprecated">Deprecated</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tests Passed
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={app.testsPassed}
                      onChange={(e) => handleApplicationChange(index, 'testsPassed', parseInt(e.target.value) || 0)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`application_${index}_passed`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tests Failed
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={app.testsFailed}
                      onChange={(e) => handleApplicationChange(index, 'testsFailed', parseInt(e.target.value) || 0)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`application_${index}_failed`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Tests
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={app.testsTotal}
                      onChange={(e) => handleApplicationChange(index, 'testsTotal', parseInt(e.target.value) || 0)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`application_${index}_total`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Avg Execution Time (minutes)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={app.avgExecutionTime}
                      onChange={(e) => handleApplicationChange(index, 'avgExecutionTime', parseFloat(e.target.value) || 0)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Pass Rate: <span className="font-semibold">{app.passRate.toFixed(1)}%</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Squad Performance Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 border-l-4 border-green-500 pl-4">
              Squad Performance
            </h3>
            <button
              type="button"
              onClick={addSquad}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add Squad
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.squads.map((squad, index) => (
              <div key={squad.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-800">Squad {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeSquad(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Squad Name
                    </label>
                    <input
                      type="text"
                      value={squad.name}
                      onChange={(e) => handleSquadChange(index, 'name', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`squad_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter squad name"
                    />
                    {errors[`squad_${index}_name`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`squad_${index}_name`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pass Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={squad.passRate}
                      onChange={(e) => handleSquadChange(index, 'passRate', parseFloat(e.target.value) || 0)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`squad_${index}_passRate`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Velocity
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={squad.velocity}
                      onChange={(e) => handleSquadChange(index, 'velocity', parseInt(e.target.value) || 0)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blockers
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={squad.blockers}
                      onChange={(e) => handleSquadChange(index, 'blockers', parseInt(e.target.value) || 0)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tests Executed
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={squad.testsExecuted}
                      onChange={(e) => handleSquadChange(index, 'testsExecuted', parseInt(e.target.value) || 0)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Defects Found
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={squad.defectsFound}
                      onChange={(e) => handleSquadChange(index, 'defectsFound', parseInt(e.target.value) || 0)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Defect Trend Analysis Section */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-red-500 pl-4">
            Defect Trend Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Defects
              </label>
              <input
                type="number"
                min="0"
                value={formData.defectTrends.totalDefects}
                onChange={(e) => handleInputChange('defectTrends', {
                  ...formData.defectTrends,
                  totalDefects: parseInt(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Critical Defects
              </label>
              <input
                type="number"
                min="0"
                value={formData.defectTrends.criticalDefects}
                onChange={(e) => handleInputChange('defectTrends', {
                  ...formData.defectTrends,
                  criticalDefects: parseInt(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                High Priority Defects
              </label>
              <input
                type="number"
                min="0"
                value={formData.defectTrends.highDefects}
                onChange={(e) => handleInputChange('defectTrends', {
                  ...formData.defectTrends,
                  highDefects: parseInt(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medium Priority Defects
              </label>
              <input
                type="number"
                min="0"
                value={formData.defectTrends.mediumDefects}
                onChange={(e) => handleInputChange('defectTrends', {
                  ...formData.defectTrends,
                  mediumDefects: parseInt(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Low Priority Defects
              </label>
              <input
                type="number"
                min="0"
                value={formData.defectTrends.lowDefects}
                onChange={(e) => handleInputChange('defectTrends', {
                  ...formData.defectTrends,
                  lowDefects: parseInt(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resolved Defects
              </label>
              <input
                type="number"
                min="0"
                value={formData.defectTrends.resolvedDefects}
                onChange={(e) => handleInputChange('defectTrends', {
                  ...formData.defectTrends,
                  resolvedDefects: parseInt(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Open Defects
              </label>
              <input
                type="number"
                min="0"
                value={formData.defectTrends.openDefects}
                onChange={(e) => handleInputChange('defectTrends', {
                  ...formData.defectTrends,
                  openDefects: parseInt(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avg Resolution Time (days)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.defectTrends.avgResolutionTime}
                onChange={(e) => handleInputChange('defectTrends', {
                  ...formData.defectTrends,
                  avgResolutionTime: parseFloat(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Defects by Category</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UI Defects
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.defectTrends.defectsByCategory.ui}
                  onChange={(e) => handleInputChange('defectTrends', {
                    ...formData.defectTrends,
                    defectsByCategory: {
                      ...formData.defectTrends.defectsByCategory,
                      ui: parseInt(e.target.value) || 0
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Functionality Defects
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.defectTrends.defectsByCategory.functionality}
                  onChange={(e) => handleInputChange('defectTrends', {
                    ...formData.defectTrends,
                    defectsByCategory: {
                      ...formData.defectTrends.defectsByCategory,
                      functionality: parseInt(e.target.value) || 0
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Performance Defects
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.defectTrends.defectsByCategory.performance}
                  onChange={(e) => handleInputChange('defectTrends', {
                    ...formData.defectTrends,
                    defectsByCategory: {
                      ...formData.defectTrends.defectsByCategory,
                      performance: parseInt(e.target.value) || 0
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Security Defects
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.defectTrends.defectsByCategory.security}
                  onChange={(e) => handleInputChange('defectTrends', {
                    ...formData.defectTrends,
                    defectsByCategory: {
                      ...formData.defectTrends.defectsByCategory,
                      security: parseInt(e.target.value) || 0
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Integration Defects
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.defectTrends.defectsByCategory.integration}
                  onChange={(e) => handleInputChange('defectTrends', {
                    ...formData.defectTrends,
                    defectsByCategory: {
                      ...formData.defectTrends.defectsByCategory,
                      integration: parseInt(e.target.value) || 0
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Test Coverage Breakdown Section */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-yellow-500 pl-4">
            Test Coverage Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Tests (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.testCoverage.unitTests}
                onChange={(e) => handleInputChange('testCoverage', {
                  ...formData.testCoverage,
                  unitTests: parseFloat(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Integration Tests (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.testCoverage.integrationTests}
                onChange={(e) => handleInputChange('testCoverage', {
                  ...formData.testCoverage,
                  integrationTests: parseFloat(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End-to-End Tests (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.testCoverage.e2eTests}
                onChange={(e) => handleInputChange('testCoverage', {
                  ...formData.testCoverage,
                  e2eTests: parseFloat(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Tests (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.testCoverage.apiTests}
                onChange={(e) => handleInputChange('testCoverage', {
                  ...formData.testCoverage,
                  apiTests: parseFloat(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UI Tests (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.testCoverage.uiTests}
                onChange={(e) => handleInputChange('testCoverage', {
                  ...formData.testCoverage,
                  uiTests: parseFloat(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Regression Tests (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.testCoverage.regressionTests}
                onChange={(e) => handleInputChange('testCoverage', {
                  ...formData.testCoverage,
                  regressionTests: parseFloat(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Smoke Tests (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.testCoverage.smokeTests}
                onChange={(e) => handleInputChange('testCoverage', {
                  ...formData.testCoverage,
                  smokeTests: parseFloat(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Coverage (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.testCoverage.overallCoverage}
                onChange={(e) => handleInputChange('testCoverage', {
                  ...formData.testCoverage,
                  overallCoverage: parseFloat(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Codebase Coverage</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frontend (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.testCoverage.codebaseCoverage.frontend}
                  onChange={(e) => handleInputChange('testCoverage', {
                    ...formData.testCoverage,
                    codebaseCoverage: {
                      ...formData.testCoverage.codebaseCoverage,
                      frontend: parseFloat(e.target.value) || 0
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Backend (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.testCoverage.codebaseCoverage.backend}
                  onChange={(e) => handleInputChange('testCoverage', {
                    ...formData.testCoverage,
                    codebaseCoverage: {
                      ...formData.testCoverage.codebaseCoverage,
                      backend: parseFloat(e.target.value) || 0
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.testCoverage.codebaseCoverage.mobile}
                  onChange={(e) => handleInputChange('testCoverage', {
                    ...formData.testCoverage,
                    codebaseCoverage: {
                      ...formData.testCoverage.codebaseCoverage,
                      mobile: parseFloat(e.target.value) || 0
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shared Components (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.testCoverage.codebaseCoverage.shared}
                  onChange={(e) => handleInputChange('testCoverage', {
                    ...formData.testCoverage,
                    codebaseCoverage: {
                      ...formData.testCoverage.codebaseCoverage,
                      shared: parseFloat(e.target.value) || 0
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Test Execution Metrics Section */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-purple-500 pl-4">
            Test Execution Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Tests Executed
              </label>
              <input
                type="number"
                min="0"
                value={formData.executionMetrics.totalTestsExecuted}
                onChange={(e) => handleInputChange('executionMetrics', {
                  ...formData.executionMetrics,
                  totalTestsExecuted: parseInt(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passed Tests
              </label>
              <input
                type="number"
                min="0"
                value={formData.executionMetrics.passedTests}
                onChange={(e) => handleInputChange('executionMetrics', {
                  ...formData.executionMetrics,
                  passedTests: parseInt(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Failed Tests
              </label>
              <input
                type="number"
                min="0"
                value={formData.executionMetrics.failedTests}
                onChange={(e) => handleInputChange('executionMetrics', {
                  ...formData.executionMetrics,
                  failedTests: parseInt(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skipped Tests
              </label>
              <input
                type="number"
                min="0"
                value={formData.executionMetrics.skippedTests}
                onChange={(e) => handleInputChange('executionMetrics', {
                  ...formData.executionMetrics,
                  skippedTests: parseInt(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avg Execution Time (minutes)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.executionMetrics.avgExecutionTime}
                onChange={(e) => handleInputChange('executionMetrics', {
                  ...formData.executionMetrics,
                  avgExecutionTime: parseFloat(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parallel Execution Efficiency (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.executionMetrics.parallelExecutionEfficiency}
                onChange={(e) => handleInputChange('executionMetrics', {
                  ...formData.executionMetrics,
                  parallelExecutionEfficiency: parseFloat(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Environment Uptime (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.executionMetrics.testEnvironmentUptime}
                onChange={(e) => handleInputChange('executionMetrics', {
                  ...formData.executionMetrics,
                  testEnvironmentUptime: parseFloat(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flakiness Factor (%)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.executionMetrics.flakinessFactor}
                onChange={(e) => handleInputChange('executionMetrics', {
                  ...formData.executionMetrics,
                  flakinessFactor: parseFloat(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Quality Metrics Section */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-indigo-500 pl-4">
            Quality Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Case Effectiveness (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.qualityMetrics.testCaseEffectiveness}
                onChange={(e) => handleInputChange('qualityMetrics', {
                  ...formData.qualityMetrics,
                  testCaseEffectiveness: parseFloat(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bug Detection Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.qualityMetrics.bugDetectionRate}
                onChange={(e) => handleInputChange('qualityMetrics', {
                  ...formData.qualityMetrics,
                  bugDetectionRate: parseFloat(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                False Positive Rate (%)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.qualityMetrics.falsePositiveRate}
                onChange={(e) => handleInputChange('qualityMetrics', {
                  ...formData.qualityMetrics,
                  falsePositiveRate: parseFloat(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Maintenance Effort (hours/week)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.qualityMetrics.testMaintenanceEffort}
                onChange={(e) => handleInputChange('qualityMetrics', {
                  ...formData.qualityMetrics,
                  testMaintenanceEffort: parseFloat(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Data Quality (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.qualityMetrics.testDataQuality}
                onChange={(e) => handleInputChange('qualityMetrics', {
                  ...formData.qualityMetrics,
                  testDataQuality: parseFloat(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Environment Stability (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.qualityMetrics.environmentStability}
                onChange={(e) => handleInputChange('qualityMetrics', {
                  ...formData.qualityMetrics,
                  environmentStability: parseFloat(e.target.value) || 0
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
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
