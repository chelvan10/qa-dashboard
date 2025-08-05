'use client';

import React, { useRef, useState } from 'react';
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
import { ProjectSprintSelector, Project, Sprint } from '@/components/ui/ProjectSprintSelector';
import { CompactRealTimeToggle } from '@/components/ui/CompactRealTimeToggle';
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

interface EnhancedTestAutomationDashboardProps {
  data: QEDashboardData;
}

// Mock data for projects and sprints (reusing from functional testing)
const mockProjects: Project[] = [
  {
    id: 'ecommerce-web',
    name: 'E-Commerce Web Platform',
    description: 'Main customer-facing web application',
    status: 'active',
    team: 'Web Team Alpha',
    technology: ['React', 'Node.js', 'PostgreSQL', 'Redis']
  },
  {
    id: 'mobile-app',
    name: 'Mobile Application', 
    description: 'iOS and Android customer apps',
    status: 'active',
    team: 'Mobile Squad',
    technology: ['React Native', 'Firebase', 'GraphQL']
  },
  {
    id: 'payment-service',
    name: 'Payment Processing Service',
    description: 'Core payment and billing microservice', 
    status: 'active',
    team: 'Backend Team Beta',
    technology: ['Java', 'Spring Boot', 'MySQL', 'Kafka']
  }
];

const mockSprints: Sprint[] = [
  {
    id: 'sprint-24-2',
    name: 'Sprint 24.2 - Automation Focus',
    projectId: 'ecommerce-web',
    startDate: new Date('2025-01-20'),
    endDate: new Date('2025-02-02'),
    status: 'active',
    goals: ['Increase automation coverage', 'Reduce flaky tests']
  },
  {
    id: 'sprint-mobile-5',
    name: 'Mobile Sprint 5',
    projectId: 'mobile-app',
    startDate: new Date('2025-01-13'),
    endDate: new Date('2025-01-26'),
    status: 'active',
    goals: ['UI automation', 'API test automation']
  },
  {
    id: 'sprint-pay-8',
    name: 'Payment Sprint 8',
    projectId: 'payment-service',
    startDate: new Date('2025-01-15'), 
    endDate: new Date('2025-01-28'),
    status: 'active',
    goals: ['Contract testing', 'Load test automation']
  }
];

