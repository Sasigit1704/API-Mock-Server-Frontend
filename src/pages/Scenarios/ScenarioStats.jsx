import {
  Activity,
  CheckCircle2,
  Timer,
  AlertTriangle,
} from "lucide-react";

function ScenarioStats({
  scenarios,
  activeScenario,
}) {
  const totalScenarios = scenarios.length;

  const delayEnabled = scenarios.filter(
    (scenario) => scenario.delay > 0
  ).length;

  const failureEnabled = scenarios.filter(
    (scenario) => scenario.enableRandomFailure
  ).length;

  const stats = [
    {
      title: "Total Scenarios",
      value: totalScenarios,
      icon: Activity,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Active Scenario",
      value: activeScenario
        ? activeScenario.scenarioName
        : "None",
      icon: CheckCircle2,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Delay Enabled",
      value: delayEnabled,
      icon: Timer,
      color: "bg-amber-100 text-amber-600",
    },
    {
      title: "Failure Enabled",
      value: failureEnabled,
      icon: AlertTriangle,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <h3 className="mt-3 text-3xl font-bold text-slate-900 break-words">
                  {stat.value}
                </h3>

              </div>

              <div
                className={`rounded-xl p-3 ${stat.color}`}
              >
                <Icon size={24} />
              </div>

            </div>
          </div>
        );
      })}

    </div>
  );
}

export default ScenarioStats;