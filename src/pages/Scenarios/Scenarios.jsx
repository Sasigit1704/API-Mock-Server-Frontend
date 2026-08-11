import { Workflow } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { getMockEndpointById } from "../../services/mockEndpointService";
import {
  getScenariosByEndpoint,
  getActiveScenario,
  createMockScenario,
  updateMockScenario,
  patchMockScenario,
  deleteMockScenario,
} from "../../services/mockScenarioService";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

import ScenarioToolbar from "./ScenarioToolbar";
import ScenarioTable from "./ScenarioTable";
import ScenarioStats from "./ScenarioStats";

import ScenarioForm from "../../components/forms/ScenarioForm";

function Scenarios() {
  const [searchParams] = useSearchParams();

  const endpointId = searchParams.get("endpoint");
  const [endpoint, setEndpoint] = useState(null);

  const [scenarios, setScenarios] = useState([]);
  const [activeScenario, setActiveScenario] = useState(null);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingScenario, setEditingScenario] = useState(null);
  const [deleteScenario, setDeleteScenario] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const loadEndpoint = useCallback(async () => {
    const data = await getMockEndpointById(endpointId);
    setEndpoint(data);
  },[endpointId]);

  const loadScenarios = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getScenariosByEndpoint(endpointId);
      setScenarios(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  },[endpointId]);

  const loadActiveScenario = useCallback(async () => {
    try {
      const data = await getActiveScenario(endpointId);
      setActiveScenario(data);
    } catch (error) {
      console.error(error);
      setActiveScenario(null);
    }
  },[endpointId]);

  useEffect(() => {
    if (endpointId) {
      loadEndpoint();
      loadScenarios();
      loadActiveScenario();
    }
  }, [endpointId, loadEndpoint, loadScenarios, loadActiveScenario]);

  const handleSave = async (formData) => {
    try {
      if (editingScenario) {
        await updateMockScenario(editingScenario.id, formData);
      } else {
        await createMockScenario({
          ...formData,
          mockEndpointId: endpointId,
        });
      }

      await loadScenarios();
      await loadActiveScenario();

      setShowForm(false);
      setEditingScenario(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleActivate = async (scenario) => {
    try {
      await patchMockScenario(scenario.id, {
        isActive: !scenario.isActive,
      });

      await loadScenarios();
      await loadActiveScenario();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!deleteScenario) return;

    try {
      await deleteMockScenario(deleteScenario.id);

      await loadScenarios();
      await loadActiveScenario();

      setDeleteScenario(null);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredScenarios = scenarios.filter((scenario) => {
    const matchesSearch = scenario.scenarioName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "" ||
      String(scenario.statusCode) === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const [highlightedId, setHighlightedId] = useState(
    location.state?.highlightScenarioId
  );

  useEffect(() => {
    if (!highlightedId) return;

    const timer = setTimeout(() => {
      setHighlightedId(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [highlightedId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!endpointId) {
      return (
          <div className="flex justify-center py-20">
              <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
                      <Workflow
                          size={30}
                          className="text-violet-600"
                      />
                  </div>

                  <h2 className="text-3xl font-bold text-slate-900">
                      No Endpoint Selected
                  </h2>

                  <p className="mt-3 text-slate-500">
                      Scenarios belong to API Endpoints.
                      Select an endpoint from API Builder
                      to configure delays, failures,
                      timeout simulations and responses.
                  </p>

                  <Button
                      className="mt-8"
                      onClick={() =>
                          navigate("/builder")
                      }
                  >
                      Open API Builder
                  </Button>

              </div>
          </div>
      );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      {endpoint && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-blue-700">
                Current Endpoint
              </p>

              <div className="mt-2 flex items-center gap-3">

                <Badge variant={endpoint.method.toLowerCase()}>
                  {endpoint.method}
                </Badge>

                <span className="font-mono text-lg text-slate-800">
                  {endpoint.path}
                </span>

              </div>
            </div>

            <div className="text-right">

              <p className="text-sm text-slate-500">
                Default Status
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {endpoint.statusCode}
              </p>

            </div>

          </div>
        </div>
      )}

      <div className="flex items-start justify-between rounded-2xl bg-slate-100 p-8 shadow-sm">

        <div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Scenario Management
          </h1>

          <p className="text-slate-500">
            Configure delays, timeout simulations and failure scenarios for your endpoint.
          </p>

        </div>

        <Button
          className="px-6 py-3"
          onClick={() => {
            setEditingScenario(null);
            setShowForm(true);
          }}
        >
          + Create Scenario
        </Button>

      </div>

      <ScenarioStats
        scenarios={scenarios}
        activeScenario={activeScenario}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <ScenarioToolbar
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

      </div>

      <ScenarioTable
        scenarios={filteredScenarios}
        highlightedId={highlightedId}
        onEdit={(scenario) => {
          setEditingScenario(scenario);
          setShowForm(true);
        }}
        onDelete={(scenario) => setDeleteScenario(scenario)}
        onActivate={handleActivate}
        onCreate={() => {
          setEditingScenario(null);
          setShowForm(true);
        }}
      />

      <Modal
        open={showForm}
        title={
          editingScenario
            ? "Edit Scenario"
            : "Create Scenario"
        }
        onClose={() => {
          setShowForm(false);
          setEditingScenario(null);
        }}
      >
        <ScenarioForm
          scenario={editingScenario}
          endpointId={endpointId}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingScenario(null);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteScenario}
        message={`Are you sure you want to delete "${deleteScenario?.scenarioName}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteScenario(null)}
      />

    </div>
  );
}

export default Scenarios;