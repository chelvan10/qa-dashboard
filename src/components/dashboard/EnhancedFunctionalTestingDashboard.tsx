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

interface EnhancedFunctionalTestingDashboardProps {
  data: QEDashboardData;
}

// Mock data for projects and sprints
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
  },
  {
    id: 'analytics-platform',
    name: 'Analytics Platform',
    description: 'Business intelligence and reporting',
    status: 'completed',
    team: 'Data Team',
    technology: ['Python', 'Apache Spark', 'Elasticsearch']
  }
];

const mockSprints: Sprint[] = [
  {
    id: 'sprint-24-1',
    name: 'Sprint 24.1 - Q1 Features',
    projectId: 'ecommerce-web',
    startDate: new Date('2025-01-06'),
    endDate: new Date('2025-01-19'),
    status: 'completed',
    goals: ['Checkout optimization', 'Product search enhancement']
  },
  {
    id: 'sprint-24-2',
    name: 'Sprint 24.2 - Performance',
    projectId: 'ecommerce-web',
    startDate: new Date('2025-01-20'),
    endDate: new Date('2025-02-02'),
    status: 'active',
    goals: ['Performance improvements', 'Mobile responsiveness']
  },
  {
    id: 'sprint-mobile-5',
    name: 'Mobile Sprint 5',
    projectId: 'mobile-app',
    startDate: new Date('2025-01-13'),
    endDate: new Date('2025-01-26'),
    status: 'active',
    goals: ['Push notifications', 'Offline mode', 'Biometric auth']
  },
  {
    id: 'sprint-pay-8',
    name: 'Payment Sprint 8',
    projectId: 'payment-service',
    startDate: new Date('2025-01-15'),
    endDate: new Date('2025-01-28'),
    status: 'active',
    goals: ['Multi-currency support', 'Fraud detection', 'API rate limiting']
  }
];

