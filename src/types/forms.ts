// Data Forms Type Definitions
export interface BaseFormData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
}

// Summary Dashboard Form Data
export interface SummaryFormData extends BaseFormData {
  // Executive KPIs
  overallQualityScore: number; // 0-100
  defectEscapeRate: number; // percentage
  testCoverage: number; // percentage
  releaseVelocity: number; // releases per month
  customerSatisfactionScore: number; // 0-100
  
  // Strategic Metrics
  qualityGateComplianceRate: number; // percentage
  automationROI: number; // percentage
  meanTimeToDetection: number; // hours
  meanTimeToResolution: number; // hours
  regressionTestEfficiency: number; // percentage
  
  // Business Impact
  productionIncidents: number;
  qualityDebtScore: number; // 0-100
  teamProductivityIndex: number; // 0-100
  
  // Summary Dashboard Specific Fields
  recentAchievements: string; // text area for recent achievements
  keyFocus: string; // text area for key focus areas
}

// QE Capability Form Data
export interface QECapabilityFormData extends BaseFormData {
  // Maturity Assessment
  processMaturity: number; // 1-5 scale
  toolsAndAutomation: number; // 1-5 scale
  skillsAndCompetency: number; // 1-5 scale
  metricsAndReporting: number; // 1-5 scale
  continuousImprovement: number; // 1-5 scale
  
  // Organization Metrics
  qeTeamSize: number;
  testAutomationEngineers: number;
  performanceTestEngineers: number;
  securityTestEngineers: number;
  
  // Capability Scores
  functionalTestingCapability: number; // 0-100
  automationCapability: number; // 0-100
  performanceTestingCapability: number; // 0-100
  securityTestingCapability: number; // 0-100
  devOpsIntegrationCapability: number; // 0-100
}

// Non-Prod Environments Form Data
export interface EnvironmentData {
  name: string;
  type: 'dev' | 'test' | 'staging' | 'uat' | 'pre-prod';
  status: 'healthy' | 'warning' | 'critical' | 'maintenance';
  uptime: number; // percentage
  responseTime: number; // milliseconds
  deploymentFrequency: number; // per week
  lastDeployment: Date;
  healthScore: number; // 0-100
  
  // Infrastructure Metrics
  cpuUtilization: number; // percentage
  memoryUtilization: number; // percentage
  diskUtilization: number; // percentage
  networkLatency: number; // milliseconds
  
  // Quality Metrics
  testPassRate: number; // percentage
  defectDensity: number; // defects per kloc
  smokeTestResults: 'pass' | 'fail' | 'pending';
}

export interface NonProdEnvironmentsFormData extends BaseFormData {
  environments: EnvironmentData[];
}

// Functional Testing Form Data
export interface ApplicationTestData {
  id: string;
  name: string;
  testsPassed: number;
  testsFailed: number;
  testsTotal: number;
  passRate: number;
  avgExecutionTime: number;
  lastRun: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'stable' | 'unstable' | 'maintenance' | 'deprecated';
}

export interface SquadPerformanceData {
  id: string;
  name: string;
  passRate: number;
  velocity: number;
  blockers: number;
  testsExecuted: number;
  defectsFound: number;
}

export interface DefectTrendData {
  totalDefects: number;
  criticalDefects: number;
  highDefects: number;
  mediumDefects: number;
  lowDefects: number;
  resolvedDefects: number;
  openDefects: number;
  avgResolutionTime: number;
  defectsByCategory: {
    ui: number;
    functionality: number;
    performance: number;
    security: number;
    integration: number;
  };
}

export interface TestCoverageData {
  unitTests: number;
  integrationTests: number;
  e2eTests: number;
  apiTests: number;
  uiTests: number;
  regressionTests: number;
  smokeTests: number;
  overallCoverage: number;
  codebaseCoverage: {
    frontend: number;
    backend: number;
    mobile: number;
    shared: number;
  };
}

export interface ExecutionMetricsData {
  totalTestsExecuted: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  avgExecutionTime: number;
  parallelExecutionEfficiency: number;
  testEnvironmentUptime: number;
  flakinessFactor: number;
}

export interface QualityMetricsData {
  testCaseEffectiveness: number;
  bugDetectionRate: number;
  falsePositiveRate: number;
  testMaintenanceEffort: number;
  testDataQuality: number;
  environmentStability: number;
}

export interface FunctionalTestingFormData extends BaseFormData {
  applications: ApplicationTestData[];
  squads: SquadPerformanceData[];
  defectTrends: DefectTrendData;
  testCoverage: TestCoverageData;
  executionMetrics: ExecutionMetricsData;
  qualityMetrics: QualityMetricsData;
}

// Test Automation Form Data
export interface AutomationFrameworkData {
  name: string;
  technology: string; // Selenium, Cypress, Playwright, etc.
  testCount: number;
  successRate: number; // percentage
  avgExecutionTime: number; // minutes
  maintenanceEffort: number; // hours per week
}

