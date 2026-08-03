import {
  Activity,
  CheckCircle2,
  XCircle,
  Timer,
} from "lucide-react";

function RequestHistoryStats({ logs }) {
  const totalRequests = logs.length;

  const successfulRequests = logs.filter(
    (log) => log.statusCode < 400
  ).length;

  const failedRequests = logs.filter(
    (log) => log.statusCode >= 400
  ).length;

  const averageResponseTime =
    totalRequests === 0
      ? 0
      : Math.round(
          logs.reduce(
            (sum, log) => sum + log.responseTimeMs,
            0
          ) / totalRequests
        );

  const cards = [
    {
      title: "Total Requests",
      value: totalRequests,
      icon: Activity,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Successful",
      value: successfulRequests,
      icon: CheckCircle2,
      bg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Failed",
      value: failedRequests,
      icon: XCircle,
      bg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Avg Response",
      value: `${averageResponseTime} ms`,
      icon: Timer,
      bg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {card.value}
                </h2>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg}`}
              >
                <Icon
                  size={28}
                  className={card.iconColor}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RequestHistoryStats;