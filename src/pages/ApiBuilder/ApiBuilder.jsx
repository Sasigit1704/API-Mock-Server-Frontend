import { useEffect, useMemo, useState } from "react";
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
import { useSearchParams, useLocation } from "react-router-dom";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Pagination from "../../components/ui/Pagination";

const ITEMS_PER_PAGE = 10;

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
  const [saveError, setSaveError] = useState("");

  const [searchParams] = useSearchParams();
  const expandId = searchParams.get("expand");
  const [expandedEndpointId, setExpandedEndpointId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const [highlightedId, setHighlightedId] = useState(location.state?.highlightEndpointId);

  useEffect(() => {
    loadEndpoints();
    loadCollections();

    if (searchParams.get("create") === "true") {
      setEditingEndpoint(null);
      setShowForm(true);
    }
  }, [searchParams]);

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
    setSaveError("");

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
      setSaveError(
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
      setSaveError(
        error.response?.status === 409
          ? error.response.data.message
          : "Unable to save the endpoint. Please try again."
      );
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!deleteEndpoint) return;
    try {
      await deleteMockEndpoint(deleteEndpoint.id);
      
      // Filter out the deleted endpoint instantly from state without jumping the page scroll
      setEndpoints((prev) => prev.filter((ep) => ep.id !== deleteEndpoint.id));
      setDeleteEndpoint(null);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredEndpoints = useMemo(() => {
    return endpoints.filter((endpoint) => {
      const searchValue = search.trim().toLowerCase();
      const matchesSearch =
        searchValue === "" ||
        endpoint.path.toLowerCase().includes(searchValue) ||
        endpoint.method.toLowerCase().includes(searchValue) ||
        endpoint.name?.toLowerCase().includes(searchValue);

      const matchesMethod = methodFilter === "" || endpoint.method === methodFilter;
      const matchesCollection =
        collectionFilter === "" || String(endpoint.collectionId) === collectionFilter;

      return matchesSearch && matchesMethod && matchesCollection;
    });
  }, [endpoints, search, methodFilter, collectionFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEndpoints.length / ITEMS_PER_PAGE));

  const paginatedEndpoints = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEndpoints.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEndpoints, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, methodFilter, collectionFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!expandId || endpoints.length === 0) return;
    const endpointIndex = filteredEndpoints.findIndex((e) => e.id === expandId);
    if (endpointIndex === -1) return;

    const page = Math.floor(endpointIndex / ITEMS_PER_PAGE) + 1;
    setCurrentPage(page);
    setExpandedEndpointId(expandId);
  }, [expandId, endpoints, filteredEndpoints]);

  useEffect(() => {
    if (!highlightedId) return;
    const timer = setTimeout(() => setHighlightedId(null), 3000);
    return () => clearTimeout(timer);
  }, [highlightedId]);

  const collectionMap = collections.reduce((acc, collection) => {
    acc[collection.id] = collection.name;
    return acc;
  }, {});

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Responsive Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-slate-100 p-5 sm:p-8 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
            API Builder
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Manage the mock endpoints exposed by your server.
          </p>
        </div>

        <Button
          className="w-full sm:w-auto px-6 py-3"
          onClick={() => {
            setEditingEndpoint(null);
            setSaveError("");
            setShowForm(true);
          }}
        >
          + Create Endpoint
        </Button>
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm overflow-x-auto">
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

      {/* Endpoint Table */}
      <EndpointTable
        endpoints={paginatedEndpoints}
        highlightedId={highlightedId}
        expandedEndpointId={expandedEndpointId}
        onToggleExpand={setExpandedEndpointId}
        collectionMap={collectionMap}
        onEdit={(endpoint) => {
          setEditingEndpoint(endpoint);
          setSaveError("");
          setShowForm(true);
        }}
        onDelete={(endpoint) => setDeleteEndpoint(endpoint)}
        onCreate={() => {
          setEditingEndpoint(null);
          setSaveError("");
          setShowForm(true);
        }}
        onCloseDetails={() => setExpandedEndpointId(null)}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredEndpoints.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={(page) => {
          setCurrentPage(page);
          setExpandedEndpointId(null);
        }}
      />

      {/* Modal & Dialog */}
      <Modal
        open={showForm}
        title={editingEndpoint ? "Edit Endpoint" : "Create Endpoint"}
        onClose={() => {
          setShowForm(false);
          setEditingEndpoint(null);
        }}
      >
        {saveError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {saveError}
          </div>
        )}

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