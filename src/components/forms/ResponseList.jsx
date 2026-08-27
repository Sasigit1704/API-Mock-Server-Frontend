import { useEffect, useState, useCallback } from "react";
import {
  Pencil,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import Modal from "../ui/Modal";
import ResponseForm from "./ResponseForm";
import {
  getResponsesByEndpoint,
  activateResponse,
  deleteResponse,
  createResponse,
  updateResponse,
} from "../../services/mockResponseService";

import Button from "../ui/Button";
import Badge from "../ui/Badge";
import EmptyState from "../ui/EmptyState";

function ResponseList({
  endpointId,
  enablePercentageBasedResponses = false,
}) {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingResponse, setEditingResponse] =
    useState(null);

  const loadResponses = useCallback(async () => {
    try {
      setLoading(true);

      const data =
        await getResponsesByEndpoint(endpointId);

      setResponses(data || []);
    } catch (error) {
      console.error(
        "Failed to load responses:",
        error
      );
    } finally {
      setLoading(false);
    }
  },[endpointId]);

  useEffect(() => {
    if (endpointId) {
      loadResponses();
    }
  }, [endpointId, loadResponses]);

  const handleActivate = async (id) => {
    try {
      await activateResponse(id);
      await loadResponses();
    } catch (error) {
      console.error(
        "Failed to activate response:",
        error
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this response?"
      )
    ) {
      return;
    }

    try {
      await deleteResponse(id);
      await loadResponses();
    } catch (error) {
      console.error(
        "Failed to delete response:",
        error
      );
    }
  };

  const totalPercentage = responses.reduce(
    (total, response) =>
      total + Number(response.percentage || 0),
    0
  );

  const roundedTotal =
    Math.round(totalPercentage * 100) / 100;

  const percentageIsValid =
    roundedTotal === 100;

  if (loading) {
    return (
      <div className="py-4 text-sm text-slate-500">
        Loading responses...
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">
            Responses
          </h3>

          <p className="text-sm text-slate-500">
            Configure multiple responses for this endpoint.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingResponse(null);
            setShowForm(true);
          }}
          className="w-full sm:w-auto"
        >
          + Add Response
        </Button>
      </div>

      {enablePercentageBasedResponses && (
        <div
          className={`mb-5 rounded-xl border p-4 ${
            percentageIsValid
              ? "border-green-200 bg-green-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <div className="flex items-start gap-3">
            {percentageIsValid ? (
              <CheckCircle
                size={20}
                className="mt-0.5 text-green-600 flex-shrink-0"
              />
            ) : (
              <AlertCircle
                size={20}
                className="mt-0.5 text-amber-600 flex-shrink-0"
              />
            )}

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <p
                  className={`font-medium ${
                    percentageIsValid
                      ? "text-green-800"
                      : "text-amber-800"
                  }`}
                >
                  Percentage-Based Response Selection
                </p>

                <span
                  className={`font-semibold ${
                    percentageIsValid
                      ? "text-green-700"
                      : "text-amber-700"
                  }`}
                >
                  {roundedTotal}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {responses.length === 0 ? (
        <EmptyState
          title="No Responses"
          description="Add a response for this endpoint."
        />
      ) : (
        <div className="space-y-3">
          {responses.map((response) => (
            <div
              key={response.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-slate-200 p-4"
            >
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                {response.isActive ? (
                  <CheckCircle
                    size={20}
                    className="text-green-600 mt-0.5 sm:mt-0 flex-shrink-0"
                  />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-slate-300 mt-0.5 sm:mt-0 flex-shrink-0" />
                )}

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-slate-900 truncate">
                      {response.responseName}
                    </span>

                    {response.isActive && (
                      <Badge variant="success">
                        Active
                      </Badge>
                    )}
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500">
                    <span>HTTP {response.statusCode}</span>
                    <span>•</span>
                    <span className="font-medium text-slate-600">
                      {Number(response.responseTimeMs || 0)} ms
                    </span>

                    {enablePercentageBasedResponses && (
                      <>
                        <span>•</span>
                        <span className="font-medium text-blue-600">
                          {Number(response.percentage || 0)}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t pt-3 sm:border-t-0 sm:pt-0">
                {!response.isActive && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      handleActivate(response.id)
                    }
                  >
                    Activate
                  </Button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setEditingResponse(response);
                    setShowForm(false);
                  }}
                  className="rounded-full p-2 hover:bg-blue-100 transition"
                  title="Edit response"
                >
                  <Pencil
                    size={18}
                    className="text-blue-600"
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(response.id)
                  }
                  className="rounded-full p-2 hover:bg-red-100 transition"
                  title="Delete response"
                >
                  <Trash2
                    size={18}
                    className="text-red-600"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={
          showForm ||
          !!editingResponse
        }
        title={
          editingResponse
            ? "Edit Response"
            : "Add Response"
        }
        onClose={() => {
          setShowForm(false);
          setEditingResponse(null);
        }}
      >
        <ResponseForm
          endpointId={endpointId}
          initialResponse={
            editingResponse
          }
          onSave={async (data) => {
            try {
              if (editingResponse) {
                await updateResponse(
                  editingResponse.id,
                  data
                );
              } else {
                await createResponse(
                  data
                );
              }

              setShowForm(false);
              setEditingResponse(null);

              await loadResponses();
            } catch (error) {
              console.error(
                "Failed to save response:",
                error
              );
            }
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingResponse(null);
          }}
        />
      </Modal>
    </div>
  );
}

export default ResponseList;