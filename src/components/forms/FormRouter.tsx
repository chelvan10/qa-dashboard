'use client';

import React, { useState } from 'react';
import { SummaryDashboardForm } from './SummaryDashboardForm';
import { QECapabilityForm } from './QECapabilityForm';
import { NonProdEnvironmentsForm } from './NonProdEnvironmentsForm';
import { FunctionalTestingForm } from './FunctionalTestingForm';
import { TestAutomationForm } from './TestAutomationForm';
import { SecurityTestingForm } from './SecurityTestingForm';

// Form type definitions
export type FormType = 
  | 'summary' 
  | 'qe-capability' 
  | 'non-prod-environments' 
  | 'functional-testing' 
  | 'test-automation' 
  | 'performance-testing' 
  | 'security-testing';

interface FormRouterProps {
  initialForm?: FormType;
  onFormChange?: (formType: FormType) => void;
}

export function FormRouter({ initialForm = 'summary', onFormChange }: FormRouterProps) {
  const [activeForm, setActiveForm] = useState<FormType>(initialForm);

  const formTabs = [
    { id: 'summary', name: 'Summary Dashboard', icon: '📊', implemented: true },
    { id: 'qe-capability', name: 'QE Capability', icon: '🎯', implemented: true },
    { id: 'non-prod-environments', name: 'Non-Prod Environments', icon: '🖥️', implemented: true },
    { id: 'functional-testing', name: 'Functional Testing', icon: '🧪', implemented: true },
    { id: 'test-automation', name: 'Test Automation', icon: '🤖', implemented: false },
    { id: 'performance-testing', name: 'Performance Testing', icon: '⚡', implemented: false },
    { id: 'security-testing', name: 'Security Testing', icon: '🔒', implemented: true },
  ] as const;

  const handleTabChange = (formType: FormType) => {
    const tab = formTabs.find(t => t.id === formType);
    if (!tab?.implemented) {
      alert(`${tab?.name} form is coming soon! Currently implementing all forms.`);
      return;
    }
    
    setActiveForm(formType);
    onFormChange?.(formType);
  };

  const PlaceholderForm = ({ formName }: { formName: string }) => (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {formName} Form
        </h2>
        <p className="text-gray-600 mb-6">
          This comprehensive form is currently being implemented with all relevant fields for data input.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-blue-800 text-sm">
            <strong>Coming Soon:</strong> Full implementation with validation, real-time integration capabilities, and form data management.
          </p>
        </div>
      </div>
    </div>
  );

  const renderActiveForm = () => {
    switch (activeForm) {
      case 'summary':
        return <SummaryDashboardForm />;
      case 'qe-capability':
        return <QECapabilityForm />;
      case 'non-prod-environments':
        return <NonProdEnvironmentsForm />;
      case 'functional-testing':
        return <FunctionalTestingForm />;
      case 'test-automation':
        return <TestAutomationForm />;
      case 'performance-testing':
        return <PlaceholderForm formName="Performance Testing" />;
      case 'security-testing':
        return <SecurityTestingForm />;
      default:
        return <SummaryDashboardForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Form Navigation Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {formTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as FormType)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  ${activeForm === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  ${!tab.implemented ? 'opacity-60' : ''}
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
                {!tab.implemented && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                    Soon
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="py-8">
        {renderActiveForm()}
      </div>

      {/* Real-time Integration Info */}
      <div className="bg-blue-50 border-t border-blue-200 py-6">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-start space-x-3">
            <div className="text-blue-500 text-xl">💡</div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Real-time Integration Capabilities
              </h3>
              <p className="text-blue-800 mb-3">
                These forms support hybrid data sources - you can use manual form data or enable real-time integration with external systems:
              </p>
              <ul className="text-blue-700 space-y-1">
                <li>• <strong>Jira Integration:</strong> Automatic defect tracking, sprint data, and story progress</li>
                <li>• <strong>BrowserStack Integration:</strong> Live test execution results and browser coverage</li>
                <li>• <strong>Bitbucket Integration:</strong> Build status, commit metrics, and deployment frequency</li>
                <li>• <strong>Custom APIs:</strong> Performance monitoring, security scans, and infrastructure metrics</li>
                <li>• <strong>Hybrid Mode:</strong> Some fields from external sources, others from manual forms</li>
              </ul>
              <p className="text-blue-600 text-sm mt-3">
                Use the real-time toggle in the bottom-right corner to switch between form data and live external data sources.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
