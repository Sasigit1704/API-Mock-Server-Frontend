import { useEffect, useRef, useState } from "react";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileJson,
  Eye,
  Copy,
  Check,
  X,
} from "lucide-react";

import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

import { getCollections } from "../../services/collectionService";
import { importOpenApi } from "../../services/openApiService";

const SAMPLE_CUSTOM_JSON = `[
  {
    "name": "Get User Details",                 // Mandatory
    "method": "GET",                            // Mandatory (GET, POST, PUT, PATCH, DELETE)
    "path": "/api/users/{id}",                  // Mandatory (Must start with '/')
    "statusCode": 200,                          // Mandatory
    "isEnabled": true,                          // Optional (defaults to true)
    "collectionId": "12345-abcde",              // Mandatory (Target Collection ID)
    "responseBody": {                           // Mandatory (JSON object or string)
      "message": "User fetched successfully",
      "data": {
        "id": "{{path.id}}",
        "name": "Sasi Kaladhar"
      }
    },
    
    // --- Request Validation (Optional) ---
    "requestSchema": "{\\"type\\": \\"object\\", \\"properties\\": {\\"id\\": {\\"type\\": \\"string\\"}}}",
    "enableInputErrors": true,
    
    // --- Timeout & Rate Limiting (Optional) ---
    "enableRateLimiting": true,
    "rateLimitRequests": 10,
    "rateLimitWindowSeconds": 60,
    "rateLimitStatusCode": 429,
    "rateLimitResponseBody": "{\\"error\\": \\"Too many requests\\"}",
    
    // --- Malformed JSON Simulation (Optional) ---
    "enableMalformedJson": false,
    "malformedJsonStatusCode": 500,
    "malformedJsonResponseBody": "{\\"error\\": \\"Broken JSON\\"}",
    
    // --- Process Errors (Optional) ---
    "enableProcessErrors": false,
    "processErrors": [],

    // --- Authentication (Optional) ---
    "requiresAuthentication": true,
    "authenticationToken": "secret_token_123"
  }
]`;

function OpenApiImport() {
  const fileInputRef = useRef(null);

  const [collections, setCollections] = useState([]);
  const [collectionId, setCollectionId] = useState("");

  const [specification, setSpecification] = useState("");
  const [fileName, setFileName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const [showSample, setShowSample] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await getCollections();
        setCollections(data || []);
        if (data?.length === 1) {
          setCollectionId(data[0].id);
        }
      } catch {
        setError("Unable to load collections.");
      }
    };

    loadCollections();
  }, []);

  const handleFile = (file) => {
    if (!file) return;

    setFileName(file.name);
    setError("");
    setResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setSpecification(String(event.target?.result || ""));
    };
    reader.onerror = () => {
      setError("Unable to read the selected file.");
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    setError("");
    setResult(null);

    if (!collectionId) {
      setError("Please select a collection.");
      return;
    }

    if (!specification.trim()) {
      setError("Upload or paste an Endpoint JSON specification.");
      return;
    }

    let parsed;
    try {
      // Strip out comments (//) before parsing, since standard JSON doesn't support them
      const jsonWithoutComments = specification.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
      parsed = JSON.parse(jsonWithoutComments);
    } catch {
      setError("The specification is not valid JSON.");
      return;
    }

    if (!Array.isArray(parsed)) {
      setError("The JSON must be an array of endpoint objects.");
      return;
    }

    try {
      setLoading(true);

      const response = await importOpenApi({
        specification: JSON.stringify(parsed), // Pass the CLEANED stringified JSON to the backend
        collectionId,
        skipExisting: true,
      });

      setResult({
        ...response,
        specificationType: "Custom Endpoint JSON",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Endpoint import failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSpecification("");
    setFileName("");
    setResult(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopySample = async () => {
    try {
      await navigator.clipboard.writeText(SAMPLE_CUSTOM_JSON);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Unable to copy sample JSON.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="rounded-2xl bg-slate-100 p-5 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                <FileJson size={22} className="text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Endpoint Import
              </h1>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 sm:text-lg">
              Import custom JSON definitions and automatically generate mock endpoint configurations.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowSample(true)}
            className="w-full sm:w-auto"
          >
            <Eye size={18} className="mr-2" />
            View Sample JSON
          </Button>
        </div>
      </div>

      {/* Import Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Upload */}
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <label className="text-sm font-medium text-slate-700">
                Endpoint JSON
              </label>
              <Badge variant="info">JSON only</Badge>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="
                w-full rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-7
                text-center transition hover:border-blue-400 hover:bg-blue-50 sm:p-10
              "
            >
              <Upload size={36} className="mx-auto text-blue-600" />
              <p className="mt-3 break-all font-semibold text-slate-800">
                {fileName || "Upload Endpoint JSON"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Custom Endpoint format
              </p>
              <p className="mt-3 text-xs text-slate-400">
                Click to choose a .json file
              </p>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          {/* Collection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Import Into Collection
            </label>
            <select
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className="
                h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm
                focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100
              "
            >
              <option value="">Select collection</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>

            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-900">
                Requirements
              </p>
              <ul className="mt-2 space-y-1 text-sm text-blue-700">
                <li>• Must be an array of endpoint objects</li>
                <li>• Contains mandatory configuration fields</li>
              </ul>
            </div>
          </div>
        </div>

        {/* JSON Editor */}
        <div className="mt-6">
          <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <label className="text-sm font-medium text-slate-700">
              JSON Data
            </label>
            <span className="text-xs text-slate-400">
              You can also paste JSON directly
            </span>
          </div>

          <textarea
            rows={12}
            value={specification}
            onChange={(e) => {
              setSpecification(e.target.value);
              setResult(null);
            }}
            placeholder="Paste your JSON array here..."
            className="
              w-full rounded-xl border border-slate-300 bg-slate-900 p-4 font-mono text-xs leading-6
              text-green-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:text-sm
            "
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClear}
            className="w-full sm:w-auto"
          >
            Clear
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={loading || !collectionId || !specification.trim()}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload size={18} className="mr-2" />
                Import Endpoints
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Import Result */}
      {result && (
        <div className="rounded-2xl border border-green-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 sm:text-xl">
                <CheckCircle2 className="text-green-600" size={22} />
                Import Complete
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {result.title}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success">{result.importedCount} Imported</Badge>
              <Badge variant="secondary">{result.skippedCount} Skipped</Badge>
            </div>
          </div>
          {result.importedEndpoints?.length > 0 && (
            <div className="mt-5 space-y-2">
              {result.importedEndpoints.map((endpoint) => (
                <div
                  key={endpoint}
                  className="break-all rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800"
                >
                  {endpoint}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sample JSON Modal */}
      {showSample && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-3 sm:p-6">
          <div className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-6">
              <div>
                <div className="flex items-center gap-2">
                  <FileJson size={20} className="text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-900">
                    Endpoint JSON Sample
                  </h2>
                </div>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Use this structure as a reference for files uploaded to the importer.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSample(false)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-slate-950 p-4 sm:p-6">
              <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-6 text-green-400 sm:text-sm">
                {SAMPLE_CUSTOM_JSON}
              </pre>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Save the JSON as a <b>.json</b> file before uploading.
              </p>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={() => setShowSample(false)}>
                  Close
                </Button>
                <Button type="button" onClick={handleCopySample}>
                  {copied ? (
                    <>
                      <Check size={17} className="mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={17} className="mr-2" />
                      Copy JSON
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OpenApiImport;