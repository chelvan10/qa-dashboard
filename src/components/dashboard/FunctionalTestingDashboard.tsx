'use client';

import React, { useRef } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
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
  ArcElement
);

interface FunctionalTestingDashboardProps {
  data: QEDashboardData;
}

const FunctionalTestingDashboard: React.FC<FunctionalTestingDashboardProps> = ({ data }) => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { functionalTesting } = data;

  // Top 10 KPIs for Functional Testing
  const functionalKPIs = [
    { title: 'Feature Coverage', value: 87, unit: '%', trend: 'up', trendValue: '+5%', icon: '🎯' },
    { title: 'Test Execution Rate', value: 94, unit: '%', trend: 'up', trendValue: '+3%', icon: '⚡' },
    { title: 'Defect Detection', value: 91, unit: '%', trend: 'stable', trendValue: 'Stable', icon: '🔍' },
    { title: 'Sprint Velocity', value: 42, unit: 'SP', trend: 'up', trendValue: '+8%', icon: '🚀' },
    { title: 'Bug Leakage Rate', value: 2.3, unit: '%', trend: 'down', trendValue: '-0.5%', icon: '🐛' },
    { title: 'Maintenance Ratio', value: 15, unit: '%', trend: 'down', trendValue: '-2%', icon: '🔧' },
    { title: 'Test Productivity', value: 23, unit: 'T/H', trend: 'up', trendValue: '+12%', icon: '📈' },
    { title: 'Regression Cycle', value: 4.2, unit: 'H', trend: 'down', trendValue: '-0.8H', icon: '🔄' },
    { title: 'Critical Path Coverage', value: 95, unit: '%', trend: 'up', trendValue: '+2%', icon: '🎭' },
    { title: 'Test Data Quality', value: 89, unit: '%', trend: 'up', trendValue: '+6%', icon: '💾' }
  ];

  // Squad Performance Chart
  const squadData = {
    labels: functionalTesting.squads.map(squad => squad.name),
    datasets: [
      {
        label: 'Passed',
        data: functionalTesting.squads.map(squad => squad.passed),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1
      },
      {
        label: 'Failed',
        data: functionalTesting.squads.map(squad => squad.failed),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1
      },
      {
        label: 'In Maintenance',
        data: functionalTesting.squads.map(squad => squad.inMaintenance),
        backgroundColor: 'rgba(249, 115, 22, 0.8)',
        borderColor: 'rgba(249, 115, 22, 1)',
        borderWidth: 1
      },
      {
        label: 'In Design',
        data: functionalTesting.squads.map(squad => squad.inDesign),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      },
      {
        label: 'Backlog',
        data: functionalTesting.squads.map(squad => squad.backlog),
        backgroundColor: 'rgba(107, 114, 128, 0.8)',
        borderColor: 'rgba(107, 114, 128, 1)',
        borderWidth: 1
      }
    ]
  };

  const squadOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Squad Test Execution Status'
      }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      }
    }
  };

  // Defect Trends Chart
  const defectTrendData = {
    labels: functionalTesting.defectTrends.map(trend => trend.month),
    datasets: [
      {
        label: 'New Defects',
        data: functionalTesting.defectTrends.map(trend => trend.newDefects),
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      },
      {
        label: 'Closed Defects',
        data: functionalTesting.defectTrends.map(trend => trend.closedDefects),
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  };

  const defectTrendOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Defect Trends - New vs Closed'
      }
    }
  };

  // Test Coverage Doughnut Chart
  const coverageData = {
    labels: ['UI Tests', 'API Tests', 'Database Tests'],
    datasets: [
      {
        data: [functionalTesting.testCoverage.ui, functionalTesting.testCoverage.api, functionalTesting.testCoverage.database],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(168, 85, 247, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const coverageOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Test Coverage by Type'
      }
    }
  };

  // Application tiles with sprint info
  const applications = [
    { name: 'SAP S/4 Hana', sprint: 'Sprint 23.4', daysLeft: 5, health: 'excellent' },
    { name: 'SAP CC B2B', sprint: 'Sprint 23.4', daysLeft: 5, health: 'good' },
    { name: 'SAP CC B2C', sprint: 'Sprint 23.4', daysLeft: 5, health: 'warning' },
    { name: 'Mule 4.4', sprint: 'Sprint 23.4', daysLeft: 5, health: 'good' },
    { name: 'GKPOS', sprint: 'Sprint 23.4', daysLeft: 5, health: 'excellent' },
    { name: 'Pacsoft', sprint: 'Sprint 23.4', daysLeft: 5, health: 'good' },
    { name: '1Centre', sprint: 'Sprint 23.4', daysLeft: 5, health: 'warning' },
    { name: 'AS400', sprint: 'Sprint 23.4', daysLeft: 5, health: 'good' },
    { name: 'Tradehub Hybris', sprint: 'Sprint 23.4', daysLeft: 5, health: 'excellent' }
  ];

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'bg-green-100 border-green-300 text-green-800';
      case 'good': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'warning': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent': return '🟢';
      case 'good': return '🔵';
      case 'warning': return '🟡';
      default: return '⚪';
    }
  };

  return (
    <div ref={dashboardRef} className="relative space-y-6">
      {/* Top 10 KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {functionalKPIs.map((kpi, index) => (
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

      {/* Application Tiles with Sprint Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📱 Application Testing Status - Current Sprint</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {applications.map((app, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 ${getHealthColor(app.health)}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{app.name}</h4>
                <span className="text-lg">{getHealthIcon(app.health)}</span>
              </div>
              <div className="text-sm space-y-1">
                <p><strong>{app.sprint}</strong></p>
                <p>⏱️ {app.daysLeft} days left</p>
                <div className="flex justify-between mt-3">
                  <span className="text-xs">Tests: 87%</span>
                  <span className="text-xs">Coverage: 92%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Squad Performance Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <Bar data={squadData} options={squadOptions} />
        </div>

        {/* Test Coverage Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '300px', height: '300px' }}>
              <Doughnut data={coverageData} options={coverageOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Defect Trends Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <Line data={defectTrendData} options={defectTrendOptions} />
      </div>

      {/* Weekly Status Updates */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Weekly Status Updates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-green-900">✅ Progress & Successes</h4>
            <ul className="space-y-2 text-sm">
              <li>• API test automation framework completed for SAP modules</li>
              <li>• Regression test suite execution time reduced by 25%</li>
              <li>• Cross-browser compatibility testing automated</li>
              <li>• Test data management process optimized</li>
              <li>• Quality gates integration with CI/CD pipeline successful</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-red-900">🚨 Blockers & Risks</h4>
            <ul className="space-y-2 text-sm">
              <li>• Test environment downtime affecting Mule 4.4 testing</li>
              <li>• Performance test data refresh delays in Pre-Prod</li>
              <li>• Resource constraints for AS400 testing coverage</li>
              <li>• Third-party API dependencies causing test failures</li>
              <li>• Security scanning integration pending approval</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Cumulative Analytics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Cumulative Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">9</p>
            <p className="text-sm text-blue-700">Active Applications</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">1,247</p>
            <p className="text-sm text-green-700">Total Test Cases</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">89%</p>
            <p className="text-sm text-purple-700">Overall Pass Rate</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">42</p>
            <p className="text-sm text-orange-700">Avg Sprint Velocity</p>
          </div>
        </div>
      </div>

      {/* PDF Export Button */}
      <div className="absolute bottom-4 right-4">
        <PDFExportButton targetRef={dashboardRef} fileName="functional-testing-dashboard.pdf" />
      </div>
    </div>
  );
};

export default FunctionalTestingDashboard;