const EnhancedFunctionalTestingDashboard: React.FC<EnhancedFunctionalTestingDashboardProps> = ({ data }) => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project>(mockProjects[0]);
  const [selectedSprint, setSprint] = useState<Sprint>(mockSprints[0]);
  const [isRealTime, setIsRealTime] = useState(false);

  // Generate project-specific KPIs based on selection
  const getProjectSpecificKPIs = (project: Project, _sprint: Sprint) => {
    const baseKPIs = {
      'ecommerce-web': [
        { title: 'Feature Coverage', value: 87, unit: '%', trend: 'up' as const, trendValue: '+5%', icon: '🎯' },
        { title: 'UI Test Execution', value: 94, unit: '%', trend: 'up' as const, trendValue: '+3%', icon: '⚡' },
        { title: 'E2E Coverage', value: 78, unit: '%', trend: 'up' as const, trendValue: '+7%', icon: '🔍' },
        { title: 'Cart Flow Tests', value: 95, unit: '%', trend: 'stable' as const, trendValue: 'Stable', icon: '🛒' },
        { title: 'Payment Tests', value: 98, unit: '%', trend: 'up' as const, trendValue: '+2%', icon: '💳' },
        { title: 'Mobile Tests', value: 85, unit: '%', trend: 'up' as const, trendValue: '+8%', icon: '📱' },
        { title: 'API Tests', value: 92, unit: '%', trend: 'stable' as const, trendValue: 'Stable', icon: '🔗' },
        { title: 'Performance Tests', value: 76, unit: '%', trend: 'down' as const, trendValue: '-3%', icon: '🚀' },
        { title: 'Security Tests', value: 89, unit: '%', trend: 'up' as const, trendValue: '+4%', icon: '🔒' },
        { title: 'Defect Density', value: 2.1, unit: '/KLOC', trend: 'down' as const, trendValue: '-0.3', icon: '🐛' }
      ],
      'mobile-app': [
        { title: 'Feature Coverage', value: 82, unit: '%', trend: 'up' as const, trendValue: '+6%', icon: '🎯' },
        { title: 'iOS Test Coverage', value: 88, unit: '%', trend: 'up' as const, trendValue: '+4%', icon: '🍎' },
        { title: 'Android Coverage', value: 85, unit: '%', trend: 'up' as const, trendValue: '+3%', icon: '🤖' },
        { title: 'Offline Tests', value: 76, unit: '%', trend: 'up' as const, trendValue: '+12%', icon: '📴' },
        { title: 'Push Notification', value: 91, unit: '%', trend: 'stable' as const, trendValue: 'Stable', icon: '🔔' },
        { title: 'Biometric Tests', value: 94, unit: '%', trend: 'up' as const, trendValue: '+8%', icon: '👆' },
        { title: 'Network Tests', value: 79, unit: '%', trend: 'up' as const, trendValue: '+5%', icon: '📡' },
        { title: 'Battery Tests', value: 67, unit: '%', trend: 'down' as const, trendValue: '-2%', icon: '🔋' },
        { title: 'Crash Rate', value: 0.02, unit: '%', trend: 'down' as const, trendValue: '-0.01%', icon: '💥' },
        { title: 'Load Time', value: 2.1, unit: 's', trend: 'down' as const, trendValue: '-0.3s', icon: '⏱️' }
      ],
      'payment-service': [
        { title: 'API Coverage', value: 95, unit: '%', trend: 'up' as const, trendValue: '+3%', icon: '🎯' },
        { title: 'Transaction Tests', value: 98, unit: '%', trend: 'stable' as const, trendValue: 'Stable', icon: '💰' },
        { title: 'Fraud Detection', value: 93, unit: '%', trend: 'up' as const, trendValue: '+7%', icon: '🛡️' },
        { title: 'Multi-Currency', value: 87, unit: '%', trend: 'up' as const, trendValue: '+15%', icon: '💱' },
        { title: 'Rate Limiting', value: 91, unit: '%', trend: 'up' as const, trendValue: '+9%', icon: '⚡' },
        { title: 'Error Handling', value: 96, unit: '%', trend: 'stable' as const, trendValue: 'Stable', icon: '🚨' },
        { title: 'Latency Tests', value: 89, unit: '%', trend: 'up' as const, trendValue: '+4%', icon: '⏰' },
        { title: 'Security Tests', value: 97, unit: '%', trend: 'up' as const, trendValue: '+2%', icon: '🔒' },
        { title: 'Load Tests', value: 84, unit: '%', trend: 'up' as const, trendValue: '+8%', icon: '📈' },
        { title: 'Recovery Tests', value: 78, unit: '%', trend: 'down' as const, trendValue: '-5%', icon: '🔄' }
      ]
    };

    return baseKPIs[project.id as keyof typeof baseKPIs] || baseKPIs['ecommerce-web'];
  };

  const projectKPIs = getProjectSpecificKPIs(selectedProject, selectedSprint);

  // Project-specific application status
  const getApplicationStatus = (project: Project) => {
    const statusData = {
      'ecommerce-web': [
        { name: 'Product Catalog', status: 'pass', coverage: 95, lastUpdated: '2 hrs ago', tests: 234 },
        { name: 'Shopping Cart', status: 'pass', coverage: 98, lastUpdated: '1 hr ago', tests: 189 },
        { name: 'Checkout Flow', status: 'warning', coverage: 87, lastUpdated: '3 hrs ago', tests: 156 },
        { name: 'User Account', status: 'pass', coverage: 92, lastUpdated: '4 hrs ago', tests: 178 },
        { name: 'Payment Gateway', status: 'pass', coverage: 99, lastUpdated: '1 hr ago', tests: 145 },
        { name: 'Order Management', status: 'pass', coverage: 94, lastUpdated: '2 hrs ago', tests: 167 }
      ],
      'mobile-app': [
        { name: 'Authentication', status: 'pass', coverage: 96, lastUpdated: '1 hr ago', tests: 78 },
        { name: 'Product Browse', status: 'pass', coverage: 89, lastUpdated: '2 hrs ago', tests: 145 },
        { name: 'Push Notifications', status: 'warning', coverage: 82, lastUpdated: '5 hrs ago', tests: 67 },
        { name: 'Offline Mode', status: 'fail', coverage: 65, lastUpdated: '6 hrs ago', tests: 89 },
        { name: 'Biometric Login', status: 'pass', coverage: 94, lastUpdated: '1 hr ago', tests: 45 },
        { name: 'Camera Features', status: 'pass', coverage: 91, lastUpdated: '3 hrs ago', tests: 56 }
      ],
      'payment-service': [
        { name: 'Transaction API', status: 'pass', coverage: 98, lastUpdated: '30 min ago', tests: 234 },
        { name: 'Fraud Detection', status: 'pass', coverage: 95, lastUpdated: '1 hr ago', tests: 167 },
        { name: 'Multi-Currency', status: 'warning', coverage: 78, lastUpdated: '4 hrs ago', tests: 89 },
        { name: 'Rate Limiting', status: 'pass', coverage: 92, lastUpdated: '2 hrs ago', tests: 123 },
        { name: 'Webhook System', status: 'pass', coverage: 87, lastUpdated: '3 hrs ago', tests: 67 },
        { name: 'Refund Processing', status: 'pass', coverage: 94, lastUpdated: '1 hr ago', tests: 145 }
      ]
    };

    return statusData[project.id as keyof typeof statusData] || statusData['ecommerce-web'];
  };

  const applicationStatus = getApplicationStatus(selectedProject);

  // Charts data
  const defectTrendsData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'New Defects',
        data: [23, 19, 15, 12],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Closed Defects',
        data: [18, 22, 20, 16],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const testCoverageData = {
    labels: ['UI Tests', 'API Tests', 'Integration', 'E2E Tests'],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
        borderWidth: 2,
      },
    ],
  };

  const squadPerformanceData = {
    labels: ['Frontend Squad', 'Backend Squad', 'Mobile Squad', 'QA Squad'],
    datasets: [
      {
        label: 'Completed',
        data: [87, 92, 78, 95],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
      {
        label: 'In Progress',
        data: [8, 5, 15, 3],
        backgroundColor: 'rgba(249, 115, 22, 0.8)',
      },
      {
        label: 'Blocked',
        data: [5, 3, 7, 2],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
    ],
  };

  return (
    <div ref={dashboardRef} className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Functional Testing Dashboard</h2>
          <p className="text-sm text-gray-600">Project-specific functional testing metrics and coverage analysis</p>
        </div>
        <div className="flex items-center space-x-4">
          <CompactRealTimeToggle isRealTime={isRealTime} onToggle={setIsRealTime} />
          <PDFExportButton targetRef={dashboardRef} fileName="functional-testing-dashboard" />
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

      {/* Application Testing Status - Current Sprint */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 border-l-4 border-blue-500 pl-4">
          Application Testing Status - {selectedSprint.name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applicationStatus.map((app, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{app.name}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  app.status === 'pass' ? 'bg-green-100 text-green-800' :
                  app.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {app.status.toUpperCase()}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Coverage:</span>
                  <span className="font-medium">{app.coverage}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tests:</span>
                  <span className="font-medium">{app.tests}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Updated:</span>
                  <span className="text-gray-500">{app.lastUpdated}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      app.coverage >= 90 ? 'bg-green-500' :
                      app.coverage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${app.coverage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 10 KPIs for Selected Project */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 border-l-4 border-green-500 pl-4">
          Key Performance Indicators - {selectedProject.name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {projectKPIs.map((kpi, index) => (
            <MetricCard key={index} {...kpi} />
          ))}
        </div>
      </div>

      {/* Squad Test Execution Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 border-l-4 border-purple-500 pl-4">
          Squad Test Execution Status
        </h3>
        <div className="h-80">
          <Bar
            data={squadPerformanceData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Test Execution by Squad (%)', font: { size: 14 } },
              },
              scales: {
                x: { stacked: true },
                y: { stacked: true, max: 100 },
              },
            }}
          />
        </div>
      </div>

      {/* Test Coverage by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 border-l-4 border-yellow-500 pl-4">
            Test Coverage by Type
          </h3>
          <div className="h-64">
            <Doughnut
              data={testCoverageData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' },
                  title: { display: true, text: 'Coverage Distribution', font: { size: 14 } },
                },
              }}
            />
          </div>
        </div>

        {/* Defect Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 border-l-4 border-red-500 pl-4">
            Defect Trends - New vs Closed
          </h3>
          <div className="h-64">
            <Line
              data={defectTrendsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Weekly Defect Trends', font: { size: 14 } },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Weekly Status Updates */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 border-l-4 border-indigo-500 pl-4">
          Weekly Status Updates - {selectedSprint.name}
        </h3>
        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-900">Week 4 Progress</h4>
                <p className="text-sm text-green-700">Sprint goal achievement: 87% complete</p>
              </div>
              <span className="text-xs text-green-600">2 days ago</span>
            </div>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4 py-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-yellow-900">Blockers Identified</h4>
                <p className="text-sm text-yellow-700">2 critical issues affecting mobile testing</p>
              </div>
              <span className="text-xs text-yellow-600">1 day ago</span>
            </div>
          </div>
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">Automation Update</h4>
                <p className="text-sm text-blue-700">15 new automated test cases added to regression suite</p>
              </div>
              <span className="text-xs text-blue-600">Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cumulative Analytics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 border-l-4 border-gray-500 pl-4">
          Cumulative Analytics - {selectedProject.name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <div className="text-sm text-gray-600">Total Test Cases</div>
            <div className="text-xs text-green-600">+23 this sprint</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-green-600">89.3%</div>
            <div className="text-sm text-gray-600">Avg Coverage</div>
            <div className="text-xs text-green-600">+2.1% this quarter</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">42</div>
            <div className="text-sm text-gray-600">Critical Bugs Fixed</div>
            <div className="text-xs text-green-600">-15% vs last sprint</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">96.7%</div>
            <div className="text-sm text-gray-600">Sprint Success Rate</div>
            <div className="text-xs text-green-600">+1.2% improvement</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedFunctionalTestingDashboard;
