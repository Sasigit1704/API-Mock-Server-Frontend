import {
  Play,
  Code2,
  Shield,
  Clock3,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

function RequestEditor({
  selectedEndpoint,
  requestBody,
  setRequestBody,
  authToken,
  setAuthToken,
  onSend,
  loading,
}) {
  const formatJson = () => {
    try {
      const formatted = JSON.stringify(
        JSON.parse(requestBody || "{}"),
        null,
        2
      );

      setRequestBody(formatted);
    } catch {
      alert("Invalid JSON");
    }
  };

  const clearRequest = () => {
    setRequestBody("{}");
    setAuthToken("");
  };

  const methodColors = {
    GET: "bg-blue-500",
    POST: "bg-green-500",
    PUT: "bg-yellow-500",
    PATCH: "bg-purple-500",
    DELETE: "bg-red-500",
  };

  const method =
    selectedEndpoint?.method?.toUpperCase();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Request
        </h2>

        <Button
          variant="secondary"
          type="button"
          onClick={clearRequest}
          disabled={!selectedEndpoint}
        >
          Clear
        </Button>
      </div>

      {!selectedEndpoint ? (
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="max-w-sm text-center">
            <AlertCircle
              size={42}
              className="mx-auto text-slate-300"
            />

            <p className="mt-4 font-semibold text-slate-600">
              Select an endpoint
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Choose an endpoint above to configure and send a real request
              against your mock server.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {/* Endpoint summary */}

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold text-white ${
                  methodColors[method] || "bg-slate-500"
                }`}
              >
                {method}
              </span>

              <span className="font-semibold text-slate-900">
                {selectedEndpoint.name}
              </span>

              <Badge
                variant={
                  selectedEndpoint.isEnabled
                    ? "success"
                    : "secondary"
                }
              >
                {selectedEndpoint.isEnabled
                  ? "Enabled"
                  : "Disabled"}
              </Badge>
            </div>

            <div className="mt-3 break-all font-mono text-sm text-slate-600">
              /api/mock{selectedEndpoint.path}
            </div>
          </div>

          {/* Configuration indicators */}

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-500">
                Authentication
              </p>
              <p className="mt-1 text-sm font-semibold">
                {selectedEndpoint.requiresAuthentication
                  ? "Required"
                  : "Not required"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-500">
                Input Errors
              </p>
              <p className="mt-1 text-sm font-semibold">
                {selectedEndpoint.enableInputErrors
                  ? "Enabled"
                  : "Disabled"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-500">
                Process Errors
              </p>
              <p className="mt-1 text-sm font-semibold">
                {selectedEndpoint.enableProcessErrors
                  ? "Enabled"
                  : "Disabled"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-500">
                Response Mode
              </p>
              <p className="mt-1 text-sm font-semibold">
                {selectedEndpoint.enablePercentageBasedResponses
                  ? "Percentage"
                  : "Single"}
              </p>
            </div>
          </div>

          {/* URL */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              URL
            </label>

            <input
              disabled
              value={`/api/mock${selectedEndpoint.path}`}
              className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 font-mono text-sm text-slate-700"
            />
          </div>

          {/* Authentication */}

          <div>
            <div className="mb-2 flex items-center gap-2">
              <Shield
                size={16}
                className="text-blue-600"
              />

              <label className="text-sm font-medium text-slate-700">
                Bearer Token
              </label>

              {selectedEndpoint.requiresAuthentication ? (
                <Badge variant="warning">
                  Required
                </Badge>
              ) : (
                <Badge variant="secondary">
                  Optional
                </Badge>
              )}
            </div>

            <input
              type="password"
              value={authToken}
              onChange={(e) =>
                setAuthToken(e.target.value)
              }
              placeholder={
                selectedEndpoint.requiresAuthentication
                  ? "Enter authentication token"
                  : "Optional token"
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-1 text-xs text-slate-500">
              The tester sends this as:
              {" "}
              <span className="font-mono">
                Authorization: Bearer &lt;token&gt;
              </span>
            </p>
          </div>

          {/* Request body */}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2
                  size={16}
                  className="text-blue-600"
                />

                <span className="text-sm font-medium text-slate-700">
                  Request Body
                </span>
              </div>

              <Button
                variant="secondary"
                type="button"
                onClick={formatJson}
              >
                Format JSON
              </Button>
            </div>

            <textarea
              rows={14}
              value={requestBody}
              onChange={(e) =>
                setRequestBody(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-slate-900 px-4 py-4 font-mono text-sm text-green-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder={`{
  "name": "example"
}`}
            />

            <p className="mt-1 text-xs text-slate-500">
              Enter the request data required by the endpoint's validation
              rules. The actual configured validation is applied by the backend.
            </p>
          </div>

          {/* Test summary */}

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <Clock3
                size={18}
                className="mt-0.5 text-blue-600"
              />

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Test actual mock behavior
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  The request is sent to the real mock endpoint, so configured
                  response selection, delays, authentication, validation,
                  scenarios, and errors are exercised.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={onSend}
            disabled={!selectedEndpoint || loading}
          >
            <Play
              size={18}
              className="mr-2"
            />

            {loading
              ? "Sending Request..."
              : "Send Request"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default RequestEditor;