export interface TestAutomationFormData extends BaseFormData {
  // Coverage Metrics
  uiAutomationCoverage: number; // percentage
  apiAutomationCoverage: number; // percentage
  unitTestCoverage: number; // percentage
  integrationTestCoverage: number; // percentage
  e2eTestCoverage: number; // percentage
  
  // Framework Performance
  totalAutomatedTests: number;
  flakyTests: number;
  flakyTestRate: number; // percentage
  averageExecutionTime: number; // minutes
  parallelExecutionCapability: boolean;
  
  // ROI Metrics
  manualTestingTimeSaved: number; // hours per week
  costSavingsPerMonth: number; // currency
  automationMaintenance: number; // hours per week
  netROI: number; // percentage
  
  // Framework Details
  frameworks: AutomationFrameworkData[];
}

// Performance Testing Form Data
export interface ApiPerformanceData {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  averageResponseTime: number; // milliseconds
  throughput: number; // requests per second
  errorRate: number; // percentage
  slaTarget: number; // milliseconds
  slaCompliance: number; // percentage
}

export interface PerformanceScenarioData {
  name: string;
  type: 'load' | 'stress' | 'spike' | 'volume' | 'endurance';
  status: 'pass' | 'fail' | 'warning';
  users: number;
  duration: number; // minutes
  lastExecuted: Date;
  healthScore: number; // 0-100
}

export interface SLATargetData {
  metric: string;
  target: number;
  actual: number;
  compliance: number; // percentage
  trend: 'improving' | 'stable' | 'degrading';
}

export interface PerformanceTestingFormData extends BaseFormData {
  // Response Time Metrics
  apiEndpoints: ApiPerformanceData[];
  
  // System Performance
  peakConcurrentUsers: number;
  averageResponseTime: number; // milliseconds
  p95ResponseTime: number; // milliseconds
  p99ResponseTime: number; // milliseconds
  
  // Resource Utilization
  cpuUtilization: number; // percentage under load
  memoryUtilization: number; // percentage under load
  networkThroughput: number; // mbps
  diskIOPS: number;
  
  // Performance Test Scenarios
  scenarios: PerformanceScenarioData[];
  
  // SLA Metrics
  slaTargets: SLATargetData[];
}

// Security Testing Form Data
export interface SecurityToolData {
  name: string;
  type: 'SAST' | 'DAST' | 'IAST' | 'SCA' | 'Container' | 'Infrastructure';
  coverage: number; // percentage
  accuracy: number; // percentage
  falsePositiveRate: number; // percentage
  scanFrequency: 'daily' | 'weekly' | 'per-release' | 'monthly';
  lastScan: Date;
}

export interface SecurityPostureData {
  overallScore: number; // 0-100
  dataProtection: number; // 0-100
  accessControl: number; // 0-100
  networkSecurity: number; // 0-100
  applicationSecurity: number; // 0-100
  incidentResponse: number; // 0-100
}

export interface ComplianceData {
  standard: string; // SOC2, ISO27001, PCI-DSS, etc.
  status: 'compliant' | 'partial' | 'non-compliant';
  score: number; // 0-100
  lastAudit: Date;
  nextAudit: Date;
}

export interface SecurityTestingFormData extends BaseFormData {
  // Vulnerability Distribution
  criticalVulnerabilities: number;
  highVulnerabilities: number;
  mediumVulnerabilities: number;
  lowVulnerabilities: number;
  
  // Trends
  vulnerabilitiesFound: number[];
  vulnerabilitiesResolved: number[];
  weeks: string[];
  
  // Security Tools Performance
  tools: SecurityToolData[];
  
  // Security Posture
  securityPosture: SecurityPostureData;
  
  // Compliance
  complianceMetrics: ComplianceData[];
}

// Real-time Integration Configuration
export interface RealTimeConfig {
  enabled: boolean;
  dataSources: DataSourceConfig[];
}

export interface DataSourceConfig {
  name: string;
  type: 'jira' | 'browserstack' | 'bitbucket' | 'confluence' | 'sonarqube' | 'jenkins' | 'custom';
  apiEndpoint: string;
  authMethod: 'token' | 'oauth' | 'basic' | 'apikey';
  refreshInterval: number; // minutes
  fields: FieldMapping[];
  enabled: boolean;
}

export interface FieldMapping {
  dashboardField: string;
  sourceField: string;
  transformation?: string; // optional data transformation function
  fallbackToForm: boolean; // if true, use form data when API fails
}

// Form submission and management
export interface FormSubmission<T = AllFormData> {
  formType: 'summary' | 'qe-capability' | 'non-prod-environments' | 'functional-testing' | 'test-automation' | 'performance-testing' | 'security-testing';
  data: T;
  submittedAt: Date;
  submittedBy: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  reviewNotes?: string;
}

// Union type for all form data
export type AllFormData = 
  | SummaryFormData 
  | QECapabilityFormData 
  | NonProdEnvironmentsFormData 
  | FunctionalTestingFormData 
  | TestAutomationFormData 
  | PerformanceTestingFormData 
  | SecurityTestingFormData;