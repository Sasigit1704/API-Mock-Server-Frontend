import { useEffect, useRef, useState } from "react";
import {
  Upload,
  FileJson,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { getCollections } from "../../services/collectionService";
import { importOpenApi } from "../../services/openApiService";

function OpenApiImport() {
  const fileRef = useRef(null);

  const [collections, setCollections] = useState([]);
  const [collectionId, setCollectionId] = useState("");
  const [specification, setSpecification] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const data = await getCollections();
      setCollections(Array.isArray(data) ? data : []);
      if (data?.length === 1) setCollectionId(data[0].id);
    } catch {
      setError("Unable to load collections.");
    }
  };

  const handleFile = (file) => {
    if (!file) return;

    setError("");
    setResult(null);
    setFileName(file.name);

    if (!file.name.toLowerCase().endsWith(".json")) {
      setError("Please upload an OpenAPI/Swagger JSON file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) =>
      setSpecification(String(event.target?.result || ""));

    reader.onerror = () =>
      setError("Unable to read the selected file.");

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
      setError("Upload or paste an OpenAPI/Swagger JSON specification.");
      return;
    }

    try {
      JSON.parse(specification);
    } catch {
      setError("The specification is not valid JSON.");
      return;
    }

    try {
      setLoading(true);

      const data = await importOpenApi({
        specification,
        collectionId,
        skipExisting: true,
      });

      setResult(data);
    } catch (err) {
      console.error("OpenAPI import error:", err);
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "OpenAPI import failed.";

      setError(backendMessage);
    }finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setSpecification("");
    setFileName("");
    setResult(null);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">
          OpenAPI Import
        </h1>
        <p className="mt-2 text-lg text-slate-500">
          Import Swagger/OpenAPI JSON and automatically create mock endpoints.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              OpenAPI / Swagger JSON
            </label>

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center hover:border-blue-400 hover:bg-blue-50"
            >
              <Upload size={36} className="mx-auto text-blue-600" />
              <p className="mt-3 font-semibold text-slate-800">
                {fileName || "Upload OpenAPI JSON"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Swagger 2.0 or OpenAPI 3.x JSON
              </p>
            </button>

            <input
              ref={fileRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Import Into Collection
            </label>

            <select
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select collection</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-slate-500">
              Imported endpoints will appear in API Builder.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Specification Preview
            </label>
            {specification && <Badge variant="success">JSON loaded</Badge>}
          </div>

          <textarea
            rows={18}
            value={specification}
            onChange={(e) => {
              setSpecification(e.target.value);
              setResult(null);
              setError("");
              setFileName("");
            }}
            placeholder={`Paste OpenAPI JSON here...\n\n{\n  "openapi": "3.0.0",\n  "info": { ... },\n  "paths": { ... }\n}`}
            className="w-full rounded-xl border border-slate-300 bg-slate-900 p-4 font-mono text-sm text-green-400 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {error && (
          <div className="mt-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={clear}>
            Clear
          </Button>

          <Button
            type="button"
            onClick={handleImport}
            disabled={loading || !specification.trim() || !collectionId}
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

      {result && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={22} className="text-green-600" />
                <h2 className="text-xl font-semibold">Import Complete</h2>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {result.title} · {result.version}
              </p>
            </div>

            <div className="flex gap-3">
              <Badge variant="success">
                {result.importedCount} Imported
              </Badge>
              <Badge variant="secondary">
                {result.skippedCount} Skipped
              </Badge>
            </div>
          </div>

          {result.importedEndpoints?.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="font-semibold">Imported Endpoints</h3>
              {result.importedEndpoints.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800"
                >
                  <FileJson size={16} />
                  {item}
                </div>
              ))}
            </div>
          )}

          {result.skippedEndpoints?.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="font-semibold">Skipped Endpoints</h3>
              {result.skippedEndpoints.map((item) => (
                <div
                  key={item}
                  className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600"
                >
                  {item}
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
            Imported endpoints are now available in API Builder, where you can
            configure responses, validation, authentication, scenarios, and
            other mock behavior.
          </div>
        </div>
      )}
    </div>
  );
}

export default OpenApiImport;