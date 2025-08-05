"use client";

import React, { useState, useEffect } from "react";
import { SecurityTestingFormData, SecurityToolData, SecurityPostureData, ComplianceData } from "@/types/forms";
import { dataManager } from "@/lib/dataManager";

interface SecurityTestingFormProps {
  onSave?: (data: SecurityTestingFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<SecurityTestingFormData>;
}

export function SecurityTestingForm({
  onSave,
  onCancel,
  initialData,
}: SecurityTestingFormProps) {
  const [formData, setFormData] = useState<SecurityTestingFormData>({
    id: initialData?.id || `security-testing-${Date.now()}`,
    createdAt: initialData?.createdAt || new Date(),
    updatedAt: new Date(),
    createdBy: initialData?.createdBy || "current-user",
    lastModifiedBy: "current-user",
    criticalVulnerabilities: initialData?.criticalVulnerabilities || 0,
    highVulnerabilities: initialData?.highVulnerabilities || 0,
    mediumVulnerabilities: initialData?.mediumVulnerabilities || 0,
    lowVulnerabilities: initialData?.lowVulnerabilities || 0,
    vulnerabilitiesFound: initialData?.vulnerabilitiesFound || [],
    vulnerabilitiesResolved: initialData?.vulnerabilitiesResolved || [],
    weeks: initialData?.weeks || [],
    tools: initialData?.tools || [],
    securityPosture: initialData?.securityPosture || {
      overallScore: 0,
      dataProtection: 0,
      accessControl: 0,
      networkSecurity: 0,
      applicationSecurity: 0,
      incidentResponse: 0,
    },
    complianceMetrics: initialData?.complianceMetrics || [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (dataManager) {
      const existingData = dataManager.getFormData("securityTesting");
      if (existingData) {
        setFormData((prev) => ({ ...prev, ...existingData }));
      }
    }
  }, []);

  const handleInputChange = <K extends keyof SecurityTestingFormData>(field: K, value: SecurityTestingFormData[K]) => {
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

  // Security Tools
  const handleToolChange = <K extends keyof SecurityToolData>(index: number, field: K, value: SecurityToolData[K]) => {
    const updatedTools = [...formData.tools];
    updatedTools[index] = {
      ...updatedTools[index],
      [field]: value,
    };
    handleInputChange("tools", updatedTools);
  };
  const addTool = () => {
    const newTool: SecurityToolData = {
      name: "",
      type: "SAST",
      coverage: 0,
      accuracy: 0,
      falsePositiveRate: 0,
      scanFrequency: "weekly",
      lastScan: new Date(),
    };
    handleInputChange("tools", [...formData.tools, newTool]);
  };
  const removeTool = (index: number) => {
    const updatedTools = formData.tools.filter((_, i) => i !== index);
    handleInputChange("tools", updatedTools);
  };

  // Compliance Metrics
  const handleComplianceChange = <K extends keyof ComplianceData>(index: number, field: K, value: ComplianceData[K]) => {
    const updatedCompliance = [...formData.complianceMetrics];
    updatedCompliance[index] = {
      ...updatedCompliance[index],
      [field]: value,
    };
    handleInputChange("complianceMetrics", updatedCompliance);
  };
  const addCompliance = () => {
    const newCompliance: ComplianceData = {
      standard: "",
      status: "partial",
      score: 0,
      lastAudit: new Date(),
      nextAudit: new Date(),
    };
    handleInputChange("complianceMetrics", [...formData.complianceMetrics, newCompliance]);
  };
  const removeCompliance = (index: number) => {
    const updatedCompliance = formData.complianceMetrics.filter((_, i) => i !== index);
    handleInputChange("complianceMetrics", updatedCompliance);
  };

  // Security Posture
  const handlePostureChange = (field: keyof SecurityPostureData, value: number) => {
    handleInputChange("securityPosture", {
      ...formData.securityPosture,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (dataManager) {
        dataManager.saveFormData("securityTesting", formData);
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
      criticalVulnerabilities: 0,
      highVulnerabilities: 0,
      mediumVulnerabilities: 0,
      lowVulnerabilities: 0,
      vulnerabilitiesFound: [],
      vulnerabilitiesResolved: [],
      weeks: [],
      tools: [],
      securityPosture: {
        overallScore: 0,
        dataProtection: 0,
        accessControl: 0,
        networkSecurity: 0,
        applicationSecurity: 0,
        incidentResponse: 0,
      },
      complianceMetrics: [],
    });
    setErrors({});
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Security Testing</h2>
        <p className="text-gray-600">Enter vulnerability, tool, posture, and compliance metrics.</p>
      </div>
      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{errors.submit}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Vulnerability Distribution */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-red-500 pl-4">Vulnerability Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Critical Vulnerabilities</label>
              <input type="number" min="0" value={formData.criticalVulnerabilities} onChange={(e) => handleInputChange("criticalVulnerabilities", parseInt(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">High Vulnerabilities</label>
              <input type="number" min="0" value={formData.highVulnerabilities} onChange={(e) => handleInputChange("highVulnerabilities", parseInt(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medium Vulnerabilities</label>
              <input type="number" min="0" value={formData.mediumVulnerabilities} onChange={(e) => handleInputChange("mediumVulnerabilities", parseInt(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Low Vulnerabilities</label>
              <input type="number" min="0" value={formData.lowVulnerabilities} onChange={(e) => handleInputChange("lowVulnerabilities", parseInt(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
            </div>
          </div>
        </section>
        {/* Trends */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-yellow-500 pl-4">Trends</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vulnerabilities Found (weekly)</label>
              <input type="text" value={formData.vulnerabilitiesFound.join(", ")} onChange={(e) => handleInputChange("vulnerabilitiesFound", e.target.value.split(",").map(v => parseInt(v.trim()) || 0))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500" />
              <p className="text-xs text-gray-500 mt-1">Comma-separated weekly counts</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vulnerabilities Resolved (weekly)</label>
              <input type="text" value={formData.vulnerabilitiesResolved.join(", ")} onChange={(e) => handleInputChange("vulnerabilitiesResolved", e.target.value.split(",").map(v => parseInt(v.trim()) || 0))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500" />
              <p className="text-xs text-gray-500 mt-1">Comma-separated weekly counts</p>
            </div>
          </div>
        </section>
        {/* Security Tools Performance */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 border-l-4 border-blue-500 pl-4">Security Tools Performance</h3>
            <button type="button" onClick={addTool} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Add Tool</button>
          </div>
          <div className="space-y-4">
            {formData.tools.map((tool, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-800">Tool {index + 1}</h4>
                  <button type="button" onClick={() => removeTool(index)} className="text-red-600 hover:text-red-800">Remove</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input type="text" value={tool.name} onChange={(e) => handleToolChange(index, "name", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select value={tool.type} onChange={(e) => handleToolChange(index, "type", e.target.value as SecurityToolData["type"])} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="SAST">SAST</option>
                      <option value="DAST">DAST</option>
                      <option value="IAST">IAST</option>
                      <option value="SCA">SCA</option>
                      <option value="Container">Container</option>
                      <option value="Infrastructure">Infrastructure</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Coverage (%)</label>
                    <input type="number" min="0" max="100" step="0.1" value={tool.coverage} onChange={(e) => handleToolChange(index, "coverage", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Accuracy (%)</label>
                    <input type="number" min="0" max="100" step="0.1" value={tool.accuracy} onChange={(e) => handleToolChange(index, "accuracy", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">False Positive Rate (%)</label>
                    <input type="number" min="0" max="100" step="0.1" value={tool.falsePositiveRate} onChange={(e) => handleToolChange(index, "falsePositiveRate", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Scan Frequency</label>
                    <select value={tool.scanFrequency} onChange={(e) => handleToolChange(index, "scanFrequency", e.target.value as SecurityToolData["scanFrequency"])} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="per-release">Per Release</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Scan</label>
                    <input type="date" value={tool.lastScan ? new Date(tool.lastScan).toISOString().split('T')[0] : ""} onChange={(e) => handleToolChange(index, "lastScan", new Date(e.target.value))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Security Posture */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-green-500 pl-4">Security Posture</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Overall Score (0-100)</label>
              <input type="number" min="0" max="100" step="0.1" value={formData.securityPosture.overallScore} onChange={(e) => handlePostureChange("overallScore", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Protection (0-100)</label>
              <input type="number" min="0" max="100" step="0.1" value={formData.securityPosture.dataProtection} onChange={(e) => handlePostureChange("dataProtection", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Access Control (0-100)</label>
              <input type="number" min="0" max="100" step="0.1" value={formData.securityPosture.accessControl} onChange={(e) => handlePostureChange("accessControl", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Network Security (0-100)</label>
              <input type="number" min="0" max="100" step="0.1" value={formData.securityPosture.networkSecurity} onChange={(e) => handlePostureChange("networkSecurity", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Security (0-100)</label>
              <input type="number" min="0" max="100" step="0.1" value={formData.securityPosture.applicationSecurity} onChange={(e) => handlePostureChange("applicationSecurity", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Incident Response (0-100)</label>
              <input type="number" min="0" max="100" step="0.1" value={formData.securityPosture.incidentResponse} onChange={(e) => handlePostureChange("incidentResponse", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
            </div>
          </div>
        </section>
        {/* Compliance Metrics */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 border-l-4 border-indigo-500 pl-4">Compliance Metrics</h3>
            <button type="button" onClick={addCompliance} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">Add Compliance</button>
          </div>
          <div className="space-y-4">
            {formData.complianceMetrics.map((comp, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-800">Compliance {index + 1}</h4>
                  <button type="button" onClick={() => removeCompliance(index)} className="text-red-600 hover:text-red-800">Remove</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Standard</label>
                    <input type="text" value={comp.standard} onChange={(e) => handleComplianceChange(index, "standard", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select value={comp.status} onChange={(e) => handleComplianceChange(index, "status", e.target.value as ComplianceData["status"])} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="compliant">Compliant</option>
                      <option value="partial">Partial</option>
                      <option value="non-compliant">Non-Compliant</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Score (0-100)</label>
                    <input type="number" min="0" max="100" step="0.1" value={comp.score} onChange={(e) => handleComplianceChange(index, "score", parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Audit</label>
                    <input type="date" value={comp.lastAudit ? new Date(comp.lastAudit).toISOString().split('T')[0] : ""} onChange={(e) => handleComplianceChange(index, "lastAudit", new Date(e.target.value))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Next Audit</label>
                    <input type="date" value={comp.nextAudit ? new Date(comp.nextAudit).toISOString().split('T')[0] : ""} onChange={(e) => handleComplianceChange(index, "nextAudit", new Date(e.target.value))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
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
