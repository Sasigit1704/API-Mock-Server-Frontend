import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";

function RequestDetailsModal({
    open,
    log,
    onClose,
}) {
    if (!log) return null;

    const getMethodVariant = (method) => {
        switch (method) {
            case "GET":
                return "info";
            case "POST":
                return "success";
            case "PUT":
                return "warning";
            case "PATCH":
                return "secondary";
            case "DELETE":
                return "error";
            default:
                return "secondary";
        }
    };

    const getStatusVariant = (status) => {
        if (status >= 500) return "error";
        if (status >= 400) return "warning";
        if (status >= 300) return "info";
        return "success";
    };

    return (
        <Modal
            open={open}
            title="Request Details"
            onClose={onClose}
        >
            <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 p-4 sm:p-5">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">
                        Request Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-slate-500">Method</p>
                            <div className="mt-1">
                                <Badge variant={getMethodVariant(log.method)}>
                                    {log.method}
                                </Badge>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">Status</p>
                            <div className="mt-1">
                                <Badge variant={getStatusVariant(log.statusCode)}>
                                    {log.statusCode}
                                </Badge>
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <p className="text-sm text-slate-500">Path</p>
                            <p className="mt-1 rounded-lg bg-slate-100 p-2 font-mono text-xs sm:text-sm break-all">
                                {log.path}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">Endpoint</p>
                            <p className="font-medium mt-1">
                                {log.endpointName || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">Scenario</p>
                            <p className="font-medium mt-1">
                                {log.scenarioName || "Default Response"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4 sm:p-5">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">
                        Response Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-slate-500">Response Time</p>
                            <p className="font-medium mt-1">
                                {log.responseTimeMs} ms
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">Executed At</p>
                            <p className="font-medium mt-1">
                                {new Date(log.requestTime).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4 sm:p-5">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">
                        Client Information
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-slate-500">IP Address</p>
                            <p className="font-medium mt-1">
                                {log.ipAddress}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">User Agent</p>
                            <p className="break-all rounded-lg bg-slate-100 p-3 text-xs sm:text-sm mt-1">
                                {log.userAgent}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default RequestDetailsModal;