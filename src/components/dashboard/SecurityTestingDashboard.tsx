'use client';

import React from 'react';
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

interface SecurityTestingDashboardProps {
  data: QEDashboardData;
}

const SecurityTestingDashboard: React.FC<SecurityTestingDashboardProps> = ({ data }) => {
  const { securityTesting } = data;

  // Top 10 KPIs for Security Testing
  const securityKPIs = [
    { title: 'Vulnerability Scan Coverage', value: 94, unit: '%', trend: 'up', trendValue: '+3%', icon: '🔍' },
    { title: 'Critical Vulnerabilities', value: securityTesting.vulnerabilities.critical, unit: '', trend: 'down', trendValue: '-2', icon: '🚨' },
    { title: 'High Risk Issues', value: securityTesting.vulnerabilities.high, unit: '', trend: 'down', trendValue: '-5', icon: '⚠️' },
    { title: 'SAST Code Coverage', value: 87, unit: '%', trend: 'up', trendValue: '+4%', icon: '🔧' },
    { title: 'DAST Scan Results', value: 92, unit: '%', trend: 'stable', trendValue: 'Clean', icon: '🌐' },
    { title: 'Dependency Scan', value: 89, unit: '%', trend: 'up', trendValue: '+2%', icon: '📦' },
    { title: 'Compliance Score', value: 95, unit: '%', trend: 'up', trendValue: '+1%', icon: '✅' },
    { title: 'Security Training', value: 78, unit: '%', trend: 'up', trendValue: '+12%', icon: '🎓' },
    { title: 'Incident Response Time', value: 24, unit: 'hrs', trend: 'down', trendValue: '-6hrs', icon: '⏱️' },
    { title: 'Penetration Test Score', value: 8.5, unit: '/10', trend: 'up', trendValue: '+0.3', icon: '🎯' }
  ];

  // Vulnerability Found vs Resolved Trends Chart
  const vulnerabilityTrendData = {
    labels: securityTesting.trends.map(trend => trend.month),
    datasets: [
      {
        label: 'Found',
        data: securityTesting.trends.map(trend => trend.found),
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: false
      },
      {
        label: 'Resolved',
        data: securityTesting.trends.map(trend => trend.resolved),
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: false
      }
    ]
  };

  const vulnerabilityTrendOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Vulnerability Found vs Resolved Trends'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Vulnerabilities'
        }
      }
    }
  };

  // Current Vulnerabilities Distribution
  const vulnerabilityDistributionData = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [
      {
        data: [
          securityTesting.vulnerabilities.critical,
          securityTesting.vulnerabilities.high,
          securityTesting.vulnerabilities.medium,
          securityTesting.vulnerabilities.low
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(34, 197, 94, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const vulnerabilityDistributionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Current Vulnerability Distribution'
      }
    }
  };

  // Security Tools Performance Chart
  const securityToolsData = {
    labels: ['SAST', 'DAST', 'Dependency Scan', 'Container Scan', 'Infrastructure Scan'],
    datasets: [
      {
        label: 'Coverage %',
        data: [87, 92, 89, 85, 91],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      },
      {
        label: 'Accuracy %',
        data: [94, 88, 96, 90, 93],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1
      }
    ]
  };

  const securityToolsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Security Tools Performance Metrics'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Percentage'
        }
      }
    }
  };

  // Security Posture Radar Chart
  const securityPostureData = {
    labels: ['Vulnerability Management', 'Access Control', 'Data Protection', 'Network Security', 'Application Security', 'Compliance'],
    datasets: [
      {
        label: 'Current Score',
        data: [85, 92, 88, 90, 87, 95],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
      },
      {
        label: 'Industry Benchmark',
        data: [80, 85, 82, 88, 83, 90],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
      }
    ]
  };

  const securityPostureOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Security Posture Assessment'
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  // Security test scenarios with risk levels
  const securityScenarios = [
    { name: 'Authentication Bypass', status: 'passed', risk: 'high', lastTested: '2 days ago', coverage: '98%' },
    { name: 'SQL Injection', status: 'passed', risk: 'critical', lastTested: '1 day ago', coverage: '100%' },
    { name: 'XSS Vulnerabilities', status: 'warning', risk: 'medium', lastTested: '3 days ago', coverage: '95%' },
    { name: 'CSRF Protection', status: 'passed', risk: 'high', lastTested: '1 day ago', coverage: '97%' },
    { name: 'Input Validation', status: 'passed', risk: 'medium', lastTested: '2 days ago', coverage: '93%' },
    { name: 'Session Management', status: 'warning', risk: 'high', lastTested: '4 days ago', coverage: '92%' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800 border-green-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'failed': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return '🟢';
      case 'warning': return '🟡';
      case 'failed': return '🔴';
      default: return '⚪';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-700 font-bold';
      case 'high': return 'text-orange-700 font-semibold';
      case 'medium': return 'text-yellow-700';
      case 'low': return 'text-green-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top 10 KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {securityKPIs.map((kpi, index) => (
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

      {/* Security Test Scenarios */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🛡️ Security Test Scenarios Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {securityScenarios.map((scenario, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 ${getStatusColor(scenario.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{scenario.name}</h4>
                <span className="text-lg">{getStatusIcon(scenario.status)}</span>
              </div>
              <div className="text-xs space-y-1">
                <p><strong>Risk:</strong> <span className={getRiskColor(scenario.risk)}>{scenario.risk.toUpperCase()}</span></p>
                <p><strong>Coverage:</strong> {scenario.coverage}</p>
                <p><strong>Last Tested:</strong> {scenario.lastTested}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vulnerability Trends */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <Line data={vulnerabilityTrendData} options={vulnerabilityTrendOptions} />
        </div>

        {/* Current Vulnerability Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '300px', height: '300px' }}>
              <Doughnut data={vulnerabilityDistributionData} options={vulnerabilityDistributionOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Security Tools Performance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <Bar data={securityToolsData} options={securityToolsOptions} />
      </div>

      {/* Security Posture Radar */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '400px', height: '400px' }}>
            <Radar data={securityPostureData} options={securityPostureOptions} />
          </div>
        </div>
      </div>

      {/* Security Testing Insights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔒 Security Testing Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-green-900">✅ Security Strengths</h4>
            <ul className="space-y-2 text-sm">
              <li>• Zero critical vulnerabilities in production</li>
              <li>• SAST integration with CI/CD pipeline</li>
              <li>• Automated dependency vulnerability scanning</li>
              <li>• Strong access control implementation</li>
              <li>• Regular penetration testing program</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-orange-900">⚠️ Areas for Improvement</h4>
            <ul className="space-y-2 text-sm">
              <li>• Session management testing coverage gaps</li>
              <li>• XSS vulnerability detection needs enhancement</li>
              <li>• Container security scanning optimization</li>
              <li>• Third-party library update delays</li>
              <li>• Security training completion rates</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-blue-900">🎯 Planned Enhancements</h4>
            <ul className="space-y-2 text-sm">
              <li>• Advanced threat modeling implementation</li>
              <li>• Runtime application security protection</li>
              <li>• API security testing automation</li>
              <li>• Cloud security posture management</li>
              <li>• Zero trust architecture assessment</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Compliance & Certifications */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📜 Compliance & Certifications Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">ISO 27001</p>
            <p className="text-sm text-green-700">Certified</p>
            <p className="text-xs text-green-600 mt-1">Valid until Dec 2024</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">SOC 2</p>
            <p className="text-sm text-blue-700">Type II Compliant</p>
            <p className="text-xs text-blue-600 mt-1">Audit completed</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">GDPR</p>
            <p className="text-sm text-purple-700">Compliant</p>
            <p className="text-xs text-purple-600 mt-1">95% score</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">PCI DSS</p>
            <p className="text-sm text-orange-700">Level 1 Compliant</p>
            <p className="text-xs text-orange-600 mt-1">Next audit: Q2 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTestingDashboard;
