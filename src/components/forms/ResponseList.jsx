import { useEffect, useState } from "react";
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

  const loadResponses = async () => {
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
  };

  useEffect(() => {
    if (endpointId) {
      loadResponses();
    }
  }, [endpointId]);

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
    <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">

      {/* Header */}

      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">
            Responses
          </h3>

          <p className="text-sm text-slate-500">
            Configure multiple responses for this
            endpoint.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingResponse(null);
            setShowForm(true);
          }}
        >
          + Add Response
        </Button>
      </div>

      {/* Percentage Mode Information */}

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
                className="mt-0.5 text-green-600"
              />
            ) : (
              <AlertCircle
                size={20}
                className="mt-0.5 text-amber-600"
              />
            )}

            <div className="flex-1">

              <div className="flex items-center justify-between">
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

              {percentageIsValid ? (
                <p className="mt-1 text-sm text-green-700">
                  Response percentages total 100%.
                  The mock server will select responses
                  according to these percentages.
                </p>
              ) : (
                <p className="mt-1 text-sm text-amber-700">
                  Response percentages must total
                  exactly 100% before percentage-based
                  selection can be used.
                </p>
              )}

            </div>
          </div>
        </div>
      )}

      {/* No Responses */}

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
              className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
            >

              {/* Response Information */}

              <div className="flex items-center gap-4">

                {response.isActive ? (
                  <CheckCircle
                    size={20}
                    className="text-green-600"
                  />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
                )}

                <div>

                  <div className="flex items-center gap-2">

                    <span className="font-medium text-slate-900">
                      {response.responseName}
                    </span>

                    {response.isActive && (
                      <Badge variant="success">
                        Active
                      </Badge>
                    )}

                  </div>

                  <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">

                    <span>
                      HTTP {response.statusCode}
                    </span>

                    <span>•</span>

                    <span className="font-medium text-slate-600">
                      {Number(response.responseTimeMs || 0)} ms
                    </span>

                    {enablePercentageBasedResponses && (
                      <>
                        <span>•</span>

                        <span className="font-medium text-blue-600">
                          {Number(
                            response.percentage || 0
                          )}
                          %
                        </span>
                      </>
                    )}

                  </div>

                </div>
              </div>

              {/* Actions */}

              <div className="flex items-center gap-2">

                {/* Active Response */}

                {!response.isActive && (
                  <Button
                    variant="secondary"
                    onClick={() =>
                      handleActivate(
                        response.id
                      )
                    }
                  >
                    Activate
                  </Button>
                )}

                {/* Edit */}

                <button
                  type="button"
                  onClick={() => {
                    setEditingResponse(response);
                    setShowForm(false);
                  }}
                  className="rounded-full p-2 hover:bg-blue-100"
                  title="Edit response"
                >
                  <Pencil
                    size={18}
                    className="text-blue-600"
                  />
                </button>

                {/* Delete */}

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(
                      response.id
                    )
                  }
                  className="rounded-full p-2 hover:bg-red-100"
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

      {/* Response Modal */}

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