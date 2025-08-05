'use client';

import React, { useRef } from 'react';
import { MetricCard, ProgressBar } from '@/components/ui/SharedComponents';
import { QEDashboardData } from '@/types/dashboard';
import { PDFExportButton } from "@/components/ui/PDFExportButton";

interface NonProdEnvironmentsDashboardProps {
  data: QEDashboardData;
}

const NonProdEnvironmentsDashboard: React.FC<NonProdEnvironmentsDashboardProps> = ({ data }) => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { nonProdEnvironments } = data;

  const getEnvironmentStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 border-green-300';
      case 'unavailable': return 'bg-red-100 border-red-300';
      case 'maintenance': return 'bg-yellow-100 border-yellow-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getEnvironmentIcon = (status: string) => {
    switch (status) {
      case 'available': return '✅';
      case 'unavailable': return '❌';
      case 'maintenance': return '🔧';
      default: return '❓';
    }
  };

  return (
    <div ref={dashboardRef} className="relative space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Applications"
          value={nonProdEnvironments.summary.totalApps}
          icon={
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-2xl">📱</span>
            </div>
          }
        />
        
        <MetricCard
          title="Available Environments"
          value={`${nonProdEnvironments.summary.availableEnvironments}/12`}
          trend="stable"
          trendValue="Stable"
          icon={
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-2xl">🏗️</span>
            </div>
          }
        />
        
        <MetricCard
          title="Average Uptime"
          value={nonProdEnvironments.summary.averageUptime}
          unit="%"
          trend="up"
          trendValue="+2% this month"
          icon={
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-2xl">⏱️</span>
            </div>
          }
        />
      </div>

      {/* Environment Status Grid */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">🌐 Environment Status Overview</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Application</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">DEV</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">SIT</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">PRE-PROD</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Data Refresh</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {nonProdEnvironments.applications.map((app, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{app.name}</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className={`inline-flex items-center justify-center w-24 py-2 rounded-lg border ${getEnvironmentStatusColor(app.dev)}`}>
                      <span className="mr-1">{getEnvironmentIcon(app.dev)}</span>
                      <span className="text-sm font-medium capitalize">{app.dev}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className={`inline-flex items-center justify-center w-24 py-2 rounded-lg border ${getEnvironmentStatusColor(app.sit)}`}>
                      <span className="mr-1">{getEnvironmentIcon(app.sit)}</span>
                      <span className="text-sm font-medium capitalize">{app.sit}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className={`inline-flex items-center justify-center w-24 py-2 rounded-lg border ${getEnvironmentStatusColor(app.preprod)}`}>
                      <span className="mr-1">{getEnvironmentIcon(app.preprod)}</span>
                      <span className="text-sm font-medium capitalize">{app.preprod}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm text-gray-600">{app.dataRefreshCycle}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-16">
                        <ProgressBar
                          value={app.availability}
                          showPercentage={false}
                          color={app.availability >= 95 ? 'green' : app.availability >= 85 ? 'yellow' : 'red'}
                          size="sm"
                        />
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-900">{app.availability}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Environment Health Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Availability Trends */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Availability Trends</h3>
          <div className="space-y-4">
            {nonProdEnvironments.applications.map((app, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{app.name}</span>
                  <span className="text-sm text-gray-600">{app.availability}%</span>
                </div>
                <ProgressBar
                  value={app.availability}
                  showPercentage={false}
                  color={app.availability >= 95 ? 'green' : app.availability >= 85 ? 'yellow' : 'red'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Environment Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Actions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="font-medium text-blue-900">Schedule Data Refresh</p>
                <p className="text-sm text-blue-700">Refresh test data across all environments</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Schedule
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="font-medium text-green-900">Health Check</p>
                <p className="text-sm text-green-700">Run comprehensive environment health check</p>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                Run Check
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div>
                <p className="font-medium text-purple-900">Environment Sync</p>
                <p className="text-sm text-purple-700">Synchronize configurations across environments</p>
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
                Sync
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Environment Legend */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Environment Status Legend</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            <span className="text-sm text-gray-700">Available - Environment is operational and ready for testing</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">❌</span>
            <span className="text-sm text-gray-700">Unavailable - Environment is down or experiencing issues</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">🔧</span>
            <span className="text-sm text-gray-700">Maintenance - Scheduled maintenance or updates in progress</span>
          </div>
        </div>
      </div>

      {/* PDF Export Button */}
      <div className="absolute bottom-4 right-4">
        <PDFExportButton targetRef={dashboardRef} fileName="nonprod-environments-dashboard.pdf" />
      </div>
    </div>
  );
};

export default NonProdEnvironmentsDashboard;
