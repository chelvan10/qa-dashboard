import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

function GaugeChart({ value, label, color }: { value: number; label: string; color: string }) {
  const data = {
    labels: [label, "Remaining"],
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: [color, "#e5e7eb"],
        borderWidth: 0,
      },
    ],
  };
  const options = {
    cutout: "80%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };
  return (
    <div className="flex flex-col items-center">
      <div className="w-32 h-32">
        <Doughnut data={data} options={options} />
      </div>
      <div className="text-xl font-bold mt-2" style={{ color }}>{value}%</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function TrendChart() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Regression Automation Coverage",
        data: [88, 90, 91, 92, 92, 93],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.2)",
      },
      {
        label: "Defect Leakage Rate",
        data: [2.1, 1.8, 1.5, 1.3, 1.2, 1.1],
        borderColor: "#dc2626",
        backgroundColor: "rgba(220,38,38,0.2)",
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Executive KPI Trends" },
    },
  };
  return <Line data={data} options={options} />;
}

function TestExecutionChart() {
  const data = {
    labels: ["Squad A", "Squad B", "Squad C", "Squad D", "Squad E"],
    datasets: [
      {
        label: "Passed",
        data: [45, 38, 52, 41, 48],
        backgroundColor: "#16a34a",
      },
      {
        label: "Failed",
        data: [5, 8, 3, 7, 4],
        backgroundColor: "#dc2626",
      },
      {
        label: "In Maintenance",
        data: [3, 4, 2, 5, 3],
        backgroundColor: "#f59e0b",
      },
      {
        label: "Backlog",
        data: [12, 15, 8, 10, 14],
        backgroundColor: "#6b7280",
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Test Execution Status by Squad" },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };
  return <Bar data={data} options={options} />;
}

function DefectTrendChart() {
  const data = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [
      {
        label: "New Defects",
        data: [18, 22, 15, 19, 12, 16],
        borderColor: "#dc2626",
        backgroundColor: "rgba(220,38,38,0.2)",
      },
      {
        label: "Closed Defects",
        data: [15, 20, 17, 21, 15, 18],
        borderColor: "#16a34a",
        backgroundColor: "rgba(22,163,74,0.2)",
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Defect Trend (New vs Closed)" },
    },
  };
  return <Line data={data} options={options} />;
}

function FlakyTestsTable() {
  const flakyTests = [
    { test: "LoginTest.shouldAuthenticateUser", failureRate: "15%", owner: "Squad A", lastFailed: "2 days ago" },
    { test: "PaymentTest.processTransaction", failureRate: "12%", owner: "Squad B", lastFailed: "1 day ago" },
    { test: "SearchTest.filterResults", failureRate: "8%", owner: "Squad C", lastFailed: "3 hours ago" },
    { test: "ProfileTest.updateUserInfo", failureRate: "7%", owner: "Squad A", lastFailed: "1 day ago" },
    { test: "CartTest.addRemoveItems", failureRate: "6%", owner: "Squad D", lastFailed: "4 hours ago" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Test Name</th>
            <th className="px-4 py-2 text-left">Failure Rate</th>
            <th className="px-4 py-2 text-left">Owner</th>
            <th className="px-4 py-2 text-left">Last Failed</th>
          </tr>
        </thead>
        <tbody>
          {flakyTests.map((test, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2 font-mono text-sm">{test.test}</td>
              <td className="px-4 py-2 font-bold text-red-600">{test.failureRate}</td>
              <td className="px-4 py-2">{test.owner}</td>
              <td className="px-4 py-2 text-gray-500">{test.lastFailed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RealTimeTestTable() {
  const [tests, setTests] = useState([
    { name: "UserRegistrationTest", status: "running", duration: "2m 15s", result: "pending" },
    { name: "LoginValidationTest", status: "passed", duration: "1m 32s", result: "passed" },
    { name: "PaymentProcessingTest", status: "failed", duration: "3m 45s", result: "failed" },
    { name: "ProfileUpdateTest", status: "passed", duration: "1m 18s", result: "passed" },
    { name: "SearchFunctionalityTest", status: "running", duration: "1m 05s", result: "pending" },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTests(prevTests => 
        prevTests.map(test => {
          if (test.status === "running") {
            // Simulate test completion randomly
            if (Math.random() > 0.7) {
              return {
                ...test,
                status: Math.random() > 0.8 ? "failed" : "passed",
                result: Math.random() > 0.8 ? "failed" : "passed"
              };
            }
          }
          return test;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed": return "text-green-600";
      case "failed": return "text-red-600";
      case "running": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed": return "✓";
      case "failed": return "✗";
      case "running": return "⟳";
      default: return "•";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Test Name</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Duration</th>
            <th className="px-4 py-2 text-left">Result</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2 font-mono text-sm">{test.name}</td>
              <td className={`px-4 py-2 font-bold ${getStatusColor(test.status)}`}>
                {getStatusIcon(test.status)} {test.status}
              </td>
              <td className="px-4 py-2">{test.duration}</td>
              <td className={`px-4 py-2 font-bold ${getStatusColor(test.result)}`}>
                {test.result === "pending" ? "..." : getStatusIcon(test.result)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-sm text-gray-500">
        ⟳ Live updates every 3 seconds
      </div>
    </div>
  );
}
function ExecutiveDashboard() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Executive KPIs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded shadow p-4 flex flex-col items-center">
          <GaugeChart value={98.8} label="Defect Leakage Rate" color="#dc2626" />
        </div>
        <div className="bg-white rounded shadow p-4 flex flex-col items-center">
          <GaugeChart value={92} label="Automation Coverage" color="#2563eb" />
        </div>
        <div className="bg-white rounded shadow p-4 flex flex-col items-center">
          <GaugeChart value={85} label="Test Coverage" color="#16a34a" />
        </div>
        <div className="bg-white rounded shadow p-4 flex flex-col items-center">
          <div className="text-lg font-semibold mb-2">Weekly Deployment Frequency</div>
          <div className="text-3xl font-bold text-purple-600">36h</div>
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2">Trend Analysis</h3>
      <div className="bg-white rounded shadow p-4">
        <TrendChart />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded shadow p-4">
          <div className="text-lg font-semibold mb-2">Mean Time to Recovery (MTTR)</div>
          <div className="text-3xl font-bold text-orange-600">2.5h</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-lg font-semibold mb-2">Automation ROI (Cost Saved)</div>
          <div className="text-3xl font-bold text-green-600">$120,000</div>
        </div>
      </div>
    </div>
  );
}
function ManagerDashboard() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Manager Dashboard - Operational View</h2>
      
      {/* Test Execution Status by Squad/Application */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Test Execution Status by Squad</h3>
        <div className="bg-white rounded shadow p-4">
          <TestExecutionChart />
        </div>
      </div>

      {/* Key Manager Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded shadow p-4">
          <div className="text-lg font-semibold">Team Test Coverage</div>
          <div className="text-3xl font-bold text-green-600">78%</div>
          <div className="text-sm text-gray-500">↑ 5% from last week</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-lg font-semibold">Environment Health</div>
          <div className="text-3xl font-bold text-blue-600">99.5%</div>
          <div className="text-sm text-gray-500">Uptime SLA</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-lg font-semibold">Flaky Test Rate</div>
          <div className="text-3xl font-bold text-orange-600">2.1%</div>
          <div className="text-sm text-gray-500">↓ 0.5% improvement</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-lg font-semibold">Defects (New vs Closed)</div>
          <div className="text-3xl font-bold text-purple-600">12/15</div>
          <div className="text-sm text-gray-500">This week</div>
        </div>
      </div>

      {/* Defect Trend Chart */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Defect Trend (New vs Closed)</h3>
        <div className="bg-white rounded shadow p-4">
          <DefectTrendChart />
        </div>
      </div>

      {/* Top Flaky Tests Table */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Top Flaky Tests</h3>
        <div className="bg-white rounded shadow p-4">
          <FlakyTestsTable />
        </div>
      </div>
    </div>
  );
}
function TeamDashboard() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Team Dashboard - Actionable View</h2>
      
      {/* CI/CD Pipeline Health */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">CI/CD Pipeline Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded shadow p-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <div className="w-6 h-6 text-green-600">✓</div>
            </div>
            <div>
              <div className="text-lg font-semibold">Build Status</div>
              <div className="text-2xl font-bold text-green-600">Passing</div>
            </div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-lg font-semibold">Build Success Rate</div>
            <div className="text-3xl font-bold text-blue-600">96%</div>
            <div className="text-sm text-gray-500">Last 30 builds</div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-lg font-semibold">Time to Test Readiness</div>
            <div className="text-3xl font-bold text-purple-600">12h</div>
            <div className="text-sm text-gray-500">Avg commit to test</div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-lg font-semibold">Automation Pass Rate</div>
            <div className="text-3xl font-bold text-green-600">97%</div>
            <div className="text-sm text-gray-500">Current sprint</div>
          </div>
        </div>
      </div>

      {/* Personal Metrics */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">My Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded shadow p-4">
            <div className="text-lg font-semibold">Defects Found vs Resolved</div>
            <div className="text-3xl font-bold text-blue-600">8/6</div>
            <div className="text-sm text-gray-500">This sprint</div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-lg font-semibold">Sprint Progress</div>
            <div className="text-3xl font-bold text-purple-600">85%</div>
            <div className="text-sm text-gray-500">Test cases completed</div>
          </div>
        </div>
      </div>

      {/* Real-time Test Execution */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Test Case Execution Status (Real-time)</h3>
        <div className="bg-white rounded shadow p-4">
          <RealTimeTestTable />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [role, setRole] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<string>("executive");

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session && session.user) {
        const userRole = (session.user as typeof session.user & { role?: string }).role ?? "team";
        setRole(userRole);
        // Set default view based on role
        if (userRole === "admin" || userRole === "executive") {
          setCurrentView("executive");
        } else if (userRole === "manager") {
          setCurrentView("manager");
        } else {
          setCurrentView("team");
        }
      } else {
        setRole(null);
      }
    })();
  }, []);

  if (!role) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const renderDashboard = () => {
    switch (currentView) {
      case "executive": return <ExecutiveDashboard />;
      case "manager": return <ManagerDashboard />;
      case "team": return <TeamDashboard />;
      default: return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">QE Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView("executive")}
                className={`px-3 py-2 rounded ${currentView === "executive" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"}`}
              >
                Executive
              </button>
              <button
                onClick={() => setCurrentView("manager")}
                className={`px-3 py-2 rounded ${currentView === "manager" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"}`}
              >
                Manager
              </button>
              <button
                onClick={() => setCurrentView("team")}
                className={`px-3 py-2 rounded ${currentView === "team" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"}`}
              >
                Team
              </button>
              <div className="text-sm text-gray-500">Role: {role}</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      {renderDashboard()}
    </div>
  );
}
