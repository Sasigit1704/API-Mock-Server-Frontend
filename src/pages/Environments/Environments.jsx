import { useEffect, useState } from "react";

import {
  getEnvironments,
  createEnvironment,
  updateEnvironment,
  deleteEnvironment,
} from "../../services/environmentService";

import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

import EnvironmentToolbar from "./EnvironmentToolbar";
import EnvironmentTable from "./EnvironmentTable";
import EnvironmentForm from "../../components/forms/EnvironmentForm";

function Environments() {
  const [environments, setEnvironments] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingEnvironment, setEditingEnvironment] =
    useState(null);

  const [deleteEnvironmentItem, setDeleteEnvironmentItem] =
    useState(null);

  useEffect(() => {
    loadEnvironments();
  }, []);

  const loadEnvironments = async () => {
    setLoading(true);

    try {
      const data = await getEnvironments();
      setEnvironments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingEnvironment) {
        await updateEnvironment(
          editingEnvironment.id,
          formData
        );
      } else {
        await createEnvironment(formData);
      }

      await loadEnvironments();

      setShowForm(false);
      setEditingEnvironment(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!deleteEnvironmentItem) return;

    try {
      await deleteEnvironment(deleteEnvironmentItem.id);

      await loadEnvironments();

      setDeleteEnvironmentItem(null);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredEnvironments =
    environments.filter((environment) => {
      return (
        environment.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        environment.baseUrl
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-start justify-between rounded-2xl bg-slate-100 p-8 shadow-sm">

        <div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">

            Environment Management

          </h1>

          <p className="mt-2 text-slate-500">

            Configure host addresses, port settings,
            and simulated targets for your mock API
            environments.

          </p>

        </div>

        <Button
          className="px-6 py-3"
          onClick={() => {
            setEditingEnvironment(null);
            setShowForm(true);
          }}
        >
          + Add Environment
        </Button>

      </div>

      {/* Information Card */}

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">

        <div className="flex gap-4">

          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">

            🌐

          </div>

          <div>

            <h2 className="font-semibold text-blue-900">

              Target Environment Concept

            </h2>

            <p className="mt-2 text-sm leading-6 text-blue-700">

              The active environment serves as the
              target host for API routing simulations.
              Only one environment can be active at a
              time. Setting a new environment as active
              will automatically deactivate the previous
              one.

            </p>

          </div>

        </div>

      </div>

      {/* Toolbar */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <EnvironmentToolbar
          search={search}
          setSearch={setSearch}
        />

      </div>

      {/* Table */}

      <EnvironmentTable
        environments={filteredEnvironments}
        onEdit={(environment) => {
          setEditingEnvironment(environment);
          setShowForm(true);
        }}
        onDelete={(environment) =>
          setDeleteEnvironmentItem(environment)
        }
        onCreate={() => {
          setEditingEnvironment(null);
          setShowForm(true);
        }}
      />

      {/* Form */}

      <Modal
        open={showForm}
        title={
          editingEnvironment
            ? "Edit Environment"
            : "Create Environment"
        }
        onClose={() => {
          setShowForm(false);
          setEditingEnvironment(null);
        }}
      >
        <EnvironmentForm
          environment={editingEnvironment}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingEnvironment(null);
          }}
        />
      </Modal>

      {/* Delete */}

      <ConfirmDialog
        open={!!deleteEnvironmentItem}
        message={`Are you sure you want to delete "${deleteEnvironmentItem?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteEnvironmentItem(null)
        }
      />

    </div>
  );
}

export default Environments;