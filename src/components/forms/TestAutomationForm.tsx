"use client";

import React, { useState, useEffect } from "react";
import { TestAutomationFormData, AutomationFrameworkData } from "@/types/forms";
import { dataManager } from "@/lib/dataManager";

interface TestAutomationFormProps {
  onSave?: (data: TestAutomationFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<TestAutomationFormData>;
}

export function TestAutomationForm({
  onSave,
  onCancel,
  initialData,
}: TestAutomationFormProps) {
  const [formData, setFormData] = useState<TestAutomationFormData>({
    id: initialData?.id || `test-automation-${Date.now()}`,
    createdAt: initialData?.createdAt || new Date(),
    updatedAt: new Date(),
    createdBy: initialData?.createdBy || "current-user",
    lastModifiedBy: "current-user",
    uiAutomationCoverage: initialData?.uiAutomationCoverage || 0,
    apiAutomationCoverage: initialData?.apiAutomationCoverage || 0,
    unitTestCoverage: initialData?.unitTestCoverage || 0,
    integrationTestCoverage: initialData?.integrationTestCoverage || 0,
    e2eTestCoverage: initialData?.e2eTestCoverage || 0,
    totalAutomatedTests: initialData?.totalAutomatedTests || 0,
    flakyTests: initialData?.flakyTests || 0,
    flakyTestRate: initialData?.flakyTestRate || 0,
    averageExecutionTime: initialData?.averageExecutionTime || 0,
    parallelExecutionCapability: initialData?.parallelExecutionCapability || false,
    manualTestingTimeSaved: initialData?.manualTestingTimeSaved || 0,
    costSavingsPerMonth: initialData?.costSavingsPerMonth || 0,
    automationMaintenance: initialData?.automationMaintenance || 0,
    netROI: initialData?.netROI || 0,
    frameworks: initialData?.frameworks || [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (dataManager) {
      const existingData = dataManager.getFormData("testAutomation");
      if (existingData) {
        setFormData((prev) => ({ ...prev, ...existingData }));
      }
    }
  }, []);

  const handleInputChange = <K extends keyof TestAutomationFormData>(field: K, value: TestAutomationFormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date(),
      lastModifiedBy: "current-user",
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFrameworkChange = <K extends keyof AutomationFrameworkData>(index: number, field: K, value: AutomationFrameworkData[K]) => {
    const updatedFrameworks = [...formData.frameworks];
    updatedFrameworks[index] = {
      ...updatedFrameworks[index],
      [field]: value,
    };
    handleInputChange("frameworks", updatedFrameworks);
  };

  const addFramework = () => {
    const newFramework: AutomationFrameworkData = {
      name: "",
      technology: "",
      testCount: 0,
      successRate: 0,
      avgExecutionTime: 0,
      maintenanceEffort: 0,
    };
    handleInputChange("frameworks", [...formData.frameworks, newFramework]);
  };

  const removeFramework = (index: number) => {
    const updatedFrameworks = formData.frameworks.filter((_, i) => i !== index);
    handleInputChange("frameworks", updatedFrameworks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (dataManager) {
        dataManager.saveFormData("testAutomation", formData);
      }
      if (onSave) {
        onSave(formData);
      }
    } catch {
      setErrors({ submit: "Failed to save form data. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      ...formData,
      uiAutomationCoverage: 0,
      apiAutomationCoverage: 0,
      unitTestCoverage: 0,
      integrationTestCoverage: 0,
      e2eTestCoverage: 0,
      totalAutomatedTests: 0,
      flakyTests: 0,
      flakyTestRate: 0,
      averageExecutionTime: 0,
      parallelExecutionCapability: false,
      manualTestingTimeSaved: 0,
      costSavingsPerMonth: 0,
      automationMaintenance: 0,
      netROI: 0,
      frameworks: [],
    });
    setErrors({});
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Automation</h2>
        <p className="text-gray-600">
          Enter automation coverage, framework performance, ROI, and flaky test metrics.
        </p>
      </div>
      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{errors.submit}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Coverage Metrics */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-blue-500 pl-4">Coverage Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">UI Automation Coverage (%)</label>
              <input type="number" min="0" max="100" step="0.1" value={formData.uiAutomationCoverage} onChange={(e) => handleInputChange("uiAutomationCoverage", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Automation Coverage (%)</label>
              <input type="number" min="0" max="100" step="0.1" value={formData.apiAutomationCoverage} onChange={(e) => handleInputChange("apiAutomationCoverage", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit Test Coverage (%)</label>
              <input type="number" min="0" max="100" step="0.1" value={formData.unitTestCoverage} onChange={(e) => handleInputChange("unitTestCoverage", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Integration Test Coverage (%)</label>
              <input type="number" min="0" max="100" step="0.1" value={formData.integrationTestCoverage} onChange={(e) => handleInputChange("integrationTestCoverage", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E2E Test Coverage (%)</label>
              <input type="number" min="0" max="100" step="0.1" value={formData.e2eTestCoverage} onChange={(e) => handleInputChange("e2eTestCoverage", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </section>
        {/* Framework Performance */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-green-500 pl-4">Framework Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Automated Tests</label>
              <input type="number" min="0" value={formData.totalAutomatedTests} onChange={(e) => handleInputChange("totalAutomatedTests", parseInt(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Flaky Tests</label>
              <input type="number" min="0" value={formData.flakyTests} onChange={(e) => handleInputChange("flakyTests", parseInt(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Flaky Test Rate (%)</label>
              <input type="number" min="0" max="100" step="0.1" value={formData.flakyTestRate} onChange={(e) => handleInputChange("flakyTestRate", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Average Execution Time (min)</label>
              <input type="number" min="0" step="0.1" value={formData.averageExecutionTime} onChange={(e) => handleInputChange("averageExecutionTime", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parallel Execution Capability</label>
              <input type="checkbox" checked={formData.parallelExecutionCapability} onChange={(e) => handleInputChange("parallelExecutionCapability", e.target.checked)} className="mr-2" />
              <span className="text-gray-700">Enabled</span>
            </div>
          </div>
        </section>
        {/* ROI Metrics */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-yellow-500 pl-4">ROI Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Manual Testing Time Saved (hrs/week)</label>
              <input type="number" min="0" value={formData.manualTestingTimeSaved} onChange={(e) => handleInputChange("manualTestingTimeSaved", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost Savings Per Month</label>
              <input type="number" min="0" value={formData.costSavingsPerMonth} onChange={(e) => handleInputChange("costSavingsPerMonth", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Automation Maintenance (hrs/week)</label>
              <input type="number" min="0" value={formData.automationMaintenance} onChange={(e) => handleInputChange("automationMaintenance", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Net ROI (%)</label>
              <input type="number" min="0" max="100" step="0.1" value={formData.netROI} onChange={(e) => handleInputChange("netROI", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </section>
        {/* Framework Details */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 border-l-4 border-purple-500 pl-4">Framework Details</h3>
            <button type="button" onClick={addFramework} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500">Add Framework</button>
          </div>
          <div className="space-y-4">
            {formData.frameworks.map((fw, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-800">Framework {index + 1}</h4>
                  <button type="button" onClick={() => removeFramework(index)} className="text-red-600 hover:text-red-800">Remove</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input type="text" value={fw.name} onChange={(e) => handleFrameworkChange(index, "name", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Technology</label>
                    <input type="text" value={fw.technology} onChange={(e) => handleFrameworkChange(index, "technology", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Test Count</label>
                    <input type="number" min="0" value={fw.testCount} onChange={(e) => handleFrameworkChange(index, "testCount", parseInt(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Success Rate (%)</label>
                    <input type="number" min="0" max="100" step="0.1" value={fw.successRate} onChange={(e) => handleFrameworkChange(index, "successRate", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Avg Execution Time (min)</label>
                    <input type="number" min="0" step="0.1" value={fw.avgExecutionTime} onChange={(e) => handleFrameworkChange(index, "avgExecutionTime", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Effort (hrs/week)</label>
                    <input type="number" min="0" step="0.1" value={fw.maintenanceEffort} onChange={(e) => handleFrameworkChange(index, "maintenanceEffort", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <button type="button" onClick={handleReset} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Reset to Defaults</button>
          </div>
          <div className="flex space-x-3">
            {onCancel && (
              <button type="button" onClick={onCancel} className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Cancel</button>
            )}
            <button type="submit" disabled={isLoading} className={`px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>{isLoading ? "Saving..." : "Save Dashboard Data"}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
