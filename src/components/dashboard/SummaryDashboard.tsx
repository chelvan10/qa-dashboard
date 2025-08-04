'use client';

import React from 'react';
import { MetricCard, StatusBadge } from '@/components/ui/SharedComponents';
import { QEDashboardData } from '@/types/dashboard';

interface SummaryDashboardProps {
  data: QEDashboardData;
}

const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ data }) => {
  const { summary } = data;

  return (
    <div className="space-y-6">
      {/* Keynote Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg text-white p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-4">{summary.keynoteBanner.title}</h1>
          <p className="text-lg text-blue-100 leading-relaxed">
            {summary.keynoteBanner.mission}
          </p>
        </div>
      </div>

      {/* Critical Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Regression Automation"
          value={summary.criticalMetrics.regressionAutomation}
          unit="%"
          trend="up"
          trendValue="+5% this quarter"
          icon={
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-2xl">🤖</span>
            </div>
          }
        />
        
        <MetricCard
          title="Defect Leakage Rate"
          value={summary.criticalMetrics.defectLeakageRate}
          unit="%"
          trend="down"
          trendValue="-0.8% this month"
          icon={
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-2xl">🔍</span>
            </div>
          }
        />
        
        <MetricCard
          title="Environments Available"
          value={summary.criticalMetrics.environmentsAvailable}
          unit="%"
          trend="stable"
          trendValue="Stable"
          icon={
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-2xl">🏗️</span>
            </div>
          }
        />
        
        <MetricCard
          title="Open Vulnerabilities"
          value={summary.criticalMetrics.vulnerabilities}
          trend="down"
          trendValue="-3 this week"
          icon={
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600 text-2xl">🛡️</span>
            </div>
          }
        />
      </div>

      {/* Quality Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Achievements */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Recent Achievements</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-900">API Test Framework Complete</p>
                <p className="text-sm text-green-700">90% coverage achieved across all services</p>
              </div>
              <StatusBadge status="completed" text="Done" />
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-900">CI/CD Pipeline Optimization</p>
                <p className="text-sm text-blue-700">25% reduction in deployment time</p>
              </div>
              <StatusBadge status="completed" text="Done" />
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium text-purple-900">Security Scan Integration</p>
                <p className="text-sm text-purple-700">SAST/DAST embedded in pipelines</p>
              </div>
              <StatusBadge status="completed" text="Done" />
            </div>
          </div>
        </div>

        {/* Key Focus Areas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Key Focus Areas</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-900">Performance Testing Platform</span>
              </div>
              <StatusBadge status="in-progress" text="In Progress" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-900">Flaky Test Reduction</span>
              </div>
              <StatusBadge status="in-progress" text="In Progress" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-900">Environment Stability</span>
              </div>
              <StatusBadge status="planned" text="Q3 2024" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-900">AI Test Generation</span>
              </div>
              <StatusBadge status="planned" text="Q4 2024" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Quick Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">94%</p>
            <p className="text-sm text-gray-600">Pipeline Success Rate</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">1,200</p>
            <p className="text-sm text-gray-600">Hours Saved Monthly</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">15</p>
            <p className="text-sm text-gray-600">Deployments/Week</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">2.5</p>
            <p className="text-sm text-gray-600">Days Lead Time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryDashboard;
