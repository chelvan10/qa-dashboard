'use client';

import React, { useRef } from 'react';
import { Radar, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { MetricCard, StatusBadge } from '@/components/ui/SharedComponents';
import { QEDashboardData } from '@/types/dashboard';
import { PDFExportButton } from "@/components/ui/PDFExportButton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface QECapabilityDashboardProps {
  data: QEDashboardData;
}

const QECapabilityDashboard: React.FC<QECapabilityDashboardProps> = ({ data }) => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { qeCapability } = data;

  // KPI Cards Data
  const kpiCards = [
    {
      title: 'Regression Automation',
      value: qeCapability.kpis.regressionAutomation,
      unit: '%',
      icon: '🤖',
      trend: 'up' as const,
      trendValue: '+5%'
    },
    {
      title: 'Defect Leakage',
      value: qeCapability.kpis.defectLeakage,
      unit: '%',
      icon: '🔍',
      trend: 'down' as const,
      trendValue: '-0.8%'
    },
    {
      title: 'Test Coverage',
      value: qeCapability.kpis.testCoverage,
      unit: '%',
      icon: '📊',
      trend: 'up' as const,
      trendValue: '+3%'
    },
    {
      title: 'Automation ROI',
      value: qeCapability.kpis.automationROI,
      unit: '%',
      icon: '💰',
      trend: 'up' as const,
      trendValue: '+12%'
    }
  ];

  // Radar Chart for QE Maturity
  const radarData = {
    labels: ['Test Strategy', 'Automation', 'CI/CD', 'Performance', 'Security', 'Monitoring'],
    datasets: [
      {
        label: 'Current Maturity',
        data: [
          qeCapability.maturityRadar.testStrategy,
          qeCapability.maturityRadar.automation,
          qeCapability.maturityRadar.cicd,
          qeCapability.maturityRadar.performance,
          qeCapability.maturityRadar.security,
          qeCapability.maturityRadar.monitoring
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
      }
    ]
  };

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'QE Maturity Assessment'
      }
    },
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  };

  // CI/CD Insights Bar Chart
  const cicdData = {
    labels: ['Pipeline Success', 'Deployment Frequency', 'Lead Time (Days)', 'MTTR (Hours)'],
    datasets: [
      {
        label: 'Current Performance',
        data: [
          qeCapability.cicdInsights.pipelineSuccess,
          qeCapability.cicdInsights.deploymentFrequency,
          qeCapability.cicdInsights.leadTime * 10, // Scale for visibility
          qeCapability.cicdInsights.mttr * 5 // Scale for visibility
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const cicdOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'CI/CD Performance Metrics'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div ref={dashboardRef} className="relative space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <MetricCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            unit={kpi.unit}
            trend={kpi.trend}
            trendValue={kpi.trendValue}
            icon={
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">{kpi.icon}</span>
              </div>
            }
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QE Maturity Radar */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div style={{ height: '400px' }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        {/* CI/CD Insights */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div style={{ height: '400px' }}>
            <Bar data={cicdData} options={cicdOptions} />
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">🗺️ QE Capability Roadmap</h3>
        <div className="space-y-4">
          {qeCapability.roadmap.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600">{item.quarter}</span>
                  <StatusBadge status={item.status} />
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.priority === 'high' ? 'bg-red-100 text-red-800' :
                    item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.priority} priority
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 mt-2">{item.initiative}</h4>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transition Journey */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Transformation Journey</h3>
        <p className="text-gray-700 leading-relaxed">{qeCapability.transitionJourney}</p>
        
        {/* Progress indicators */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-red-600 text-2xl">📝</span>
            </div>
            <h4 className="font-medium text-gray-900">Manual Testing</h4>
            <p className="text-sm text-gray-600">Legacy approach</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-yellow-600 text-2xl">⚡</span>
            </div>
            <h4 className="font-medium text-gray-900">Hybrid Automation</h4>
            <p className="text-sm text-gray-600">Current state - 78%</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-green-600 text-2xl">🤖</span>
            </div>
            <h4 className="font-medium text-gray-900">Intelligent QE</h4>
            <p className="text-sm text-gray-600">Target state - 95%</p>
          </div>
        </div>
      </div>

      {/* PDF Export Button - Positioned absolutely in the bottom right corner */}
      <div className="absolute bottom-4 right-4">
        <PDFExportButton targetRef={dashboardRef} fileName="qe-capability-dashboard.pdf" />
      </div>
    </div>
  );
};

export default QECapabilityDashboard;
