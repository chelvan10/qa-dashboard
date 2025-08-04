import { QEDashboardData, RoleAccess } from '@/types/dashboard';

// Mock data for QE Dashboard
export const mockQEData: QEDashboardData = {
  summary: {
    keynoteBanner: {
      title: "Quality Engineering Excellence Initiative",
      mission: "Transforming software delivery through comprehensive quality assurance, test automation, and continuous improvement"
    },
    criticalMetrics: {
      regressionAutomation: 78,
      defectLeakageRate: 2.1,
      environmentsAvailable: 85,
      vulnerabilities: 12
    }
  },
  qeCapability: {
    kpis: {
      regressionAutomation: 78,
      defectLeakage: 2.1,
      testCoverage: 85,
      automationROI: 340
    },
    maturityRadar: {
      testStrategy: 80,
      automation: 75,
      cicd: 90,
      performance: 70,
      security: 85,
      monitoring: 80
    },
    cicdInsights: {
      pipelineSuccess: 94,
      deploymentFrequency: 15,
      leadTime: 2.5,
      mttr: 4.2
    },
    roadmap: [
      {
        quarter: "Q1 2024",
        initiative: "API Test Automation Framework",
        status: "completed",
        priority: "high",
        description: "Implemented comprehensive API testing framework with 90% coverage"
      },
      {
        quarter: "Q2 2024",
        initiative: "Performance Testing Platform",
        status: "in-progress",
        priority: "high",
        description: "Building centralized performance testing platform for all applications"
      },
      {
        quarter: "Q3 2024",
        initiative: "AI-Powered Test Generation",
        status: "planned",
        priority: "medium",
        description: "Exploring AI tools for automated test case generation and maintenance"
      }
    ],
    transitionJourney: "From manual testing to automated quality gates with 78% regression automation achieved"
  },
  nonProdEnvironments: {
    applications: [
      {
        name: "Customer Portal",
        dev: "available",
        sit: "available",
        preprod: "maintenance",
        dataRefreshCycle: "Weekly",
        availability: 95
      },
      {
        name: "Payment Gateway",
        dev: "available",
        sit: "unavailable",
        preprod: "available",
        dataRefreshCycle: "Daily",
        availability: 88
      },
      {
        name: "Analytics Platform",
        dev: "available",
        sit: "available",
        preprod: "available",
        dataRefreshCycle: "Bi-weekly",
        availability: 97
      },
      {
        name: "Mobile API",
        dev: "maintenance",
        sit: "available",
        preprod: "available",
        dataRefreshCycle: "Daily",
        availability: 92
      }
    ],
    summary: {
      totalApps: 4,
      availableEnvironments: 9,
      averageUptime: 93
    }
  },
  functionalTesting: {
    squads: [
      {
        name: "Payments Squad",
        passed: 245,
        failed: 12,
        inMaintenance: 8,
        inDesign: 15,
        backlog: 23
      },
      {
        name: "Customer Experience Squad",
        passed: 189,
        failed: 7,
        inMaintenance: 12,
        inDesign: 9,
        backlog: 18
      },
      {
        name: "Platform Squad",
        passed: 156,
        failed: 5,
        inMaintenance: 6,
        inDesign: 11,
        backlog: 14
      }
    ],
    defectTrends: [
      { month: "Jan", newDefects: 45, closedDefects: 42 },
      { month: "Feb", newDefects: 38, closedDefects: 40 },
      { month: "Mar", newDefects: 41, closedDefects: 39 },
      { month: "Apr", newDefects: 33, closedDefects: 35 },
      { month: "May", newDefects: 29, closedDefects: 31 },
      { month: "Jun", newDefects: 25, closedDefects: 28 }
    ],
    testCoverage: {
      ui: 82,
      api: 94,
      database: 76
    }
  },
  testAutomation: {
    coverageGrowth: [
      { month: "Jan", coverage: 65 },
      { month: "Feb", coverage: 68 },
      { month: "Mar", coverage: 71 },
      { month: "Apr", coverage: 74 },
      { month: "May", coverage: 76 },
      { month: "Jun", coverage: 78 }
    ],
    flakyTests: [
      {
        testName: "Payment Processing E2E",
        failureRate: 15,
        squad: "Payments",
        lastFailed: "2024-06-15",
        priority: "high"
      },
      {
        testName: "User Registration Flow",
        failureRate: 8,
        squad: "Customer Experience",
        lastFailed: "2024-06-14",
        priority: "medium"
      },
      {
        testName: "API Authentication",
        failureRate: 12,
        squad: "Platform",
        lastFailed: "2024-06-13",
        priority: "high"
      }
    ],
    executionTimes: [
      { suite: "Smoke Tests", timeMinutes: 12 },
      { suite: "Regression Suite", timeMinutes: 45 },
      { suite: "API Tests", timeMinutes: 8 },
      { suite: "Integration Tests", timeMinutes: 23 }
    ],
    roi: {
      manualHoursSaved: 1200,
      costSavings: 85000,
      maintenanceCost: 15000
    }
  },
  performanceTesting: {
    responseTime: [
      { timestamp: "00:00", avgResponseTime: 245 },
      { timestamp: "04:00", avgResponseTime: 189 },
      { timestamp: "08:00", avgResponseTime: 312 },
      { timestamp: "12:00", avgResponseTime: 398 },
      { timestamp: "16:00", avgResponseTime: 445 },
      { timestamp: "20:00", avgResponseTime: 356 }
    ],
    throughput: [
      { endpoint: "/api/payments", requestsPerSecond: 150 },
      { endpoint: "/api/users", requestsPerSecond: 280 },
      { endpoint: "/api/orders", requestsPerSecond: 95 },
      { endpoint: "/api/notifications", requestsPerSecond: 420 }
    ],
    resourceUtilization: {
      cpu: 68,
      memory: 74,
      network: 45
    }
  },
  securityTesting: {
    vulnerabilities: {
      critical: 0,
      high: 2,
      medium: 8,
      low: 15
    },
    trends: [
      { month: "Jan", found: 32, resolved: 28 },
      { month: "Feb", found: 28, resolved: 30 },
      { month: "Mar", found: 25, resolved: 26 },
      { month: "Apr", found: 22, resolved: 24 },
      { month: "May", found: 18, resolved: 20 },
      { month: "Jun", found: 15, resolved: 17 }
    ],
    sastFindings: {
      totalScans: 156,
      passedScans: 142,
      issuesFound: 67
    }
  }
};

// Role-based access configuration
export const roleAccess: RoleAccess = {
  executive: {
    tabs: ['summary', 'qeCapability'],
    permissions: ['view-all', 'export-reports'],
    focus: 'Strategic oversight and high-level KPIs'
  },
  manager: {
    tabs: ['summary', 'qeCapability', 'nonProdEnvironments', 'functionalTesting', 'testAutomation'],
    permissions: ['view-all', 'edit-forms', 'manage-teams'],
    focus: 'Operational management and team coordination'
  },
  team: {
    tabs: ['functionalTesting', 'testAutomation', 'performanceTesting', 'securityTesting'],
    permissions: ['view-assigned', 'edit-forms', 'update-data'],
    focus: 'Hands-on testing execution and maintenance'
  }
};
