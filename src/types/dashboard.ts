// Enhanced QE Dashboard Data Types
export interface QEDashboardData {
  summary: {
    keynoteBanner: {
      title: string;
      mission: string;
    };
    criticalMetrics: {
      regressionAutomation: number;
      defectLeakageRate: number;
      environmentsAvailable: number;
      vulnerabilities: number;
    };
  };
  qeCapability: {
    kpis: {
      regressionAutomation: number;
      defectLeakage: number;
      testCoverage: number;
      automationROI: number;
    };
    maturityRadar: {
      testStrategy: number;
      automation: number;
      cicd: number;
      performance: number;
      security: number;
      monitoring: number;
    };
    cicdInsights: {
      pipelineSuccess: number;
      deploymentFrequency: number;
      leadTime: number;
      mttr: number;
    };
    roadmap: Array<{
      quarter: string;
      initiative: string;
      status: 'planned' | 'in-progress' | 'completed';
      priority: 'high' | 'medium' | 'low';
      description: string;
    }>;
    transitionJourney: string;
  };
  nonProdEnvironments: {
    applications: Array<{
      name: string;
      dev: 'available' | 'unavailable' | 'maintenance';
      sit: 'available' | 'unavailable' | 'maintenance';
      preprod: 'available' | 'unavailable' | 'maintenance';
      dataRefreshCycle: string;
      availability: number;
    }>;
    summary: {
      totalApps: number;
      availableEnvironments: number;
      averageUptime: number;
    };
  };
  functionalTesting: {
    squads: Array<{
      name: string;
      passed: number;
      failed: number;
      inMaintenance: number;
      inDesign: number;
      backlog: number;
    }>;
    defectTrends: Array<{
      month: string;
      newDefects: number;
      closedDefects: number;
    }>;
    testCoverage: {
      ui: number;
      api: number;
      database: number;
    };
  };
  testAutomation: {
    coverageGrowth: Array<{
      month: string;
      coverage: number;
    }>;
    flakyTests: Array<{
      testName: string;
      failureRate: number;
      squad: string;
      lastFailed: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    executionTimes: Array<{
      suite: string;
      timeMinutes: number;
    }>;
    roi: {
      manualHoursSaved: number;
      costSavings: number;
      maintenanceCost: number;
    };
  };
  performanceTesting: {
    responseTime: Array<{
      timestamp: string;
      avgResponseTime: number;
    }>;
    throughput: Array<{
      endpoint: string;
      requestsPerSecond: number;
    }>;
    resourceUtilization: {
      cpu: number;
      memory: number;
      network: number;
    };
  };
  securityTesting: {
    vulnerabilities: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    trends: Array<{
      month: string;
      found: number;
      resolved: number;
    }>;
    sastFindings: {
      totalScans: number;
      passedScans: number;
      issuesFound: number;
    };
  };
}

export interface RoleAccess {
  executive: {
    tabs: string[];
    permissions: string[];
    focus: string;
  };
  manager: {
    tabs: string[];
    permissions: string[];
    focus: string;
  };
  team: {
    tabs: string[];
    permissions: string[];
    focus: string;
  };
}

export type UserRole = 'executive' | 'manager' | 'team';
export type TabName = 'summary' | 'qeCapability' | 'nonProdEnvironments' | 'functionalTesting' | 'testAutomation' | 'performanceTesting' | 'securityTesting';
export type ViewMode = 'dashboard' | 'form';
