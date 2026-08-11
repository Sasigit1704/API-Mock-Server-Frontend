import {
  Play,
  Code2,
  Shield,
  Clock3,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

function getPathParameterNames(path = "") {
  return [...path.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]);
}

function buildPreviewUrl(path, pathParams, queryParams) {
  let resolvedPath = path || "";

  Object.entries(pathParams || {}).forEach(([name, value]) => {
    resolvedPath = resolvedPath.replace(
      `{${name}}`,
      encodeURIComponent(value || `{${name}}`)
    );
  });

  const query = (queryParams || [])
    .filter((item) => item.name.trim())
    .map(
      (item) =>
        `${encodeURIComponent(item.name.trim())}=${encodeURIComponent(
          item.value ?? ""
        )}`
    )
    .join("&");

  return `/api/mock${resolvedPath}${query ? `?${query}` : ""}`;
}

function RequestEditor({
  selectedEndpoint,
  requestBody,
  setRequestBody,
  authToken,
  setAuthToken,
  pathParams,
  setPathParams,
  queryParams,
  setQueryParams,
  onSend,
  loading,
}) {
  const formatJson = () => {
    try {
      setRequestBody(
        JSON.stringify(JSON.parse(requestBody || "{}"), null, 2)
      );
    } catch {
      alert("Invalid JSON");
    }
  };

  const clearRequest = () => {
    setRequestBody("{}");
    setAuthToken("");
    setPathParams({});
    setQueryParams([]);
  };

  const methodColors = {
    GET: "bg-blue-500",
    POST: "bg-green-500",
    PUT: "bg-yellow-500",
    PATCH: "bg-purple-500",
    DELETE: "bg-red-500",
  };

  const method = selectedEndpoint?.method?.toUpperCase();
  const pathParameterNames = getPathParameterNames(selectedEndpoint?.path);
  const previewUrl = buildPreviewUrl(
    selectedEndpoint?.path || "",
    pathParams,
    queryParams
  );

  const addQueryParameter = () => {
    setQueryParams((prev) => [...prev, { name: "", value: "" }]);
  };

  const updateQueryParameter = (index, field, value) => {
    setQueryParams((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const removeQueryParameter = (index) => {
    setQueryParams((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Request</h2>
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
            <AlertCircle size={42} className="mx-auto text-slate-300" />
            <p className="mt-4 font-semibold text-slate-600">Select an endpoint</p>
            <p className="mt-2 text-sm text-slate-500">
              Choose an endpoint above to configure and send a real request
              against your mock server.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
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
                variant={selectedEndpoint.isEnabled ? "success" : "secondary"}
              >
                {selectedEndpoint.isEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="mt-3 break-all font-mono text-sm text-slate-600">
              {previewUrl}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Authentication</p>
              <p className="mt-1 text-sm font-semibold">
                {selectedEndpoint.requiresAuthentication ? "Required" : "Not required"}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Input Errors</p>
              <p className="mt-1 text-sm font-semibold">
                {selectedEndpoint.enableInputErrors ? "Enabled" : "Disabled"}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Process Errors</p>
              <p className="mt-1 text-sm font-semibold">
                {selectedEndpoint.enableProcessErrors ? "Enabled" : "Disabled"}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Response Mode</p>
              <p className="mt-1 text-sm font-semibold">
                {selectedEndpoint.enablePercentageBasedResponses
                  ? "Percentage"
                  : "Single"}
              </p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              URL
            </label>
            <div className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 font-mono text-sm text-slate-700 break-all">
              {previewUrl}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              URL is generated automatically from the path and query parameters below.
            </p>
          </div>

          {pathParameterNames.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-slate-800">
                  Path Parameters
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Values are automatically inserted into the endpoint path.
                </p>
              </div>
              <div className="space-y-3">
                {pathParameterNames.map((name) => (
                  <div key={name}>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      {name}
                    </label>
                    <input
                      value={pathParams?.[name] || ""}
                      onChange={(e) =>
                        setPathParams((prev) => ({
                          ...prev,
                          [name]: e.target.value,
                        }))
                      }
                      placeholder={`Enter ${name}`}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Query Parameters
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Add query values such as <span className="font-mono">name=Sasi</span>.
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={addQueryParameter}
              >
                <Plus size={16} className="mr-1" />
                Add
              </Button>
            </div>

            {queryParams.length === 0 ? (
              <p className="text-xs text-slate-500">
                No query parameters added.
              </p>
            ) : (
              <div className="space-y-3">
                {queryParams.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      value={item.name}
                      onChange={(e) =>
                        updateQueryParameter(index, "name", e.target.value)
                      }
                      placeholder="Parameter name"
                      className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                    <input
                      value={item.value}
                      onChange={(e) =>
                        updateQueryParameter(index, "value", e.target.value)
                      }
                      placeholder="Value"
                      className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                    <button
                      type="button"
                      onClick={() => removeQueryParameter(index)}
                      className="rounded-xl p-3 text-red-600 hover:bg-red-100"
                      title="Remove query parameter"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <Shield size={16} className="text-blue-600" />
              <label className="text-sm font-medium text-slate-700">
                Bearer Token
              </label>
              {selectedEndpoint.requiresAuthentication ? (
                <Badge variant="warning">Required</Badge>
              ) : (
                <Badge variant="secondary">Optional</Badge>
              )}
            </div>
            <input
              type="password"
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
              placeholder={
                selectedEndpoint.requiresAuthentication
                  ? "Enter authentication token"
                  : "Optional token"
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <p className="mt-1 text-xs text-slate-500">
              The tester sends this as:{" "}
              <span className="font-mono">
                Authorization: Bearer &lt;token&gt;
              </span>
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-slate-700">
                  Request Body
                </span>
              </div>
              <Button variant="secondary" type="button" onClick={formatJson}>
                Format JSON
              </Button>
            </div>
            <textarea
              rows={14}
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-900 px-4 py-4 font-mono text-sm text-green-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder={`{
  "name": "example"
}`}
            />
            <p className="mt-1 text-xs text-slate-500">
              Enter the request data required by the endpoint's validation rules.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <Clock3 size={18} className="mt-0.5 text-blue-600" />
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

          <Button onClick={onSend} disabled={!selectedEndpoint || loading}>
            <Play size={18} className="mr-2" />
            {loading ? "Sending Request..." : "Send Request"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default RequestEditor;