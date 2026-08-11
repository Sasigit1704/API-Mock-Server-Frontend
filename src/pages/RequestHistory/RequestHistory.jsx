import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  RefreshCw,
  History,
  Trash2,
  Download,
} from "lucide-react";

import RequestDetailsModal from "./RequestHistoryModal";

import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Pagination from "../../components/ui/Pagination";

import {
  getRequestHistory,
  clearRequestHistory,
  deleteRequestHistory,
  exportRequestHistoryCsv,
  exportRequestHistoryJson,
} from "../../services/requestHistoryService";

import RequestHistoryStats from "./RequestHistoryStats";
import RequestHistoryToolbar from "./RequestHistoryToolbar";
import RequestHistoryTable from "./RequestHistoryTable";

const ITEMS_PER_PAGE = 10;

function RequestHistory() {
  const [logs, setLogs] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [methodFilter, setMethodFilter] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [showClearDialog, setShowClearDialog] =
    useState(false);

  const [selectedLog, setSelectedLog] =
    useState(null);

  const [deleteLog, setDeleteLog] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  // ============================================================
  // LOAD HISTORY
  // ============================================================

  const loadHistory = useCallback(
    async () => {
      setLoading(true);

      try {
        const data =
          await getRequestHistory();

        setLogs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = async () => {
    if (!deleteLog) return;

    try {
      await deleteRequestHistory(
        deleteLog.id
      );

      await loadHistory();

      setDeleteLog(null);
    } catch (error) {
      console.error(error);
    }
  };

  // ============================================================
  // CLEAR HISTORY
  // ============================================================

  const handleClearHistory = async () => {
    try {
      await clearRequestHistory();

      await loadHistory();

      setShowClearDialog(false);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
    }
  };

  // ============================================================
  // FILTER
  //
  // IMPORTANT:
  // Search happens across ALL logs before pagination.
  // ============================================================

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const text = [
        log.method,
        log.path,
        String(log.statusCode),
        log.ipAddress,
        log.endpointName,
        log.scenarioName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        search.trim() === "" ||
        text.includes(
          search.trim().toLowerCase()
        );

      const matchesMethod =
        methodFilter === "" ||
        log.method === methodFilter;

      const matchesStatus =
        statusFilter === "" ||
        String(log.statusCode) ===
          statusFilter;

      return (
        matchesSearch &&
        matchesMethod &&
        matchesStatus
      );
    });
  }, [
    logs,
    search,
    methodFilter,
    statusFilter,
  ]);

  // ============================================================
  // RESET PAGE WHEN FILTERING
  // ============================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    methodFilter,
    statusFilter,
  ]);

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredLogs.length /
        ITEMS_PER_PAGE
    )
  );

  const paginatedLogs = useMemo(() => {
    const startIndex =
      (currentPage - 1) *
      ITEMS_PER_PAGE;

    return filteredLogs.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [
    filteredLogs,
    currentPage,
  ]);

  // ============================================================
  // KEEP PAGE VALID
  // ============================================================

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

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

          <div className="flex items-center gap-3">

            <History
              size={32}
              className="text-blue-600"
            />

            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Request History
            </h1>

          </div>

          <p className="mt-2 text-slate-500">
            Monitor every request executed by
            the Dynamic Mock Engine.
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          <Button
            variant="secondary"
            onClick={loadHistory}
          >
            <RefreshCw
              size={18}
              className="mr-2"
            />
            Refresh
          </Button>

          <Button
            variant="secondary"
            onClick={
              exportRequestHistoryJson
            }
          >
            <Download
              size={18}
              className="mr-2"
            />
            Export JSON
          </Button>

          <Button
            variant="secondary"
            onClick={
              exportRequestHistoryCsv
            }
          >
            <Download
              size={18}
              className="mr-2"
            />
            Export CSV
          </Button>

          <Button
            variant="danger"
            onClick={() =>
              setShowClearDialog(true)
            }
          >
            <Trash2
              size={18}
              className="mr-2"
            />
            Clear History
          </Button>

        </div>
      </div>

      {/* Statistics */}

      <RequestHistoryStats
        logs={filteredLogs}
      />

      {/* Toolbar */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <RequestHistoryToolbar
          search={search}
          setSearch={setSearch}
          methodFilter={methodFilter}
          setMethodFilter={
            setMethodFilter
          }
          statusFilter={statusFilter}
          setStatusFilter={
            setStatusFilter
          }
        />

      </div>

      {/* Table */}

      <RequestHistoryTable
        logs={paginatedLogs}
        onView={setSelectedLog}
        onRefresh={loadHistory}
        onDelete={(log) =>
          setDeleteLog(log)
        }
      />

      {/* Pagination */}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredLogs.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

      {/* Request Details */}

      <RequestDetailsModal
        open={!!selectedLog}
        log={selectedLog}
        onClose={() =>
          setSelectedLog(null)
        }
      />

      {/* Clear */}

      <ConfirmDialog
        open={showClearDialog}
        message="Clear entire request history?"
        onConfirm={handleClearHistory}
        onCancel={() =>
          setShowClearDialog(false)
        }
      />

      {/* Delete */}

      <ConfirmDialog
        open={!!deleteLog}
        message={`Are you sure you want to delete "${deleteLog?.path}"?`}
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteLog(null)
        }
      />

    </div>
  );
}

export default RequestHistory;