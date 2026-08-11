import {
  Server,
  FolderKanban,
  Globe,
  ArrowRight,
  Workflow,
  Activity,
  CheckCircle2,
  XCircle,
  Timer
} from "lucide-react";
import { useEffect, useState } from "react";
import { getMockEndpoints } from "../../services/mockEndpointService";
import { getCollections } from "../../services/collectionService";
import { getEnvironments } from "../../services/environmentService";
import { getMockScenarios } from "../../services/mockScenarioService";
import { getRequestHistory } from "../../services/requestHistoryService";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Dashboard() {

  const [endpointCount, setEndpointCount] = useState(0);
  const [recentEndpoints, setRecentEndpoints] = useState([]);
  const [collectionCount, setCollectionCount] = useState(0);
  const [environmentCount, setEnvironmentCount] = useState(0);
  const [activeEnvironment, setActiveEnvironment] = useState(null);
  const [scenarioCount, setScenarioCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [averageResponseTime, setAverageResponseTime] = useState(0);
  const [recentRequests, setRecentRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();

    const handleEnvironmentChanged = () => {
      loadDashboard();
    };

    window.addEventListener(
      "environmentChanged",
      handleEnvironmentChanged
    );

    return () => {
      window.removeEventListener(
        "environmentChanged",
        handleEnvironmentChanged
      );
    };
  }, []);

  const loadDashboard = async () => {
    try {
      const endpoints = await getMockEndpoints();
      const collections = await getCollections();
      const environments = await getEnvironments();
      const scenarios = await getMockScenarios();
      const requests = await getRequestHistory();

      setEndpointCount(endpoints.length);
      setCollectionCount(collections.length);
      setEnvironmentCount(environments.length);
      setScenarioCount(scenarios.length);
      setRequestCount(requests.length);
      setSuccessCount(
        requests.filter(r => r.statusCode < 400).length
      );
      setFailedCount(
        requests.filter(r => r.statusCode >= 400).length
      );
      setAverageResponseTime(
        requests.length ? Math.round(requests.reduce((sum, r) => sum + r.responseTimeMs, 0) / requests.length): 0
      );
      setRecentEndpoints(endpoints.reverse().slice(0, 7));
      setRecentRequests(requests.slice(0,5));
      setActiveEnvironment(environments.find((e) => e.isActive));
    } catch (error) {
      console.error("Failed to load dashboard", error);
    }
  };

  const stats = [
    {
      title: "Endpoints",
      value: endpointCount,
      icon: Server,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Collections",
      value: collectionCount,
      icon: FolderKanban,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Environments",
      value: environmentCount,
      icon: Globe,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Scenarios",
      value: scenarioCount,
      icon: Workflow,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Requests",
      value: requestCount,
      icon: Activity,
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      title: "Success",
      value: successCount,
      icon: CheckCircle2,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Failures",
      value: failedCount,
      icon: XCircle,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Avg Time",
      value: `${averageResponseTime} ms`,
      icon: Timer,
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (

    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between bg-slate-100 p-8 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500">
            Monitor and manage your mock APIs from a centralized dashboard.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Card className="p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" key={item.title}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500">
                    {item.title}
                  </p>
                  <h2 className="mt-2 text-3xl font-bold">
                    {item.value}
                  </h2>
                </div>
                <div className={`rounded-xl p-3 ${item.color}`}>
                  <Icon size={28}/>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Bottom Section 1*/}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 items-stretch">
        {/* Recent Endpoints */}
        <div>
          <Card className="h-[600px] flex flex-col">

            <div className="mb-5">
              <h2 className="text-xl font-semibold">
                Recent Endpoints
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest endpoints created in your workspace.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {recentEndpoints.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No endpoints available.
                </p>
              ) : (
                recentEndpoints.map((endpoint) => (
                  <Link
                    key={endpoint.id}
                    to={`/builder?expand=${endpoint.id}`}
                    className="block"
                  >
                    <div
                      className="
                        flex items-center justify-between
                        rounded-xl
                        border border-slate-200
                        p-4
                        transition-all
                        hover:border-blue-300
                        hover:bg-slate-50
                        hover:shadow-sm
                      "
                    >
                      <div className="flex items-center gap-4">

                        <Badge variant={endpoint.method.toLowerCase()}>
                          {endpoint.method}
                        </Badge>

                        <span className="font-medium text-slate-800">
                          {endpoint.path}
                        </span>

                      </div>

                      <ArrowRight
                        size={18}
                        className="text-slate-400"
                      />
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="mt-6 border-t pt-4">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => navigate("/builder")}
              >
                View All Endpoints
              </Button>
            </div>

          </Card>
        </div>

        {/* Recent Requests */}
        <div>
          <Card className="h-[600px] flex flex-col">

            <div className="mb-5">
              <h2 className="text-xl font-semibold">
                Recent Requests
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest mock API executions.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">

              {recentRequests.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No requests have been executed yet.
                </p>
              ) : (
                recentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="
                      flex items-center justify-between
                      rounded-xl
                      border border-slate-200
                      p-4
                      transition-all
                      hover:border-blue-300
                      hover:bg-slate-50
                      hover:shadow-sm
                    "
                  >
                    <div className="flex items-center gap-4">

                      <Badge variant={request.method.toLowerCase()}>
                        {request.method}
                      </Badge>

                      <div>

                        <p className="font-medium text-slate-800">
                          {request.path}
                        </p>

                        <p className="text-sm text-slate-500">
                          {new Date(request.requestTime).toLocaleString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center gap-3">

                      <Badge
                        variant={
                          request.statusCode >= 400
                            ? "error"
                            : "success"
                        }
                      >
                        {request.statusCode}
                      </Badge>

                      <Badge variant="info">
                        {request.responseTimeMs} ms
                      </Badge>

                    </div>
                  </div>
                ))
              )}

            </div>

            <div className="mt-6 border-t pt-4">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => navigate("/history")}
              >
                View Full Request History
              </Button>
            </div>

          </Card>
        </div>
      </div>

      {/* Bottom Section 2*/}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div>
          <Card>
            <h2 className="mb-6 text-xl font-semibold">Quick Actions</h2>
            <div className="grid gap-4">
              <Button variant="primary" onClick={() => navigate("/builder")}>
                Create Endpoint
              </Button>
              <Button variant="secondary" onClick={() => navigate("/collections")}>
                Create Collection
              </Button>
              <Button variant="secondary" onClick={() => navigate("/environment")}>
                Create Environment
              </Button>
              <Button variant="secondary" onClick={() => navigate("/history")}>
                View Request History
              </Button>
            </div>
          </Card>
        </div>
        <div>
          <Card>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">
                Active Environment
              </h2>
              {activeEnvironment && (
                <Badge variant="active">
                  Active
                </Badge>
              )}
            </div>
            {activeEnvironment ? (
              <div className="space-y-5">
                <div>
                  <p className="text-sm text-slate-500">
                    Environment
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-slate-800">
                    {activeEnvironment.name}
                  </h3>
                </div>
                <div>
                  <p className="text-sm text-slate-500">
                    Base URL
                  </p>
                  <p className="mt-1 rounded-lg bg-slate-100 p-3 font-mono text-sm text-slate-700 break-all">
                    {activeEnvironment.baseUrl}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                    <p className="text-xs text-slate-500">
                      Status
                    </p>
                    <p className="mt-1 font-semibold text-green-700">
                      Active
                    </p>
                  </div>
                  <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
                    <p className="text-xs text-slate-500">
                      APIs Available
                    </p>
                    <p className="mt-1 font-semibold text-blue-700">
                      {endpointCount}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
                <p className="text-slate-500">
                  No active environment configured.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;