import { useEffect, useState } from "react";
import { Save, X, Workflow } from "lucide-react";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

function ScenarioForm({
  scenario,
  endpointId,
  onSave,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    mockEndpointId: endpointId,
    scenarioName: "",
    statusCode: 200,
    responseBody: "",
    delay: 0,
    isActive: true,
    enableRandomFailure: false,
    failureRate: 0,
    enableTimeout: false,
    timeoutDelay: 0,
  });

  useEffect(() => {
    if (scenario) {
      setFormData({
        ...scenario,
        mockEndpointId: endpointId,
      });
    } else {
      setFormData({
        mockEndpointId: endpointId,
        scenarioName: "",
        statusCode: 200,
        responseBody: "",
        delay: 0,
        isActive: true,
        enableRandomFailure: false,
        failureRate: 0,
        enableTimeout: false,
        timeoutDelay: 0,
      });
    }
  }, [scenario, endpointId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const numericFields = [
      "statusCode",
      "delay",
      "timeoutDelay",
      "failureRate",
    ];

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : numericFields.includes(name)
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.scenarioName.trim()) {
      alert("Please enter a scenario name.");
      return;
    }

    if (!formData.responseBody.trim()) {
      alert("Please enter a response body.");
      return;
    }

    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Header */}

      <div className="border-b border-slate-200 pb-5">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-blue-100 p-3">
            <Workflow
              size={22}
              className="text-blue-600"
            />
          </div>

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              {scenario
                ? "Edit Scenario"
                : "Create Scenario"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Configure API simulation behaviour.
            </p>

          </div>

        </div>

      </div>

      {/* General */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Scenario Name
          </label>

          <Input
            name="scenarioName"
            value={formData.scenarioName}
            onChange={handleChange}
            placeholder="Happy Path"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status Code
          </label>

          <Select
            name="statusCode"
            value={formData.statusCode}
            onChange={handleChange}
          >
            <option value="200">200 - OK</option>
            <option value="201">201 - Created</option>
            <option value="202">202 - Accepted</option>
            <option value="204">204 - No Content</option>
            <option value="206">206 - Partial Content</option>
            <option value="400">400 - Bad Request</option>
            <option value="401">401 - Unauthorized</option>
            <option value="402">402 - Payment Required</option>
            <option value="403">403 - Forbidden</option>
            <option value="404">404 - Not Found</option>
            <option value="405">405 - Method Not Allowed</option>
            <option value="406">406 - Not Acceptable</option>
            <option value="408">408 - Request Timeout</option>
            <option value="409">409 - Conflict</option>
            <option value="410">410 - Gone</option>
            <option value="415">415 - Unsupported Media Type</option>
            <option value="422">422 - Unprocessable Entity</option>
            <option value="423">423 - Locked</option>
            <option value="429">429 - Too Many Requests</option>
            <option value="500">500 - Internal Server Error</option>
            <option value="502">502 - Bad Gateway</option>
            <option value="503">503 - Service Unavailable</option>
            <option value="504">504 - Gateway Timeout</option>
          </Select>

        </div>

      </div>

      {/* Response */}

      <div>

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Response Body
        </label>

        <textarea
          rows={10}
          name="responseBody"
          value={formData.responseBody}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
          placeholder={`{
  "message":"Success"
}`}
        />

      </div>

      {/* Delay */}

      <div>

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Delay (ms)
        </label>

        <Input
          type="number"
          name="delay"
          value={formData.delay}
          onChange={handleChange}
        />

      </div>

      {/* Timeout */}

      <div className="space-y-4 rounded-xl bg-slate-50 p-5">

        <div className="flex items-center gap-3">

          <input
            type="checkbox"
            name="enableTimeout"
            checked={formData.enableTimeout}
            onChange={handleChange}
          />

          <label>
            Enable Timeout
          </label>

        </div>

        {formData.enableTimeout && (

          <Input
            type="number"
            name="timeoutDelay"
            value={formData.timeoutDelay}
            onChange={handleChange}
            placeholder="Timeout Delay (ms)"
          />

        )}

      </div>

      {/* Random Failure */}

      <div className="space-y-4 rounded-xl bg-slate-50 p-5">

        <div className="flex items-center gap-3">

          <input
            type="checkbox"
            name="enableRandomFailure"
            checked={formData.enableRandomFailure}
            onChange={handleChange}
          />

          <label>
            Enable Random Failure
          </label>

        </div>

        {formData.enableRandomFailure && (

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Failure Rate (%)
            </label>

            <input
              type="range"
              min="0"
              max="100"
              name="failureRate"
              value={formData.failureRate}
              onChange={handleChange}
              className="w-full"
            />

            <p className="mt-2 text-sm text-slate-500">
              {formData.failureRate}%
            </p>

          </div>

        )}

      </div>

      {/* Active */}

      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">

        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
        />

        <label>
          Active Scenario
        </label>

      </div>

      {/* Footer */}

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">

        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          <X size={18} />
          Cancel
        </Button>

        <Button type="submit">
          <Save size={18} />
          {scenario ? "Update Scenario" : "Save Scenario"}
        </Button>

      </div>

    </form>
  );
}

export default ScenarioForm;