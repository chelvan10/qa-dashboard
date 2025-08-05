'use client';

import React, { useRef } from 'react';
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

interface TestAutomationDashboardProps {
  data: QEDashboardData;
}

const TestAutomationDashboard: React.FC<TestAutomationDashboardProps> = ({ data }) => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { testAutomation } = data;

  // Top 10 KPIs for Test Automation
  const automationKPIs = [
    { title: 'Test Coverage Growth', value: 78, unit: '%', trend: 'up', trendValue: '+12%', icon: '📈' },
    { title: 'Flaky Test Rate', value: 3.2, unit: '%', trend: 'down', trendValue: '-1.8%', icon: '🔄' },
    { title: 'Automation ROI', value: 340, unit: '%', trend: 'up', trendValue: '+45%', icon: '💰' },
    { title: 'Execution Time', value: 15, unit: 'min', trend: 'down', trendValue: '-8min', icon: '⚡' },
    { title: 'Framework Stability', value: 96, unit: '%', trend: 'up', trendValue: '+2%', icon: '🏗️' },
    { title: 'Tool Efficiency', value: 89, unit: '%', trend: 'up', trendValue: '+5%', icon: '🔧' },
    { title: 'Script Reusability', value: 73, unit: '%', trend: 'up', trendValue: '+8%', icon: '♻️' },
    { title: 'Maintenance Effort', value: 12, unit: 'hrs/week', trend: 'down', trendValue: '-3hrs', icon: '🛠️' },
    { title: 'CI/CD Integration', value: 92, unit: '%', trend: 'up', trendValue: '+7%', icon: '🚀' },
    { title: 'Knowledge Transfer', value: 85, unit: '%', trend: 'up', trendValue: '+10%', icon: '🧠' }
  ];

  // Coverage Growth Chart
  const automationTrendData = {
    labels: testAutomation.coverageGrowth.map(trend => trend.month),
    datasets: [
      {
        label: 'Automation Coverage %',
        data: testAutomation.coverageGrowth.map(trend => trend.coverage),
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const automationTrendOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Automation Coverage Growth Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Coverage Percentage'
        }
      }
    }
  };

  // Execution Times Chart
  const executionTimesData = {
    labels: testAutomation.executionTimes.map(suite => suite.suite),
    datasets: [
      {
        label: 'Execution Time (minutes)',
        data: testAutomation.executionTimes.map(suite => suite.timeMinutes),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      }
    ]
  };

  const executionTimesOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Test Suite Execution Times'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Time (minutes)'
        }
      }
    }
  };

  // ROI Analysis Doughnut Chart
  const roiData = {
    labels: ['Time Saved', 'Cost Reduction', 'Quality Improvement', 'Resource Optimization'],
    datasets: [
      {
        data: [35, 25, 25, 15],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(168, 85, 247, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(168, 85, 247, 1)'
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

  // Tool Comparison Radar Chart
  const toolComparisonData = {
    labels: ['Ease of Use', 'Performance', 'Scalability', 'Maintenance', 'Community Support'],
    datasets: [
      {
        label: 'Selenium',
        data: [75, 85, 90, 70, 95],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
      },
      {
        label: 'Playwright',
        data: [90, 95, 85, 85, 80],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
      },
      {
        label: 'Cypress',
        data: [95, 80, 75, 80, 85],
        borderColor: 'rgba(168, 85, 247, 1)',
        backgroundColor: 'rgba(168, 85, 247, 0.2)',
      }
    ]
  };

  const toolComparisonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Automation Tool Comparison'
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  // Framework details with health indicators
  const frameworkDetails = [
    { name: 'Selenium WebDriver', version: '4.15.0', tests: 456, status: 'stable', lastUpdate: '2 days ago' },
    { name: 'Playwright', version: '1.40.0', tests: 234, status: 'excellent', lastUpdate: '1 day ago' },
    { name: 'RestAssured API', version: '5.3.2', tests: 189, status: 'stable', lastUpdate: '3 days ago' },
    { name: 'Cypress E2E', version: '13.6.0', tests: 123, status: 'warning', lastUpdate: '5 days ago' },
    { name: 'TestNG Framework', version: '7.8.0', tests: 678, status: 'stable', lastUpdate: '1 day ago' },
    { name: 'JUnit Jupiter', version: '5.10.1', tests: 345, status: 'excellent', lastUpdate: '2 days ago' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-300';
      case 'stable': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return '🟢';
      case 'stable': return '🔵';
      case 'warning': return '🟡';
      default: return '⚪';
    }
  };

  return (
    <div ref={dashboardRef} className="relative space-y-6">
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

      {/* Framework Status Cards */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🛠️ Automation Framework Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {frameworkDetails.map((framework, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 ${getStatusColor(framework.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{framework.name}</h4>
                <span className="text-lg">{getStatusIcon(framework.status)}</span>
              </div>
              <div className="text-xs space-y-1">
                <p><strong>Version:</strong> {framework.version}</p>
                <p><strong>Tests:</strong> {framework.tests}</p>
                <p><strong>Updated:</strong> {framework.lastUpdate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coverage Growth Trends */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <Line data={automationTrendData} options={automationTrendOptions} />
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

      {/* Execution Times Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <Bar data={executionTimesData} options={executionTimesOptions} />
      </div>

      {/* Tool Comparison Radar */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '400px', height: '400px' }}>
            <Radar data={toolComparisonData} options={toolComparisonOptions} />
          </div>
        </div>
      </div>

      {/* Weekly Automation Insights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Weekly Automation Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-green-900">✅ Achievements</h4>
            <ul className="space-y-2 text-sm">
              <li>• Playwright framework integration completed</li>
              <li>• API automation coverage increased to 89%</li>
              <li>• Flaky test identification automated</li>
              <li>• CI/CD pipeline optimization reduced execution time</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-blue-900">🎯 In Progress</h4>
            <ul className="space-y-2 text-sm">
              <li>• Visual regression testing implementation</li>
              <li>• Test data management automation</li>
              <li>• Cross-browser testing optimization</li>
              <li>• Performance testing automation</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-orange-900">📋 Planned</h4>
            <ul className="space-y-2 text-sm">
              <li>• AI-powered test generation</li>
              <li>• Self-healing test scripts</li>
              <li>• Test execution analytics dashboard</li>
              <li>• Mobile automation framework</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ROI Metrics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 ROI & Cost Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">340%</p>
            <p className="text-sm text-green-700">Total ROI</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">$2.4M</p>
            <p className="text-sm text-blue-700">Annual Savings</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">78%</p>
            <p className="text-sm text-purple-700">Time Reduction</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">1,245</p>
            <p className="text-sm text-orange-700">Automated Tests</p>
          </div>
        </div>
      </div>

      {/* PDF Export Button */}
      <div className="absolute bottom-4 right-4">
        <PDFExportButton targetRef={dashboardRef} fileName="test-automation-dashboard.pdf" />
      </div>
    </div>
  );
};

export default TestAutomationDashboard;
