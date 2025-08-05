"use client";

import React, { useState, useEffect } from "react";
import { PerformanceTestingFormData, ApiPerformanceData, PerformanceScenarioData, SLATargetData } from "@/types/forms";
import { dataManager } from "@/lib/dataManager";

interface PerformanceTestingFormProps {
  onSave?: (data: PerformanceTestingFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<PerformanceTestingFormData>;
}

export function PerformanceTestingForm({
  onSave,
  onCancel,
  initialData,
}: PerformanceTestingFormProps) {
  const [formData, setFormData] = useState<PerformanceTestingFormData>({
    id: initialData?.id || `performance-testing-${Date.now()}`,
    createdAt: initialData?.createdAt || new Date(),
    updatedAt: new Date(),
    createdBy: initialData?.createdBy || "current-user",
    lastModifiedBy: "current-user",
    apiEndpoints: initialData?.apiEndpoints || [],
    peakConcurrentUsers: initialData?.peakConcurrentUsers || 0,
    averageResponseTime: initialData?.averageResponseTime || 0,
    p95ResponseTime: initialData?.p95ResponseTime || 0,
    p99ResponseTime: initialData?.p99ResponseTime || 0,
    cpuUtilization: initialData?.cpuUtilization || 0,
    memoryUtilization: initialData?.memoryUtilization || 0,
    networkThroughput: initialData?.networkThroughput || 0,
    diskIOPS: initialData?.diskIOPS || 0,
    scenarios: initialData?.scenarios || [],
    slaTargets: initialData?.slaTargets || [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (dataManager) {
      const existingData = dataManager.getFormData("performanceTesting");
      if (existingData) {
        setFormData((prev) => ({ ...prev, ...existingData }));
      }
    }
  }, []);

  const handleInputChange = <K extends keyof PerformanceTestingFormData>(field: K, value: PerformanceTestingFormData[K]) => {
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

  // API Endpoints
  const handleApiEndpointChange = <K extends keyof ApiPerformanceData>(index: number, field: K, value: ApiPerformanceData[K]) => {
    const updatedEndpoints = [...formData.apiEndpoints];
    updatedEndpoints[index] = {
      ...updatedEndpoints[index],
      [field]: value,
    };
    handleInputChange("apiEndpoints", updatedEndpoints);
  };
  const addApiEndpoint = () => {
    const newEndpoint: ApiPerformanceData = {
      endpoint: "",
      method: "GET",
      averageResponseTime: 0,
      throughput: 0,
      errorRate: 0,
      slaTarget: 0,
      slaCompliance: 0,
    };
    handleInputChange("apiEndpoints", [...formData.apiEndpoints, newEndpoint]);
  };
  const removeApiEndpoint = (index: number) => {
    const updatedEndpoints = formData.apiEndpoints.filter((_, i) => i !== index);
    handleInputChange("apiEndpoints", updatedEndpoints);
  };

  // Scenarios
  const handleScenarioChange = <K extends keyof PerformanceScenarioData>(index: number, field: K, value: PerformanceScenarioData[K]) => {
    const updatedScenarios = [...formData.scenarios];
    updatedScenarios[index] = {
      ...updatedScenarios[index],
      [field]: value,
    };
    handleInputChange("scenarios", updatedScenarios);
  };
  const addScenario = () => {
    const newScenario: PerformanceScenarioData = {
      name: "",
      type: "load",
      status: "pass",
      users: 0,
      duration: 0,
      lastExecuted: new Date(),
      healthScore: 0,
    };
    handleInputChange("scenarios", [...formData.scenarios, newScenario]);
  };
  const removeScenario = (index: number) => {
    const updatedScenarios = formData.scenarios.filter((_, i) => i !== index);
    handleInputChange("scenarios", updatedScenarios);
  };

  // SLA Targets
  const handleSlaTargetChange = <K extends keyof SLATargetData>(index: number, field: K, value: SLATargetData[K]) => {
    const updatedSlaTargets = [...formData.slaTargets];
    updatedSlaTargets[index] = {
      ...updatedSlaTargets[index],
      [field]: value,
    };
    handleInputChange("slaTargets", updatedSlaTargets);
  };
  const addSlaTarget = () => {
    const newSla: SLATargetData = {
      metric: "",
      target: 0,
      actual: 0,
      compliance: 0,
      trend: "stable",
    };
    handleInputChange("slaTargets", [...formData.slaTargets, newSla]);
  };
  const removeSlaTarget = (index: number) => {
    const updatedSlaTargets = formData.slaTargets.filter((_, i) => i !== index);
    handleInputChange("slaTargets", updatedSlaTargets);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (dataManager) {
        dataManager.saveFormData("performanceTesting", formData);
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
      apiEndpoints: [],
      peakConcurrentUsers: 0,
      averageResponseTime: 0,
      p95ResponseTime: 0,
      p99ResponseTime: 0,
      cpuUtilization: 0,
      memoryUtilization: 0,
      networkThroughput: 0,
      diskIOPS: 0,
      scenarios: [],
      slaTargets: [],
    });
    setErrors({});
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Performance Testing</h2>
        <p className="text-gray-600">Enter API performance, system metrics, scenarios, and SLA targets.</p>
      </div>
      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{errors.submit}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* API Endpoints */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 border-l-4 border-blue-500 pl-4">API Endpoints</h3>
            <button type="button" onClick={addApiEndpoint} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Add Endpoint</button>
          </div>
          <div className="space-y-4">
            {formData.apiEndpoints.map((ep, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-800">Endpoint {index + 1}</h4>
                  <button type="button" onClick={() => removeApiEndpoint(index)} className="text-red-600 hover:text-red-800">Remove</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Endpoint</label>
                    <input type="text" value={ep.endpoint} onChange={(e) => handleApiEndpointChange(index, "endpoint", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Method</label>
                    <select value={ep.method} onChange={(e) => handleApiEndpointChange(index, "method", e.target.value as ApiPerformanceData["method"])} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                      <option value="PATCH">PATCH</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Avg Response Time (ms)</label>
                    <input type="number" min="0" value={ep.averageResponseTime} onChange={(e) => handleApiEndpointChange(index, "averageResponseTime", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Throughput (req/sec)</label>
                    <input type="number" min="0" value={ep.throughput} onChange={(e) => handleApiEndpointChange(index, "throughput", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Error Rate (%)</label>
                    <input type="number" min="0" max="100" step="0.1" value={ep.errorRate} onChange={(e) => handleApiEndpointChange(index, "errorRate", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SLA Target (ms)</label>
                    <input type="number" min="0" value={ep.slaTarget} onChange={(e) => handleApiEndpointChange(index, "slaTarget", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SLA Compliance (%)</label>
                    <input type="number" min="0" max="100" step="0.1" value={ep.slaCompliance} onChange={(e) => handleApiEndpointChange(index, "slaCompliance", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* System Performance */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-green-500 pl-4">System Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Peak Concurrent Users</label>
              <input type="number" min="0" value={formData.peakConcurrentUsers} onChange={(e) => handleInputChange("peakConcurrentUsers", parseInt(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Avg Response Time (ms)</label>
              <input type="number" min="0" value={formData.averageResponseTime} onChange={(e) => handleInputChange("averageResponseTime", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">P95 Response Time (ms)</label>
              <input type="number" min="0" value={formData.p95ResponseTime} onChange={(e) => handleInputChange("p95ResponseTime", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">P99 Response Time (ms)</label>
              <input type="number" min="0" value={formData.p99ResponseTime} onChange={(e) => handleInputChange("p99ResponseTime", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </section>
        {/* Resource Utilization */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-yellow-500 pl-4">Resource Utilization</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CPU Utilization (%)</label>
              <input type="number" min="0" max="100" step="0.1" value={formData.cpuUtilization} onChange={(e) => handleInputChange("cpuUtilization", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Memory Utilization (%)</label>
              <input type="number" min="0" max="100" step="0.1" value={formData.memoryUtilization} onChange={(e) => handleInputChange("memoryUtilization", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Network Throughput (Mbps)</label>
              <input type="number" min="0" value={formData.networkThroughput} onChange={(e) => handleInputChange("networkThroughput", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Disk IOPS</label>
              <input type="number" min="0" value={formData.diskIOPS} onChange={(e) => handleInputChange("diskIOPS", parseInt(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </section>
        {/* Performance Test Scenarios */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 border-l-4 border-purple-500 pl-4">Performance Test Scenarios</h3>
            <button type="button" onClick={addScenario} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500">Add Scenario</button>
          </div>
          <div className="space-y-4">
            {formData.scenarios.map((sc, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-800">Scenario {index + 1}</h4>
                  <button type="button" onClick={() => removeScenario(index)} className="text-red-600 hover:text-red-800">Remove</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input type="text" value={sc.name} onChange={(e) => handleScenarioChange(index, "name", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select value={sc.type} onChange={(e) => handleScenarioChange(index, "type", e.target.value as PerformanceScenarioData["type"])} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                      <option value="load">Load</option>
                      <option value="stress">Stress</option>
                      <option value="spike">Spike</option>
                      <option value="volume">Volume</option>
                      <option value="endurance">Endurance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select value={sc.status} onChange={(e) => handleScenarioChange(index, "status", e.target.value as PerformanceScenarioData["status"])} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                      <option value="pass">Pass</option>
                      <option value="fail">Fail</option>
                      <option value="warning">Warning</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Users</label>
                    <input type="number" min="0" value={sc.users} onChange={(e) => handleScenarioChange(index, "users", parseInt(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (min)</label>
                    <input type="number" min="0" value={sc.duration} onChange={(e) => handleScenarioChange(index, "duration", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Executed</label>
                    <input type="date" value={sc.lastExecuted ? new Date(sc.lastExecuted).toISOString().split('T')[0] : ""} onChange={(e) => handleScenarioChange(index, "lastExecuted", new Date(e.target.value))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Health Score (0-100)</label>
                    <input type="number" min="0" max="100" step="0.1" value={sc.healthScore} onChange={(e) => handleScenarioChange(index, "healthScore", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* SLA Metrics */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 border-l-4 border-indigo-500 pl-4">SLA Metrics</h3>
            <button type="button" onClick={addSlaTarget} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">Add SLA Target</button>
          </div>
          <div className="space-y-4">
            {formData.slaTargets.map((sla, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-800">SLA Target {index + 1}</h4>
                  <button type="button" onClick={() => removeSlaTarget(index)} className="text-red-600 hover:text-red-800">Remove</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Metric</label>
                    <input type="text" value={sla.metric} onChange={(e) => handleSlaTargetChange(index, "metric", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target</label>
                    <input type="number" min="0" value={sla.target} onChange={(e) => handleSlaTargetChange(index, "target", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Actual</label>
                    <input type="number" min="0" value={sla.actual} onChange={(e) => handleSlaTargetChange(index, "actual", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Compliance (%)</label>
                    <input type="number" min="0" max="100" step="0.1" value={sla.compliance} onChange={(e) => handleSlaTargetChange(index, "compliance", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trend</label>
                    <select value={sla.trend} onChange={(e) => handleSlaTargetChange(index, "trend", e.target.value as SLATargetData["trend"])} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="improving">Improving</option>
                      <option value="stable">Stable</option>
                      <option value="degrading">Degrading</option>
                    </select>
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
