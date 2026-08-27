import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  Globe,
  Server,
  Timer,
  Workflow,
  XCircle,
} from "lucide-react";

import { getMockEndpoints } from "../../services/mockEndpointService";
import { getCollections } from "../../services/collectionService";
import { getEnvironments } from "../../services/environmentService";
import { getMockScenarios } from "../../services/mockScenarioService";
import { getRequestHistory } from "../../services/requestHistoryService";

import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

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

    const handleEnvironmentChanged = () => loadDashboard();

    window.addEventListener("environmentChanged", handleEnvironmentChanged);

    return () =>
      window.removeEventListener(
        "environmentChanged",
        handleEnvironmentChanged
      );
  }, []);

  const loadDashboard = async () => {
    try {
      const [
        endpoints,
        collections,
        environments,
        scenarios,
        requests,
      ] = await Promise.all([
        getMockEndpoints(),
        getCollections(),
        getEnvironments(),
        getMockScenarios(),
        getRequestHistory(),
      ]);

      setEndpointCount(endpoints.length);
      setCollectionCount(collections.length);
      setEnvironmentCount(environments.length);
      setScenarioCount(scenarios.length);
      setRequestCount(requests.length);

      setSuccessCount(
        requests.filter((request) => request.statusCode < 400).length
      );

      setFailedCount(
        requests.filter((request) => request.statusCode >= 400).length
      );

      setAverageResponseTime(
        requests.length
          ? Math.round(
              requests.reduce(
                (sum, request) => sum + request.responseTimeMs,
                0
              ) / requests.length
            )
          : 0
      );

      setRecentEndpoints([...endpoints].reverse().slice(0, 10));
      setRecentRequests(requests.slice(0, 10));
      setActiveEnvironment(
        environments.find((environment) => environment.isActive) || null
      );
    } catch (error) {
      console.error("Failed to load dashboard:", error);
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
    <div className="space-y-6 sm:space-y-8">
      <div className="rounded-2xl bg-slate-100 p-5 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500 sm:text-base">
          Monitor and manage your mock APIs from a centralized dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.title}</p>
                  <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                    {item.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${item.color}`}>
                  <Icon size={24} className="sm:h-7 sm:w-7" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        <Card className="flex h-[500px] flex-col sm:h-[600px]">
          <div className="mb-4">
            <h2 className="text-lg font-semibold sm:text-xl">
              Recent Endpoints
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Latest endpoints created in your workspace.
            </p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {recentEndpoints.length === 0 ? (
              <p className="text-sm text-slate-500">No endpoints available.</p>
            ) : (
              recentEndpoints.map((endpoint) => (
                <Link
                  key={endpoint.id}
                  to={`/builder?expand=${endpoint.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3 transition-all hover:border-blue-300 hover:bg-slate-50 sm:p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <Badge variant={endpoint.method.toLowerCase()}>
                        {endpoint.method}
                      </Badge>
                      <span className="truncate text-sm font-medium text-slate-800 sm:text-base">
                        {endpoint.path}
                      </span>
                    </div>
                    <ArrowRight
                      size={18}
                      className="ml-2 flex-shrink-0 text-slate-400"
                    />
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="mt-4 border-t pt-4">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate("/builder")}
            >
              View All Endpoints
            </Button>
          </div>
        </Card>

        <Card className="flex h-[500px] flex-col sm:h-[600px]">
          <div className="mb-4">
            <h2 className="text-lg font-semibold sm:text-xl">
              Recent Requests
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Latest mock API executions.
            </p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {recentRequests.length === 0 ? (
              <p className="text-sm text-slate-500">
                No requests have been executed yet.
              </p>
            ) : (
              recentRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3 transition-all hover:border-blue-300 hover:bg-slate-50 sm:flex-nowrap sm:p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Badge variant={request.method.toLowerCase()}>
                      {request.method}
                    </Badge>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {request.path}
                      </p>
                      <p className="text-xs text-slate-500">
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

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        request.statusCode >= 400 ? "error" : "success"
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

          <div className="mt-4 border-t pt-4">
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold sm:mb-6 sm:text-xl">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button variant="primary" onClick={() => navigate("/builder")}>
              Create Endpoint
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/collections")}
            >
              Create Collection
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/environment")}
            >
              Create Environment
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/history")}
            >
              View Request History
            </Button>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold sm:text-xl">
              Active Environment
            </h2>
            {activeEnvironment && <Badge variant="active">Active</Badge>}
          </div>

          {activeEnvironment ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500">Environment</p>
                <h3 className="mt-1 text-xl font-bold text-slate-800 sm:text-2xl">
                  {activeEnvironment.name}
                </h3>
              </div>

              <div>
                <p className="text-xs text-slate-500">Base URL</p>
                <p className="mt-1 break-all rounded-lg bg-slate-100 p-3 font-mono text-xs text-slate-700 sm:text-sm">
                  {activeEnvironment.baseUrl}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
              <p className="text-sm text-slate-500">
                No active environment configured.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;