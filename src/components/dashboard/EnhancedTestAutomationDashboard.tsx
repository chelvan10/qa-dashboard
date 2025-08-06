'use client';

import React, { useRef, useState } from 'react';
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';
import { MetricCard } from '@/components/ui/SharedComponents';
import { QEDashboardData } from '@/types/dashboard';
import { PDFExportButton } from "@/components/ui/PDFExportButton";
import { FloatingBackButton } from "@/components/ui/BackButton";
import { ApplicationStatusGrid } from "@/components/ui/ApplicationStatus";
import { database, ApplicationStatusType } from '@/lib/database';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

interface EnhancedTestAutomationDashboardProps {
  data: QEDashboardData;
}

const EnhancedTestAutomationDashboard: React.FC<EnhancedTestAutomationDashboardProps> = ({ data }) => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { testAutomation } = data;
  const [showEditMode, setShowEditMode] = useState(false);

  // Top 10 KPIs for Test Automation
  const automationKPIs = [
    { title: 'Automation Coverage', value: 78, unit: '%', trend: 'up', trendValue: '+8%', icon: '🤖' },
    { title: 'Automation ROI', value: 312, unit: '%', trend: 'up', trendValue: '+45%', icon: '💰' },
    { title: 'Script Maintenance', value: 12, unit: '%', trend: 'down', trendValue: '-3%', icon: '🔧' },
    { title: 'Execution Velocity', value: 89, unit: 'T/H', trend: 'up', trendValue: '+15%', icon: '⚡' },
    { title: 'Flaky Test Rate', value: 4.2, unit: '%', trend: 'down', trendValue: '-1.8%', icon: '⚠️' },
    { title: 'Framework Stability', value: 94, unit: '%', trend: 'up', trendValue: '+2%', icon: '🏗️' },
    { title: 'CI/CD Integration', value: 96, unit: '%', trend: 'stable', trendValue: 'Stable', icon: '🔄' },
    { title: 'Test Data Coverage', value: 85, unit: '%', trend: 'up', trendValue: '+7%', icon: '📊' },
    { title: 'Cross-Platform Tests', value: 67, unit: '%', trend: 'up', trendValue: '+12%', icon: '📱' },
    { title: 'Parallel Execution', value: 83, unit: '%', trend: 'up', trendValue: '+9%', icon: '⚡' }
  ];

  // Applications with automation focus - using Partial type for flexibility
  const automationApplications = [
    { name: 'SAP S/4 Hana', status: { health: 'excellent' as const, ragColor: 'green' as const, testCoverage: 95, testsPassed: 87, automation: 85 } },
    { name: 'SAP CC B2B', status: { health: 'good' as const, ragColor: 'green' as const, testCoverage: 92, testsPassed: 84, automation: 78 } },
    { name: 'SAP CC B2C', status: { health: 'warning' as const, ragColor: 'amber' as const, testCoverage: 78, testsPassed: 72, automation: 65 } },
    { name: 'Mule 4.4', status: { health: 'good' as const, ragColor: 'green' as const, testCoverage: 88, testsPassed: 81, automation: 72 } },
    { name: 'GKPOS', status: { health: 'excellent' as const, ragColor: 'green' as const, testCoverage: 96, testsPassed: 92, automation: 89 } },
    { name: 'Pacsoft', status: { health: 'good' as const, ragColor: 'green' as const, testCoverage: 85, testsPassed: 79, automation: 71 } },
    { name: '1Centre', status: { health: 'warning' as const, ragColor: 'amber' as const, testCoverage: 73, testsPassed: 68, automation: 58 } },
    { name: 'AS400', status: { health: 'good' as const, ragColor: 'green' as const, testCoverage: 82, testsPassed: 76, automation: 45 } },
    { name: 'Tradehub Hybris', status: { health: 'excellent' as const, ragColor: 'green' as const, testCoverage: 94, testsPassed: 89, automation: 82 } }
  ];

  // Coverage Growth Chart - use overall coverage with simulated breakdown
  const coverageGrowthData = {
    labels: testAutomation.coverageGrowth.map(item => item.month),
    datasets: [
      {
        label: 'UI Automation',
        data: testAutomation.coverageGrowth.map(item => Math.max(0, item.coverage - 15)), // Simulate UI being slightly lower
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'API Automation',
        data: testAutomation.coverageGrowth.map(item => Math.min(100, item.coverage + 5)), // Simulate API being higher
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Overall Coverage',
        data: testAutomation.coverageGrowth.map(item => item.coverage),
        borderColor: 'rgba(168, 85, 247, 1)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const coverageGrowthOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Automation Coverage Growth Trends'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: number | string) {
            return value + '%';
          }
        }
      }
    }
  };

  // ROI Chart
  const roiData = {
    labels: ['Cost Savings', 'Time Savings', 'Quality Improvements', 'Resource Optimization'],
    datasets: [
      {
        data: [45, 35, 15, 5],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(249, 115, 22, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(249, 115, 22, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const roiOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Automation ROI Distribution'
      }
    }
  };

  // Framework Performance Radar
  const frameworkData = {
    labels: ['Maintainability', 'Scalability', 'Reliability', 'Performance', 'Usability', 'Documentation'],
    datasets: [
      {
        label: 'Selenium',
        data: [85, 78, 82, 76, 88, 90],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 2
      },
      {
        label: 'Cypress',
        data: [92, 85, 88, 94, 95, 87],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderWidth: 2
      },
      {
        label: 'REST Assured',
        data: [88, 92, 85, 89, 82, 85],
        borderColor: 'rgba(168, 85, 247, 1)',
        backgroundColor: 'rgba(168, 85, 247, 0.2)',
        borderWidth: 2
      }
    ]
  };

  const frameworkOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Automation Framework Performance'
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    }
  };

  // Flaky Tests Chart
  const flakyTestsData = {
    labels: testAutomation.flakyTests.map(test => test.testName.length > 15 ? test.testName.substring(0, 15) + '...' : test.testName),
    datasets: [
      {
        label: 'Failure Rate (%)',
        data: testAutomation.flakyTests.map(test => test.failureRate),
        backgroundColor: testAutomation.flakyTests.map(test => 
          test.failureRate > 20 ? 'rgba(239, 68, 68, 0.8)' :
          test.failureRate > 10 ? 'rgba(249, 115, 22, 0.8)' :
          'rgba(34, 197, 94, 0.8)'
        ),
        borderColor: testAutomation.flakyTests.map(test => 
          test.failureRate > 20 ? 'rgba(239, 68, 68, 1)' :
          test.failureRate > 10 ? 'rgba(249, 115, 22, 1)' :
          'rgba(34, 197, 94, 1)'
        ),
        borderWidth: 1
      }
    ]
  };

  const flakyTestsOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Flaky Tests Analysis - Failure Rates'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: number | string) {
            return value + '%';
          }
        }
      },
      x: {
        ticks: {
          maxRotation: 45
        }
      }
    }
  };

  const handleApplicationStatusUpdate = async (appName: string, status: ApplicationStatusType) => {
    await database.saveApplicationStatus(appName, status);
    console.log(`Updated automation status for ${appName}:`, status);
  };

  return (
    <div ref={dashboardRef} className="relative space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Floating Back Button */}
      <FloatingBackButton targetPath="/dashboard" position="top-left" />

      {/* Dashboard Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🤖 Test Automation Dashboard</h1>
            <p className="text-gray-600 mt-2">Comprehensive automation coverage, ROI analysis, and framework performance metrics</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowEditMode(!showEditMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showEditMode 
                  ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              {showEditMode ? '🔒 Lock Status' : '✏️ Edit Status'}
            </button>
            <div className="text-sm text-gray-500">
              Last Updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Top 10 KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {automationKPIs.map((kpi, index) => (
          <MetricCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            unit={kpi.unit}
            trend={kpi.trend as 'up' | 'down' | 'stable'}
            trendValue={kpi.trendValue}
            className="text-center"
            icon={
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-lg">{kpi.icon}</span>
              </div>
            }
          />
        ))}
      </div>

      {/* Application Automation Status */}
      <ApplicationStatusGrid
        applications={automationApplications}
        showEditButtons={showEditMode}
        onStatusUpdate={handleApplicationStatusUpdate}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coverage Growth Trends */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <Line data={coverageGrowthData} options={coverageGrowthOptions} />
        </div>

        {/* ROI Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '300px', height: '300px' }}>
              <Doughnut data={roiData} options={roiOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Framework Performance Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '350px', height: '350px' }}>
              <Radar data={frameworkData} options={frameworkOptions} />
            </div>
          </div>
        </div>

        {/* Flaky Tests Analysis */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <Bar data={flakyTestsData} options={flakyTestsOptions} />
        </div>
      </div>

      {/* Automation Insights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Automation Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-green-900">✅ Achievements</h4>
            <ul className="space-y-2 text-sm">
              <li>• UI automation coverage increased by 8% this quarter</li>
              <li>• API test suite now covers 94% of endpoints</li>
              <li>• Parallel execution reduced test time by 65%</li>
              <li>• CI/CD integration achieved 96% reliability</li>
              <li>• Cross-platform testing expanded to 12 environments</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-orange-900">⚠️ Focus Areas</h4>
            <ul className="space-y-2 text-sm">
              <li>• AS400 automation coverage needs improvement (45%)</li>
              <li>• Flaky test rate should be reduced below 3%</li>
              <li>• Mobile automation framework requires updates</li>
              <li>• Database testing automation lagging behind</li>
              <li>• Test data management needs centralization</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-blue-900">🚀 Next Quarter Goals</h4>
            <ul className="space-y-2 text-sm">
              <li>• Achieve 85% overall automation coverage</li>
              <li>• Implement AI-powered test generation</li>
              <li>• Enhance visual regression testing</li>
              <li>• Deploy containerized test environments</li>
              <li>• Integrate performance testing automation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ROI Metrics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Automation ROI Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">$2.4M</p>
            <p className="text-sm text-green-700">Annual Cost Savings</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">4,200</p>
            <p className="text-sm text-blue-700">Hours Saved/Month</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">312%</p>
            <p className="text-sm text-purple-700">Total ROI</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">18</p>
            <p className="text-sm text-orange-700">Months to Break-even</p>
          </div>
        </div>
      </div>

      {/* Data Timestamp Footer */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div>
            🤖 Automation Platforms: Selenium, Cypress, REST Assured, Appium
          </div>
          <div>
            🔄 Last Data Refresh: {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      {/* PDF Export Button */}
      <PDFExportButton 
        targetRef={dashboardRef} 
        fileName="test-automation-dashboard.pdf"
        dashboardTitle="Test Automation Dashboard"
        includeTimestamp={true}
        watermark="QE Dashboard - Test Automation - Confidential"
      />
    </div>
  );
};

export default EnhancedTestAutomationDashboard;
