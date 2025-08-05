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

interface PerformanceTestingDashboardProps {
  data: QEDashboardData;
}

const PerformanceTestingDashboard: React.FC<PerformanceTestingDashboardProps> = ({ data }) => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { performanceTesting } = data;

  // Top 10 KPIs for Performance Testing
  const performanceKPIs = [
    { title: 'Avg Response Time', value: 250, unit: 'ms', trend: 'down', trendValue: '-30ms', icon: '⚡' },
    { title: 'Peak Throughput', value: 2850, unit: 'RPS', trend: 'up', trendValue: '+150', icon: '🚀' },
    { title: 'CPU Utilization', value: 72, unit: '%', trend: 'stable', trendValue: 'Optimal', icon: '🖥️' },
    { title: 'Memory Usage', value: 68, unit: '%', trend: 'down', trendValue: '-5%', icon: '💾' },
    { title: 'Error Rate', value: 0.12, unit: '%', trend: 'down', trendValue: '-0.08%', icon: '🔴' },
    { title: 'Load Capacity', value: 5000, unit: 'Users', trend: 'up', trendValue: '+500', icon: '👥' },
    { title: 'Network I/O', value: 85, unit: 'MB/s', trend: 'stable', trendValue: 'Stable', icon: '🌐' },
    { title: 'Database Latency', value: 45, unit: 'ms', trend: 'down', trendValue: '-8ms', icon: '🗄️' },
    { title: 'Availability SLA', value: 99.8, unit: '%', trend: 'up', trendValue: '+0.1%', icon: '✅' },
    { title: 'Recovery Time', value: 15, unit: 'sec', trend: 'down', trendValue: '-5sec', icon: '🔄' }
  ];

  // Response Time Trends Chart
  const responseTimeData = {
    labels: performanceTesting.responseTime.map(item => new Date(item.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Average Response Time (ms)',
        data: performanceTesting.responseTime.map(item => item.avgResponseTime),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const responseTimeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Response Time Trends Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Response Time (ms)'
        }
      }
    }
  };

  // Throughput by Endpoint Chart
  const throughputData = {
    labels: performanceTesting.throughput.map(item => item.endpoint),
    datasets: [
      {
        label: 'Requests per Second',
        data: performanceTesting.throughput.map(item => item.requestsPerSecond),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(14, 165, 233, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(14, 165, 233, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const throughputOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Throughput by API Endpoint'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Requests per Second'
        }
      }
    }
  };

  // Resource Utilization Doughnut Chart
  const resourceData = {
    labels: ['CPU Used', 'CPU Free', 'Memory Used', 'Memory Free', 'Network Used', 'Network Free'],
    datasets: [
      {
        data: [
          performanceTesting.resourceUtilization.cpu,
          100 - performanceTesting.resourceUtilization.cpu,
          performanceTesting.resourceUtilization.memory,
          100 - performanceTesting.resourceUtilization.memory,
          performanceTesting.resourceUtilization.network,
          100 - performanceTesting.resourceUtilization.network
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)', // CPU Used
          'rgba(239, 68, 68, 0.2)', // CPU Free
          'rgba(59, 130, 246, 0.8)', // Memory Used
          'rgba(59, 130, 246, 0.2)', // Memory Free
          'rgba(34, 197, 94, 0.8)', // Network Used
          'rgba(34, 197, 94, 0.2)'  // Network Free
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(59, 130, 246, 1)',
          'rgba(59, 130, 246, 0.5)',
          'rgba(34, 197, 94, 1)',
          'rgba(34, 197, 94, 0.5)'
        ],
        borderWidth: 2
      }
    ]
  };

  const resourceOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'System Resource Utilization'
      }
    }
  };

  // Performance test scenarios with health indicators
  const testScenarios = [
    { name: 'User Login Load', baseline: '200ms', current: '185ms', status: 'excellent', load: '1000 users' },
    { name: 'API Gateway Stress', baseline: '150ms', current: '165ms', status: 'good', load: '5000 RPS' },
    { name: 'Database Heavy Query', baseline: '500ms', current: '520ms', status: 'warning', load: '500 queries/sec' },
    { name: 'File Upload Endurance', baseline: '2000ms', current: '1850ms', status: 'excellent', load: '100 concurrent' },
    { name: 'Search Functionality', baseline: '300ms', current: '295ms', status: 'excellent', load: '2000 users' },
    { name: 'Payment Processing', baseline: '400ms', current: '435ms', status: 'warning', load: '200 TPS' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-300';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return '🟢';
      case 'good': return '🔵';
      case 'warning': return '🟡';
      case 'critical': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div ref={dashboardRef} className="relative space-y-6">
      {/* Top 10 KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {performanceKPIs.map((kpi, index) => (
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

      {/* Performance Test Scenarios */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Performance Test Scenarios Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testScenarios.map((scenario, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 ${getStatusColor(scenario.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{scenario.name}</h4>
                <span className="text-lg">{getStatusIcon(scenario.status)}</span>
              </div>
              <div className="text-xs space-y-1">
                <p><strong>Baseline:</strong> {scenario.baseline}</p>
                <p><strong>Current:</strong> {scenario.current}</p>
                <p><strong>Load:</strong> {scenario.load}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Trends */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <Line data={responseTimeData} options={responseTimeOptions} />
        </div>

        {/* Resource Utilization */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '350px', height: '350px' }}>
              <Doughnut data={resourceData} options={resourceOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Throughput Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <Bar data={throughputData} options={throughputOptions} />
      </div>

      {/* Performance Testing Insights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Performance Testing Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-green-900">✅ Performance Gains</h4>
            <ul className="space-y-2 text-sm">
              <li>• User login response time improved by 15ms</li>
              <li>• Database query optimization reduced latency by 20%</li>
              <li>• CDN implementation improved static content delivery</li>
              <li>• Connection pooling increased throughput by 25%</li>
              <li>• Caching strategy reduced server load by 30%</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-orange-900">⚠️ Performance Concerns</h4>
            <ul className="space-y-2 text-sm">
              <li>• Database heavy queries showing degradation</li>
              <li>• Payment processing latency increasing</li>
              <li>• Memory usage trending upward</li>
              <li>• Third-party API dependencies impacting response</li>
              <li>• Peak hour performance degradation observed</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-blue-900">🔧 Optimization Plans</h4>
            <ul className="space-y-2 text-sm">
              <li>• Database index optimization scheduled</li>
              <li>• Load balancer configuration review</li>
              <li>• Application code profiling in progress</li>
              <li>• Infrastructure scaling analysis</li>
              <li>• Performance monitoring dashboard enhancement</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SLA Tracking */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 SLA Performance Tracking</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">99.8%</p>
            <p className="text-sm text-green-700">Availability SLA</p>
            <p className="text-xs text-green-600 mt-1">Target: 99.5%</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">250ms</p>
            <p className="text-sm text-blue-700">Avg Response Time</p>
            <p className="text-xs text-blue-600 mt-1">Target: &lt;300ms</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">2850</p>
            <p className="text-sm text-purple-700">Peak Throughput</p>
            <p className="text-xs text-purple-600 mt-1">Target: &gt;2500 RPS</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">0.12%</p>
            <p className="text-sm text-orange-700">Error Rate</p>
            <p className="text-xs text-orange-600 mt-1">Target: &lt;0.5%</p>
          </div>
        </div>
      </div>

      {/* PDF Export Button */}
      <div className="absolute bottom-4 right-4">
        <PDFExportButton targetRef={dashboardRef} fileName="performance-testing-dashboard.pdf" />
      </div>
    </div>
  );
};

export default PerformanceTestingDashboard;
