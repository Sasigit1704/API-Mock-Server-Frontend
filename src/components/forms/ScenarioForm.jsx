import { useEffect, useState } from "react";
import { Save, X, Workflow } from "lucide-react";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

const getDefaultFormData = (endpointId) => ({
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

function ScenarioForm({
  scenario,
  endpointId,
  onSave,
  onCancel,
}) {
  const [formData, setFormData] = useState(
    getDefaultFormData(endpointId)
  );

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (scenario) {
      setFormData({
        ...scenario,
        mockEndpointId: endpointId,
      });
    } else {
      setFormData(
        getDefaultFormData(endpointId)
      );
    }

    setErrors({});
  }, [scenario, endpointId]);

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

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

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.scenarioName.trim()) {
      newErrors.scenarioName =
        "Scenario name is required.";
    }

    if (
      formData.statusCode < 100 ||
      formData.statusCode > 599
    ) {
      newErrors.statusCode =
        "Status code must be between 100 and 599.";
    }

    if (formData.delay < 0) {
      newErrors.delay =
        "Delay cannot be negative.";
    }

    if (
      formData.enableTimeout &&
      formData.timeoutDelay < 0
    ) {
      newErrors.timeoutDelay =
        "Timeout delay cannot be negative.";
    }

    if (
      formData.enableRandomFailure &&
      (formData.failureRate < 0 ||
        formData.failureRate > 100)
    ) {
      newErrors.failureRate =
        "Failure rate must be between 0 and 100%.";
    }

    setErrors(newErrors);

    return newErrors;
  };

  const scrollToFirstError = (
    validationErrors
  ) => {
    const firstErrorField =
      Object.keys(validationErrors)[0];

    if (!firstErrorField) {
      return;
    }

    const element =
      document.querySelector(
        `[name="${firstErrorField}"]`
      );

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      element.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors =
      validateForm();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      scrollToFirstError(
        validationErrors
      );
      return;
    }

    onSave({
      ...formData,
      scenarioName:
        formData.scenarioName.trim(),
      responseBody:
        formData.responseBody.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 sm:space-y-8"
    >
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3">
            <Workflow
              size={22}
              className="text-blue-600"
            />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {scenario
                ? "Edit Scenario"
                : "Create Scenario"}
            </h2>

            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Configure API simulation behaviour.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          {errors.scenarioName && (
            <p className="mt-2 text-sm text-red-600">
              {errors.scenarioName}
            </p>
          )}
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
            <option value="200">
              200 - OK
            </option>
            <option value="201">
              201 - Created
            </option>
            <option value="202">
              202 - Accepted
            </option>
            <option value="204">
              204 - No Content
            </option>
            <option value="400">
              400 - Bad Request
            </option>
            <option value="404">
              404 - Not Found
            </option>
            <option value="500">
              500 - Internal Server Error
            </option>
          </Select>

          {errors.statusCode && (
            <p className="mt-2 text-sm text-red-600">
              {errors.statusCode}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Delay (ms)
        </label>

        <Input
          type="number"
          name="delay"
          value={formData.delay}
          onChange={handleChange}
          min="0"
        />

        {errors.delay && (
          <p className="mt-2 text-sm text-red-600">
            {errors.delay}
          </p>
        )}
      </div>

      <div className="space-y-4 rounded-xl bg-slate-50 p-4 sm:p-5">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            name="enableTimeout"
            checked={formData.enableTimeout}
            onChange={handleChange}
            className="h-4 w-4 flex-shrink-0 rounded border-slate-300"
          />

          <span className="text-sm font-medium text-slate-800">
            Enable Timeout
          </span>
        </label>

        {formData.enableTimeout && (
          <div>
            <Input
              type="number"
              name="timeoutDelay"
              value={formData.timeoutDelay}
              onChange={handleChange}
              placeholder="Timeout Delay (ms)"
              min="0"
            />

            {errors.timeoutDelay && (
              <p className="mt-2 text-sm text-red-600">
                {errors.timeoutDelay}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4 rounded-xl bg-slate-50 p-4 sm:p-5">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            name="enableRandomFailure"
            checked={
              formData.enableRandomFailure
            }
            onChange={handleChange}
            className="h-4 w-4 flex-shrink-0 rounded border-slate-300"
          />

          <span className="text-sm font-medium text-slate-800">
            Enable Random Failure
          </span>
        </label>

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

            {errors.failureRate && (
              <p className="mt-2 text-sm text-red-600">
                {errors.failureRate}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 flex-shrink-0 rounded border-slate-300"
        />

        <span className="cursor-pointer text-sm font-medium text-slate-800">
          Active Scenario
        </span>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          <X
            size={18}
            className="mr-2"
          />
          Cancel
        </Button>

        <Button
          type="submit"
          className="w-full sm:w-auto"
        >
          <Save
            size={18}
            className="mr-2"
          />
          {scenario
            ? "Update Scenario"
            : "Save Scenario"}
        </Button>
      </div>
    </form>
  );
}

export default ScenarioForm;