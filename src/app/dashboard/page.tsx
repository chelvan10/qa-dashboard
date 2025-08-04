'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TabNavigation, ViewModeToggle } from '@/components/ui/SharedComponents';
import SummaryDashboard from '@/components/dashboard/SummaryDashboard';
import QECapabilityDashboard from '@/components/dashboard/QECapabilityDashboard';
import NonProdEnvironmentsDashboard from '@/components/dashboard/NonProdEnvironmentsDashboard';
import FunctionalTestingDashboard from '@/components/dashboard/FunctionalTestingDashboard';
import TestAutomationDashboard from '@/components/dashboard/TestAutomationDashboard';
import PerformanceTestingDashboard from '@/components/dashboard/PerformanceTestingDashboard';
import SecurityTestingDashboard from '@/components/dashboard/SecurityTestingDashboard';
import { mockQEData, roleAccess } from '@/lib/mockData';
import { UserRole, TabName, ViewMode } from '@/types/dashboard';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<UserRole>('manager');
  const [activeTab, setActiveTab] = useState<TabName>('summary');
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [demoSession, setDemoSession] = useState<{email: string, role: UserRole} | null>(null);

  useEffect(() => {
    // Check for demo session fallback
    const storedDemoUser = sessionStorage.getItem('demoUser');
    const authFallback = sessionStorage.getItem('authFallback');
    
    if (storedDemoUser && authFallback) {
      const demoUser = JSON.parse(storedDemoUser);
      setDemoSession(demoUser);
      setActiveRole(demoUser.role as UserRole);
      console.log('🎯 Using demo session fallback:', demoUser);
      return;
    }
    
    if (status === 'unauthenticated' && !storedDemoUser) {
      router.push('/demo');
    }
  }, [status, router]);

  // Update active role based on authentication method
  useEffect(() => {
    const sessionWithRole = session as typeof session & { user?: { role?: string } };
    if (sessionWithRole?.user?.role) {
      setActiveRole(sessionWithRole.user.role as UserRole);
    } else if (demoSession?.role) {
      setActiveRole(demoSession.role);
    }
  }, [session, demoSession]);

  // Update active tab when role changes to ensure user only sees allowed tabs
  useEffect(() => {
    const allowedTabs = roleAccess[activeRole].tabs as TabName[];
    if (!allowedTabs.includes(activeTab)) {
      setActiveTab(allowedTabs[0]);
    }
  }, [activeRole, activeTab]);

  if (status === 'loading' && !demoSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated (either via session or demo)
  const isAuthenticated = session || demoSession;
  const sessionWithRole = session as typeof session & { user?: { role?: string } };
  const userRole = sessionWithRole?.user?.role || demoSession?.role || activeRole; // Used for role determination
  const userEmail = session?.user?.email || demoSession?.email || 'Demo User'; // Used for display

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to authentication...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    if (demoSession) {
      // Clear demo session
      sessionStorage.removeItem('demoUser');
      sessionStorage.removeItem('authFallback');
      setDemoSession(null);
      router.push('/');
    } else {
      signOut({ callbackUrl: '/' });
    }
  };

  // Get tabs available for current role
  const availableTabs = roleAccess[activeRole].tabs.map(tabId => {
    const tabConfig = {
      summary: { name: 'Summary', icon: '📊' },
      qeCapability: { name: 'QE Capability', icon: '🎯' },
      nonProdEnvironments: { name: 'Non-Prod Environments', icon: '🌐' },
      functionalTesting: { name: 'Functional Testing', icon: '✅' },
      testAutomation: { name: 'Test Automation', icon: '🤖' },
      performanceTesting: { name: 'Performance Testing', icon: '⚡' },
      securityTesting: { name: 'Security Testing', icon: '🛡️' }
    };
    
    return {
      id: tabId,
      name: tabConfig[tabId as TabName]?.name || tabId,
      icon: <span>{tabConfig[tabId as TabName]?.icon}</span>
    };
  });

  // Render dashboard content based on active tab
  const renderDashboardContent = () => {
    if (viewMode === 'form') {
      return (
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Data Entry Form - {availableTabs.find(tab => tab.id === activeTab)?.name}
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-800">
              📝 Data entry form for {activeTab} is coming soon. This will allow authorized users to update metrics and data for this section.
            </p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'summary':
        return <SummaryDashboard data={mockQEData} />;
      case 'qeCapability':
        return <QECapabilityDashboard data={mockQEData} />;
      case 'nonProdEnvironments':
        return <NonProdEnvironmentsDashboard data={mockQEData} />;
      case 'functionalTesting':
        return <FunctionalTestingDashboard data={mockQEData} />;
      case 'testAutomation':
        return <TestAutomationDashboard data={mockQEData} />;
      case 'performanceTesting':
        return <PerformanceTestingDashboard data={mockQEData} />;
      case 'securityTesting':
        return <SecurityTestingDashboard data={mockQEData} />;
      default:
        return <SummaryDashboard data={mockQEData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">QE Dashboard</h1>
              <div className="flex space-x-2">
                {(['executive', 'manager', 'team'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => setActiveRole(role)}
                    className={`px-3 py-1 rounded-md text-sm font-medium capitalize ${
                      activeRole === role
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ViewModeToggle 
                currentMode={viewMode} 
                onModeChange={setViewMode}
              />
              <span className="text-sm text-gray-700">Welcome, {session?.user?.name || demoSession?.email?.split('@')[0] || 'User'}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Role Info Banner */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-blue-900">
                Role: {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}
              </span>
              <span className="text-sm text-blue-700">•</span>
              <span className="text-sm text-blue-700">{roleAccess[activeRole].focus}</span>
            </div>
            <div className="text-sm text-blue-700">
              {availableTabs.length} dashboard{availableTabs.length !== 1 ? 's' : ''} available
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TabNavigation 
            tabs={availableTabs}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as TabName)}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {renderDashboardContent()}
        </div>
      </main>
    </div>
  );
}
