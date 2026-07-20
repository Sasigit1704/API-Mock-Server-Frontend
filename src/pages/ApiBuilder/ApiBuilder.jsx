import { useEffect, useState } from "react";
import {
  getMockEndpoints,
  createMockEndpoint,
  updateMockEndpoint,
  deleteMockEndpoint,
} from "../../services/mockEndpointService";
import { getCollections } from "../../services/collectionService";

import Button from "../../components/ui/Button";
import EndpointForm from "../../components/forms/EndpointForm";
import EndpointToolbar from "./EndpointToolbar";
import EndpointTable from "./EndpointTable";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

function ApiBuilder() {
  const [endpoints, setEndpoints] = useState([]);
  const [collections, setCollections] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState(null);

  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("");

  const [loading, setLoading] = useState(false);
  const [deleteEndpoint, setDeleteEndpoint] = useState(null);

  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get("endpoint");

  useEffect(() => {
    loadEndpoints();
    loadCollections();
    if (searchParams.get("create") === "true") {
      setEditingEndpoint(null);
      setShowForm(true);
    }
  }, []);

  const loadEndpoints = async () => {
    setLoading(true);

    try {
      const data = await getMockEndpoints();
      setEndpoints(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadCollections = async () => {
    try {
      const data = await getCollections();
      setCollections(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleSave = async (formData) => {
    const normalizedPath = formData.path.startsWith("/")
      ? formData.path
      : "/" + formData.path;

    const duplicate = endpoints.find(
      (item) =>
        item.method.toUpperCase() === formData.method.toUpperCase() &&
        item.path.toLowerCase() === normalizedPath.toLowerCase() &&
        item.id !== editingEndpoint?.id
    );

    if (duplicate) {
      alert(
        `Endpoint ${formData.method.toUpperCase()} ${normalizedPath} already exists.`
      );
      return;
    }

    try {
      if (editingEndpoint) {
        await updateMockEndpoint(editingEndpoint.id, formData);
      } else {
        await createMockEndpoint(formData);
      }

      await loadEndpoints();

      setShowForm(false);
      setEditingEndpoint(null);
    } catch (error) {
      if (error.response?.status === 409) {
        alert(error.response.data.message);
        return;
      }

      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!deleteEndpoint) return;

    try {
      await deleteMockEndpoint(deleteEndpoint.id);

      await loadEndpoints();

      setDeleteEndpoint(null);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredEndpoints = endpoints.filter((endpoint) => {
    const matchesSearch =
      endpoint.path.toLowerCase().includes(search.toLowerCase()) ||
      endpoint.method.toLowerCase().includes(search.toLowerCase());

    const matchesMethod =
      methodFilter === "" || endpoint.method === methodFilter;

    const matchesCollection =
      collectionFilter === "" ||
      String(endpoint.collectionId) === collectionFilter;

    return (
      matchesSearch &&
      matchesMethod &&
      matchesCollection
    );
  });

  const collectionMap = collections.reduce((acc, collection) => {
    acc[collection.id] = collection.name;
    return acc;
  }, {});

  if (loading) {
    return <LoadingSpinner/>
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-start justify-between bg-slate-100 p-8 rounded-2xl shadow-sm">

        <div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            API Builder
          </h1>

          <p className="text-slate-500">
            Manage the mock endpoints exposed by your server.
          </p>

        </div>

        <Button
          className="px-6 py-3"
          onClick={() => {
            setEditingEndpoint(null);
            setShowForm(true);
          }}
        >
          + Create Endpoint
        </Button>

      </div>

      {/* Toolbar */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <EndpointToolbar
          search={search}
          setSearch={setSearch}
          methodFilter={methodFilter}
          setMethodFilter={setMethodFilter}
          collectionFilter={collectionFilter}
          setCollectionFilter={setCollectionFilter}
          collections={collections}
        />

      </div>

      {/* Table */}

      <EndpointTable
        endpoints={filteredEndpoints}
        collectionMap={collectionMap}
        onEdit={(endpoint) => {
          setEditingEndpoint(endpoint);
          setShowForm(true);
        }}
        onDelete={(endpoint) => setDeleteEndpoint(endpoint)}
        onCreate={() => {
          setEditingEndpoint(null);
          setShowForm(true);
        }}
        selectedEndpointId={selectedId}
      />

      {/* Form */}

      <Modal
        open={showForm}
        title={
          editingEndpoint
            ? "Edit Endpoint"
            : "Create Endpoint"
        }
        onClose={() => {
          setShowForm(false);
          setEditingEndpoint(null);
        }}
      >
        <EndpointForm
          endpoint={editingEndpoint}
          collections={collections}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingEndpoint(null);
          }}
        />
      </Modal>

      {/* Delete */}

      <ConfirmDialog
        open={!!deleteEndpoint}
        message={`Are you sure you want to delete "${deleteEndpoint?.path}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteEndpoint(null)}
      />

    </div>
  );
}

export default ApiBuilder;