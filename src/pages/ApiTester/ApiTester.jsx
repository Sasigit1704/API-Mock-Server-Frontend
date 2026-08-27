import { useEffect, useState } from "react";
import { getEndpoints, testEndpoint } from "../../services/apiTesterService";
import ApiTesterToolbar from "./ApiTesterToolbar";
import RequestEditor from "./RequestEditor";
import ResponseViewer from "./ResponseViewer";

function getPathParameterNames(path = "") {
  return [...path.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]);
}

function getInitialPathParams(path = "") {
  return getPathParameterNames(path).reduce((params, name) => {
    params[name] = "";
    return params;
  }, {});
}

function ApiTester() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [endpoints, setEndpoints] = useState([]);
  const [loadingEndpoints, setLoadingEndpoints] = useState(true);
  const [loading, setLoading] = useState(false);
  const [requestBody, setRequestBody] = useState("{}");
  const [authToken, setAuthToken] = useState("");
  const [pathParams, setPathParams] = useState({});
  const [queryParams, setQueryParams] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [response, setResponse] = useState(null);

  const loadEndpoints = async () => {
    try {
      setLoadingEndpoints(true);
      const data = await getEndpoints();
      setEndpoints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load endpoints:", error);
      setEndpoints([]);
    } finally {
      setLoadingEndpoints(false);
    }
  };

  useEffect(() => {
    loadEndpoints();
  }, []);

  useEffect(() => {
    if (!selectedEndpoint) {
      setRequestBody("{}");
      setAuthToken("");
      setPathParams({});
      setQueryParams([]);
      setHeaders([]);
      setResponse(null);
      return;
    }

    setRequestBody("{}");
    setAuthToken("");
    setPathParams(getInitialPathParams(selectedEndpoint.path));
    setQueryParams([]);
    setHeaders([]);
    setResponse(null);
  }, [selectedEndpoint]);

  const handleSendRequest = async () => {
    if (!selectedEndpoint) return;

    const missingPathParameter = Object.entries(pathParams).find(
      ([, value]) => !String(value ?? "").trim()
    );

    if (missingPathParameter) {
      setResponse({
        status: 400,
        responseTime: 0,
        body: {
          success: false,
          message: `Path parameter "${missingPathParameter[0]}" is required.`,
        },
        isClientError: true,
      });
      return;
    }

    let parsedBody = {};

    try {
      parsedBody = requestBody.trim() ? JSON.parse(requestBody) : {};
    } catch {
      setResponse({
        status: 400,
        responseTime: 0,
        body: {
          success: false,
          message: "Invalid JSON request body.",
        },
        isClientError: true,
      });
      return;
    }

    const requestHeaders = headers.reduce((result, item) => {
      const name = item.name?.trim();
      if (name) result[name] = item.value ?? "";
      return result;
    }, {});

    try {
      setLoading(true);
      setResponse(null);
      const start = performance.now();

      const result = await testEndpoint(
        selectedEndpoint.method,
        selectedEndpoint.path,
        parsedBody,
        authToken,
        pathParams,
        queryParams,
        requestHeaders
      );

      const end = performance.now();

      setResponse({
        status: result.status,
        responseTime: Math.round(end - start),
        body: result.data,
        isClientError: false,
      });
    } catch (error) {
      setResponse({
        status: error.response?.status || 500,
        responseTime: 0,
        body:
          error.response?.data || {
            success: false,
            message: "Unexpected server error.",
          },
        isClientError: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-slate-100 p-8 shadow-sm">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">API Tester</h1>
        <p className="mt-3 max-w-3xl text-slate-500">
          Test your configured mock endpoints directly from the application.
          Verify authentication, input validation, process errors, scenarios,
          response selection, headers, and response timing before using Swagger or cURL.
        </p>
      </div>

      <ApiTesterToolbar
        endpoints={endpoints}
        selectedEndpoint={selectedEndpoint}
        setSelectedEndpoint={setSelectedEndpoint}
        onRefresh={loadEndpoints}
        loading={loadingEndpoints}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RequestEditor
          selectedEndpoint={selectedEndpoint}
          requestBody={requestBody}
          setRequestBody={setRequestBody}
          authToken={authToken}
          setAuthToken={setAuthToken}
          pathParams={pathParams}
          setPathParams={setPathParams}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          headers={headers}
          setHeaders={setHeaders}
          onSend={handleSendRequest}
          loading={loading}
        />
        <ResponseViewer response={response} onClear={() => setResponse(null)} />
      </div>
    </div>
  );
}

export default ApiTester;