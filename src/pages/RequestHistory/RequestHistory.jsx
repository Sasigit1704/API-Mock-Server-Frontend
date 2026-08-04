import { useCallback, useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  History,
  Trash2,
} from "lucide-react";

import RequestDetailsModal from "./RequestHistoryModal";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

import {
  getRequestHistory,
  clearRequestHistory,
  deleteRequestHistory,
} from "../../services/requestHistoryService";

import RequestHistoryStats from "./RequestHistoryStats";
import RequestHistoryToolbar from "./RequestHistoryToolbar";
import RequestHistoryTable from "./RequestHistoryTable";

function RequestHistory() {
  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [methodFilter, setMethodFilter] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [showClearDialog, setShowClearDialog] = useState(false);

  const [selectedLog, setSelectedLog] = useState(null);
  
  const [deleteLog, setDeleteLog] = useState(null);

  const loadHistory = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getRequestHistory();

      setLogs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleDelete = async () => {
    if (!deleteLog) return;
    try {
      await deleteRequestHistory(deleteLog.id);
      await loadHistory();
      setDeleteLog(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearRequestHistory();

      await loadHistory();

      setShowClearDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const text = [
        log.method,
        log.path,
        String(log.statusCode),
        log.ipAddress,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = text.includes(
        search.toLowerCase()
      );

      const matchesMethod =
        methodFilter === "" ||
        log.method === methodFilter;

      const matchesStatus =
        statusFilter === "" ||
        String(log.statusCode) === statusFilter;

      return (
        matchesSearch &&
        matchesMethod &&
        matchesStatus
      );
    });
  }, [logs, search, methodFilter, statusFilter]);

  if (loading) {
    return <LoadingSpinner />;
  }

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

        <div className="flex gap-3">

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
          setMethodFilter={setMethodFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

      </div>

      {/* Table */}

      <RequestHistoryTable
        logs={filteredLogs}
        onView={setSelectedLog}
        onRefresh={loadHistory}
        onDelete={(log) => setDeleteLog(log)}
      />

      <RequestDetailsModal
        open={!!selectedLog}
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />

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
        onCancel={() => setDeleteLog(null)}
      />

    </div>
  );
}

export default RequestHistory;