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
  const [collectionFilter, setCollectionFilter] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [deleteEndpoint, setDeleteEndpoint] =
    useState(null);

  const [searchParams] = useSearchParams();

  const expandId = searchParams.get("expand");

  const [expandedEndpointId, setExpandedEndpointId] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const location = useLocation();

  const [highlightedId, setHighlightedId] =
    useState(
      location.state?.highlightEndpointId
    );

  // ============================================================
  // LOAD DATA
  // ============================================================

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

  // ============================================================
  // SAVE ENDPOINT
  // ============================================================

  const handleSave = async (formData) => {
    const normalizedPath =
      formData.path.startsWith("/")
        ? formData.path
        : "/" + formData.path;

    const duplicate = endpoints.find(
      (item) =>
        item.method.toUpperCase() ===
          formData.method.toUpperCase() &&
        item.path.toLowerCase() ===
          normalizedPath.toLowerCase() &&
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
        await updateMockEndpoint(
          editingEndpoint.id,
          formData
        );
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

  // ============================================================
  // DELETE ENDPOINT
  // ============================================================

  const handleDelete = async () => {
    if (!deleteEndpoint) return;

    try {
      await deleteMockEndpoint(
        deleteEndpoint.id
      );

      await loadEndpoints();

      setDeleteEndpoint(null);
    } catch (error) {
      console.error(error);
    }
  };

  // ============================================================
  // FILTER
  //
  // IMPORTANT:
  // Filtering happens BEFORE pagination.
  // Therefore search works across ALL pages.
  // ============================================================

  const filteredEndpoints = useMemo(() => {
    return endpoints.filter((endpoint) => {
      const searchValue =
        search.trim().toLowerCase();

      const matchesSearch =
        searchValue === "" ||
        endpoint.path
          .toLowerCase()
          .includes(searchValue) ||
        endpoint.method
          .toLowerCase()
          .includes(searchValue) ||
        endpoint.name
          ?.toLowerCase()
          .includes(searchValue);

      const matchesMethod =
        methodFilter === "" ||
        endpoint.method === methodFilter;

      const matchesCollection =
        collectionFilter === "" ||
        String(endpoint.collectionId) ===
          collectionFilter;

      return (
        matchesSearch &&
        matchesMethod &&
        matchesCollection
      );
    });
  }, [
    endpoints,
    search,
    methodFilter,
    collectionFilter,
  ]);

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredEndpoints.length /
        ITEMS_PER_PAGE
    )
  );

  const paginatedEndpoints = useMemo(() => {
    const startIndex =
      (currentPage - 1) *
      ITEMS_PER_PAGE;

    return filteredEndpoints.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [
    filteredEndpoints,
    currentPage,
  ]);

  // ============================================================
  // RESET PAGE WHEN SEARCH/FILTER CHANGES
  // ============================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    methodFilter,
    collectionFilter,
  ]);

  // ============================================================
  // KEEP PAGE VALID AFTER DELETE
  // ============================================================

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // ============================================================
  // OPEN ENDPOINT FROM URL
  // ============================================================

  useEffect(() => {
    if (!expandId || endpoints.length === 0) {
      return;
    }

    const endpointIndex =
      filteredEndpoints.findIndex(
        (endpoint) =>
          endpoint.id === expandId
      );

    if (endpointIndex === -1) {
      return;
    }

    const page =
      Math.floor(
        endpointIndex / ITEMS_PER_PAGE
      ) + 1;

    setCurrentPage(page);
    setExpandedEndpointId(expandId);
  }, [
    expandId,
    endpoints,
    filteredEndpoints,
  ]);

  // ============================================================
  // HIGHLIGHTED ENDPOINT
  // ============================================================

  useEffect(() => {
    if (!highlightedId) return;

    const timer = setTimeout(() => {
      setHighlightedId(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [highlightedId]);

  // ============================================================
  // COLLECTION MAP
  // ============================================================

  const collectionMap = collections.reduce(
    (acc, collection) => {
      acc[collection.id] =
        collection.name;

      return acc;
    },
    {}
  );

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return <LoadingSpinner />;
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-start justify-between rounded-2xl bg-slate-100 p-8 shadow-sm">

        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            API Builder
          </h1>

          <p className="text-slate-500">
            Manage the mock endpoints exposed by
            your server.
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
          collectionFilter={
            collectionFilter
          }
          setCollectionFilter={
            setCollectionFilter
          }
          collections={collections}
        />

      </div>

      {/* Endpoint Table */}

      <EndpointTable
        endpoints={paginatedEndpoints}
        highlightedId={highlightedId}
        expandedEndpointId={
          expandedEndpointId
        }
        onToggleExpand={
          setExpandedEndpointId
        }
        collectionMap={collectionMap}
        onEdit={(endpoint) => {
          setEditingEndpoint(endpoint);
          setShowForm(true);
        }}
        onDelete={(endpoint) =>
          setDeleteEndpoint(endpoint)
        }
        onCreate={() => {
          setEditingEndpoint(null);
          setShowForm(true);
        }}
        onCloseDetails={() =>
          setExpandedEndpointId(null)
        }
      />

      {/* Pagination */}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={
          filteredEndpoints.length
        }
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={(page) => {
          setCurrentPage(page);
          setExpandedEndpointId(null);
        }}
      />

      {/* Endpoint Form */}

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
        onCancel={() =>
          setDeleteEndpoint(null)
        }
      />

    </div>
  );
}

export default ApiBuilder;