const EnhancedTestAutomationDashboard: React.FC<EnhancedTestAutomationDashboardProps> = ({ data }) => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project>(mockProjects[0]);
  const [selectedSprint, setSprint] = useState<Sprint>(mockSprints[0]);
  const [isRealTime, setIsRealTime] = useState(false);

  // Generate project-specific automation KPIs
  const getAutomationKPIs = (project: Project) => {
    const kpiData = {
      'ecommerce-web': [
        { title: 'Automation Coverage', value: 78, unit: '%', trend: 'up' as const, trendValue: '+12%', icon: '🎯' },
        { title: 'Test Execution Time', value: 24, unit: 'min', trend: 'down' as const, trendValue: '-8 min', icon: '⏱️' },
        { title: 'Flaky Test Rate', value: 3.2, unit: '%', trend: 'down' as const, trendValue: '-1.1%', icon: '🔄' },
        { title: 'Automation ROI', value: 340, unit: '%', trend: 'up' as const, trendValue: '+45%', icon: '💰' },
        { title: 'API Test Coverage', value: 92, unit: '%', trend: 'up' as const, trendValue: '+8%', icon: '🔗' },
        { title: 'UI Test Coverage', value: 65, unit: '%', trend: 'up' as const, trendValue: '+15%', icon: '🖥️' },
        { title: 'Parallel Execution', value: 85, unit: '%', trend: 'up' as const, trendValue: '+20%', icon: '⚡' },
        { title: 'Test Data Setup', value: 2.1, unit: 'min', trend: 'down' as const, trendValue: '-0.9 min', icon: '📊' },
        { title: 'Framework Stability', value: 96, unit: '%', trend: 'stable' as const, trendValue: 'Stable', icon: '🏗️' },
        { title: 'Maintenance Effort', value: 12, unit: 'hrs/week', trend: 'down' as const, trendValue: '-3 hrs', icon: '🔧' }
      ],
      'mobile-app': [
        { title: 'UI Automation', value: 72, unit: '%', trend: 'up' as const, trendValue: '+18%', icon: '📱' },
        { title: 'Device Coverage', value: 89, unit: '%', trend: 'up' as const, trendValue: '+12%', icon: '📲' },
        { title: 'Test Execution', value: 31, unit: 'min', trend: 'down' as const, trendValue: '-7 min', icon: '⏱️' },
        { title: 'Appium Tests', value: 145, unit: 'tests', trend: 'up' as const, trendValue: '+23', icon: '🤖' },
        { title: 'Cloud Testing', value: 94, unit: '%', trend: 'up' as const, trendValue: '+8%', icon: '☁️' },
        { title: 'Regression Suite', value: 78, unit: 'min', trend: 'down' as const, trendValue: '-12 min', icon: '🔄' },
        { title: 'Flaky Tests', value: 4.1, unit: '%', trend: 'down' as const, trendValue: '-1.8%', icon: '🔄' },
        { title: 'Cross-Platform', value: 87, unit: '%', trend: 'stable' as const, trendValue: 'Stable', icon: '🔀' },
        { title: 'Performance Tests', value: 56, unit: '%', trend: 'up' as const, trendValue: '+22%', icon: '🚀' },
        { title: 'Automation ROI', value: 280, unit: '%', trend: 'up' as const, trendValue: '+35%', icon: '💰' }
      ],
      'payment-service': [
        { title: 'API Coverage', value: 95, unit: '%', trend: 'up' as const, trendValue: '+5%', icon: '🔗' },
        { title: 'Contract Tests', value: 87, unit: '%', trend: 'up' as const, trendValue: '+25%', icon: '📋' },
        { title: 'Load Test Auto', value: 78, unit: '%', trend: 'up' as const, trendValue: '+30%', icon: '📈' },
        { title: 'Security Tests', value: 92, unit: '%', trend: 'up' as const, trendValue: '+15%', icon: '🔒' },
        { title: 'Data Validation', value: 98, unit: '%', trend: 'stable' as const, trendValue: 'Stable', icon: '✅' },
        { title: 'Error Scenarios', value: 89, unit: '%', trend: 'up' as const, trendValue: '+12%', icon: '🚨' },
        { title: 'Response Time', value: 145, unit: 'ms', trend: 'down' as const, trendValue: '-25 ms', icon: '⚡' },
        { title: 'Throughput Tests', value: 84, unit: '%', trend: 'up' as const, trendValue: '+18%', icon: '🌊' },
        { title: 'Chaos Testing', value: 67, unit: '%', trend: 'up' as const, trendValue: '+40%', icon: '🎭' },
        { title: 'Automation ROI', value: 420, unit: '%', trend: 'up' as const, trendValue: '+55%', icon: '💰' }
      ]
    };

    return kpiData[project.id as keyof typeof kpiData] || kpiData['ecommerce-web'];
  };

  // Get automation framework status by project
  const getFrameworkStatus = (project: Project) => {
    const frameworks = {
      'ecommerce-web': [
        { name: 'Cypress E2E', status: 'healthy', coverage: 65, tests: 234, lastRun: '2 hrs ago', flaky: 2 },
        { name: 'Jest Unit Tests', status: 'healthy', coverage: 95, tests: 1234, lastRun: '1 hr ago', flaky: 0 },
        { name: 'API Testing (Newman)', status: 'warning', coverage: 78, tests: 156, lastRun: '4 hrs ago', flaky: 5 },
        { name: 'Visual Regression', status: 'healthy', coverage: 45, tests: 89, lastRun: '3 hrs ago', flaky: 1 },
        { name: 'Performance (K6)', status: 'healthy', coverage: 67, tests: 23, lastRun: '6 hrs ago', flaky: 0 }
      ],
      'mobile-app': [
        { name: 'Appium iOS', status: 'healthy', coverage: 72, tests: 145, lastRun: '1 hr ago', flaky: 3 },
        { name: 'Appium Android', status: 'healthy', coverage: 68, tests: 142, lastRun: '1 hr ago', flaky: 4 },
        { name: 'Detox React Native', status: 'warning', coverage: 54, tests: 89, lastRun: '5 hrs ago', flaky: 7 },
        { name: 'API Tests (REST)', status: 'healthy', coverage: 89, tests: 167, lastRun: '2 hrs ago', flaky: 1 },
        { name: 'Device Farm Tests', status: 'healthy', coverage: 78, tests: 234, lastRun: '3 hrs ago', flaky: 2 }
      ],
      'payment-service': [
        { name: 'REST API Tests', status: 'healthy', coverage: 95, tests: 345, lastRun: '30 min ago', flaky: 1 },
        { name: 'Contract Tests (Pact)', status: 'healthy', coverage: 87, tests: 78, lastRun: '1 hr ago', flaky: 0 },
        { name: 'Load Tests (JMeter)', status: 'warning', coverage: 45, tests: 23, lastRun: '8 hrs ago', flaky: 2 },
        { name: 'Security Tests (OWASP)', status: 'healthy', coverage: 92, tests: 156, lastRun: '2 hrs ago', flaky: 0 },
        { name: 'Chaos Engineering', status: 'experimental', coverage: 23, tests: 12, lastRun: '1 day ago', flaky: 3 }
      ]
    };

    return frameworks[project.id as keyof typeof frameworks] || frameworks['ecommerce-web'];
  };

  const automationKPIs = getAutomationKPIs(selectedProject);
  const frameworkStatus = getFrameworkStatus(selectedProject);

  // Chart data
  const coverageGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'UI Automation',
        data: [45, 52, 58, 62, 68, 72],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
      {
        label: 'API Automation',
        data: [78, 82, 85, 88, 91, 95],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const roiData = {
    labels: ['Manual Cost', 'Automation Cost', 'Savings', 'ROI'],
    datasets: [
      {
        data: [120000, 35000, 85000, 340],
        backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#8B5CF6'],
        borderWidth: 2,
      },
    ],
  };

  const executionTimeData = {
    labels: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5'],
    datasets: [
      {
        label: 'Execution Time (minutes)',
        data: [45, 38, 32, 28, 24],
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
      },
      {
        label: 'Parallel Runs',
        data: [2, 3, 4, 5, 6],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
    ],
  };

  return (
    <div ref={dashboardRef} className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Test Automation Dashboard</h2>
          <p className="text-sm text-gray-600">Automation coverage, ROI analysis, and framework performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <CompactRealTimeToggle isRealTime={isRealTime} onToggle={setIsRealTime} />
          <PDFExportButton targetRef={dashboardRef} fileName="test-automation-dashboard" />
        </div>
      </div>

      {/* Project/Sprint Selection */}
      <ProjectSprintSelector
        projects={mockProjects}
        sprints={mockSprints}
        selectedProject={selectedProject}
        selectedSprint={selectedSprint}
        onProjectChange={setSelectedProject}
        onSprintChange={setSprint}
      />

      {/* Automation Framework Status - Current Sprint */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 border-l-4 border-blue-500 pl-4">
          Automation Framework Status - {selectedSprint.name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {frameworkStatus.map((framework, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{framework.name}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  framework.status === 'healthy' ? 'bg-green-100 text-green-800' :
                  framework.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  framework.status === 'experimental' ? 'bg-purple-100 text-purple-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {framework.status.toUpperCase()}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Coverage:</span>
                  <span className="font-medium">{framework.coverage}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tests:</span>
                  <span className="font-medium">{framework.tests}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Flaky:</span>
                  <span className={`font-medium ${framework.flaky > 5 ? 'text-red-600' : framework.flaky > 2 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {framework.flaky}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Run:</span>
                  <span className="text-gray-500">{framework.lastRun}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      framework.coverage >= 80 ? 'bg-green-500' :
                      framework.coverage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${framework.coverage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automation KPIs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 border-l-4 border-green-500 pl-4">
          Automation KPIs - {selectedProject.name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {automationKPIs.map((kpi, index) => (
            <MetricCard key={index} {...kpi} />
          ))}
        </div>
      </div>

      {/* Coverage Growth & ROI Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 border-l-4 border-purple-500 pl-4">
            Coverage Growth Trends
          </h3>
          <div className="h-64">
            <Line
              data={coverageGrowthData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Automation Coverage Over Time (%)', font: { size: 14 } },
                },
                scales: {
                  y: { beginAtZero: true, max: 100 },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 border-l-4 border-yellow-500 pl-4">
            ROI Analysis
          </h3>
          <div className="h-64">
            <Doughnut
              data={roiData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' },
                  title: { display: true, text: 'Cost Breakdown & ROI', font: { size: 14 } },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Execution Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 border-l-4 border-indigo-500 pl-4">
          Execution Performance Optimization
        </h3>
        <div className="h-80">
          <Bar
            data={executionTimeData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Execution Time vs Parallel Runs', font: { size: 14 } },
              },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>
      </div>

      {/* Flaky Test Management */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 border-l-4 border-red-500 pl-4">
          Flaky Test Management
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="text-red-800 font-medium">High Priority</div>
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-sm text-red-600">Tests failing {'>'}50%</div>
            </div>
            <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
              <div className="text-yellow-800 font-medium">Medium Priority</div>
              <div className="text-2xl font-bold text-yellow-600">7</div>
              <div className="text-sm text-yellow-600">Tests failing 20-50%</div>
            </div>
            <div className="p-4 border border-green-200 rounded-lg bg-green-50">
              <div className="text-green-800 font-medium">Stable</div>
              <div className="text-2xl font-bold text-green-600">224</div>
              <div className="text-sm text-green-600">Tests passing {'>'}95%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Automation Health Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 border-l-4 border-gray-500 pl-4">
          Weekly Automation Health - {selectedSprint.name}
        </h3>
        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-900">Coverage Milestone Achieved</h4>
                <p className="text-sm text-green-700">API automation reached 95% coverage target</p>
              </div>
              <span className="text-xs text-green-600">Today</span>
            </div>
          </div>
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">New Framework Implementation</h4>
                <p className="text-sm text-blue-700">Contract testing framework deployed to staging</p>
              </div>
              <span className="text-xs text-blue-600">2 days ago</span>
            </div>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4 py-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-yellow-900">Maintenance Required</h4>
                <p className="text-sm text-yellow-700">5 tests require updates due to UI changes</p>
              </div>
              <span className="text-xs text-yellow-600">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTestAutomationDashboard;
