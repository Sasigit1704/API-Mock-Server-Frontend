import {
  Copy,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import { useState } from "react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

function ResponseViewer({
  response,
  onClear,
}) {
  const [copied, setCopied] = useState(false);

  const copyResponse = async () => {
    if (!response) return;

    await navigator.clipboard.writeText(
      JSON.stringify(response.body, null, 2)
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const getStatusColor = (status) => {
    if (status >= 500) {
      return "bg-red-100 text-red-700";
    }

    if (status >= 400) {
      return "bg-yellow-100 text-yellow-700";
    }

    if (status >= 300) {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-green-100 text-green-700";
  };

  const getStatusLabel = (status) => {
    if (status >= 500) return "Server Error";
    if (status >= 400) return "Client Error";
    if (status >= 300) return "Redirect";
    if (status >= 200) return "Success";
    return "Informational";
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Response
        </h2>

        {response && (
          <Button
            type="button"
            variant="secondary"
            onClick={onClear}
          >
            <X size={16} className="mr-2" />
            Clear
          </Button>
        )}
      </div>

      {!response ? (
        <div className="flex min-h-[500px] items-center justify-center text-center">
          <div>
            <AlertTriangle
              size={42}
              className="mx-auto text-slate-300"
            />

            <p className="mt-4 font-semibold text-slate-600">
              No Response Yet
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Select an endpoint and send a request to see the actual mock
              response.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {/* Response metadata */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div
              className={`rounded-xl p-4 ${getStatusColor(
                response.status
              )}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium">
                  Status
                </p>

                <Badge variant="secondary">
                  {getStatusLabel(response.status)}
                </Badge>
              </div>

              <p className="mt-2 text-2xl font-bold">
                {response.status}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-xs text-slate-500">
                Actual Response Time
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-700">
                {response.responseTime} ms
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 p-4">
              <p className="text-xs text-slate-500">
                Content Type
              </p>

              <p className="mt-2 font-semibold">
                application/json
              </p>
            </div>
          </div>

          {/* Body */}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle
                  size={18}
                  className="text-green-600"
                />

                <span className="font-semibold">
                  Response Body
                </span>
              </div>

              <Button
                type="button"
                variant="secondary"
                onClick={copyResponse}
              >
                <Copy
                  size={16}
                  className="mr-2"
                />

                {copied
                  ? "Copied"
                  : "Copy JSON"}
              </Button>
            </div>

            <pre className="max-h-[500px] overflow-auto rounded-xl bg-slate-900 p-5 text-sm text-green-400">
              {typeof response.body === "string"
                ? response.body
                : JSON.stringify(
                    response.body,
                    null,
                    2
                  )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResponseViewer;