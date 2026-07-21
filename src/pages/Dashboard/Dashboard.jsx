import {
  Server,
  FolderKanban,
  Globe,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getMockEndpoints } from "../../services/mockEndpointService";
import { getCollections } from "../../services/collectionService";
import { getEnvironments } from "../../services/environmentService";
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
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const endpoints = await getMockEndpoints();
      const collections = await getCollections();
      const environments = await getEnvironments();

      setEndpointCount(endpoints.length);
      setCollectionCount(collections.length);
      setEnvironmentCount(environments.length);

      setRecentEndpoints(endpoints.reverse().slice(0, 5));
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
    },
    {
      title: "Collections",
      value: collectionCount,
      icon: FolderKanban,
    },
    {
      title: "Environments",
      value: environmentCount,
      icon: Globe,
    }
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Card className="p-8" key={item.title}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500">
                    {item.title}
                  </p>
                  <h2 className="mt-2 text-3xl font-bold">
                    {item.value}
                  </h2>
                </div>
                <div className="rounded-xl bg-blue-100 p-3">
                  <Icon
                    size={28}
                    className="text-blue-600"
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {/* Recent Endpoints */}
        <div>
        <Card>
          <h2 className="mb-4 text-xl font-semibold">
            Recent Endpoints
          </h2>

          <div className="space-y-4">
            {recentEndpoints.length === 0 ? (
              <p className="text-sm text-slate-500">
                No endpoints available.
              </p>
            ) : (
              recentEndpoints.map((endpoint) => (
                <Link
                  key={endpoint.id}
                  to={`/builder?endpoint=${endpoint.id}`}
                  className="block"
                >
                  <div
                    className="
                      flex items-center justify-between
                      rounded-xl
                      border border-slate-200
                      p-4
                      transition
                      hover:border-blue-300
                      hover:shadow-sm
                      hover:bg-slate-50
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
        </Card>
        </div>
        {/* Quick Actions */}
        <div className="space-y-6">
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
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-semibold">
              Active Environment
          </h2>

          {activeEnvironment ? (
              <>
                  <Badge variant="active">
                      Active
                  </Badge>

                  <h3 className="mt-4 text-xl font-semibold">
                      {activeEnvironment.name}
                  </h3>

                  <p className="mt-2 text-slate-500">
                      {activeEnvironment.baseUrl}
                  </p>
              </>
          ) : (
              <p className="text-slate-500">
                  No active environment configured.
              </p>
          )}
        </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;