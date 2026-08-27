import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Badge from "../ui/Badge";

function ResponseForm({
  endpointId,
  initialResponse = null,
  onSave,
  onCancel,
}) {
  const [form, setForm] = useState({
    responseName: "",
    statusCode: 200,
    responseBody: '{\n  "message": "Success"\n}',
    percentage: initialResponse?.percentage ?? 0,
    responseTimeMs: initialResponse?.responseTimeMs ?? 0,
    isActive: false,
  });

  const [errors, setErrors] = useState({});

  const isEditing = initialResponse !== null;

  useEffect(() => {
    if (initialResponse) {
      setForm({
        responseName:
          initialResponse.responseName || "",

        statusCode:
          initialResponse.statusCode || 200,

        responseBody:
          initialResponse.responseBody || "",

        percentage:
          initialResponse?.percentage ?? 0,

        responseTimeMs:
          initialResponse?.responseTimeMs ?? 0,

        isActive:
          initialResponse.isActive ?? false,
      });
    } else {
      setForm({
        responseName: "",
        statusCode: 200,
        responseBody:
          '{\n  "message": "Success"\n}',
        percentage: 0,
        responseTimeMs: 0,
        isActive: false,
      });
    }

    setErrors({});
  }, [initialResponse]);

  const isValidJson = (body) => {
    if (!body.trim()) {
      return false;
    }

    try {
      JSON.parse(body);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.responseName.trim()) {
      newErrors.responseName =
        "Response name is required.";
    }

    if (!data.responseBody.trim()) {
      newErrors.responseBody =
        "Response body is required.";
    } else if (!isValidJson(data.responseBody)) {
      newErrors.responseBody =
        "Response body must contain valid JSON.";
    }

    const statusCode = Number(data.statusCode);

    if (
      Number.isNaN(statusCode) ||
      statusCode < 100 ||
      statusCode > 599
    ) {
      newErrors.statusCode =
        "Status code must be between 100 and 599.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const scrollToFirstError = (validationErrors) => {
    const firstErrorField =
      Object.keys(validationErrors)[0];

    if (!firstErrorField) {
      return;
    }

    const element = document.querySelector(
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

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    const updatedForm = {
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    };

    setForm(updatedForm);

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(form)) {
      const currentErrors = {};

      if (!form.responseName.trim()) {
        currentErrors.responseName =
          "Response name is required.";
      }

      if (!form.responseBody.trim()) {
        currentErrors.responseBody =
          "Response body is required.";
      } else if (!isValidJson(form.responseBody)) {
        currentErrors.responseBody =
          "Response body must contain valid JSON.";
      }

      const statusCode = Number(form.statusCode);

      if (
        Number.isNaN(statusCode) ||
        statusCode < 100 ||
        statusCode > 599
      ) {
        currentErrors.statusCode =
          "Status code must be between 100 and 599.";
      }

      scrollToFirstError(currentErrors);
      return;
    }

    const percentage = Number(form.percentage);

    if (
      Number.isNaN(percentage) ||
      percentage < 0 ||
      percentage > 100
    ) {
      const validationErrors = {
        percentage:
          "Response percentage must be between 0 and 100.",
      };

      setErrors((prev) => ({
        ...prev,
        ...validationErrors,
      }));

      scrollToFirstError(validationErrors);
      return;
    }

    const responseTimeMs =
      Number(form.responseTimeMs);

    if (
      Number.isNaN(responseTimeMs) ||
      responseTimeMs < 0 ||
      responseTimeMs > 300000
    ) {
      const validationErrors = {
        responseTimeMs:
          "Response time must be between 0 and 300000 milliseconds.",
      };

      setErrors((prev) => ({
        ...prev,
        ...validationErrors,
      }));

      scrollToFirstError(validationErrors);
      return;
    }

    await onSave({
      mockEndpointId: endpointId,
      responseName: form.responseName.trim(),
      statusCode: Number(form.statusCode),
      responseBody: form.responseBody,
      percentage,
      responseTimeMs,
      isActive: form.isActive,
    });
  };

  const jsonIsValid = isValidJson(
    form.responseBody
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-semibold text-slate-900">
          {isEditing
            ? "Edit Response"
            : "Add Response"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Configure the response returned by this mock endpoint.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Response Name
        </label>

        <Input
          name="responseName"
          value={form.responseName}
          onChange={handleChange}
          placeholder="e.g. Success Response"
        />

        {errors.responseName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.responseName}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          HTTP Status Code
        </label>

        <Input
          type="number"
          name="statusCode"
          value={form.statusCode}
          onChange={handleChange}
          placeholder="200"
        />

        {errors.statusCode && (
          <p className="mt-1 text-sm text-red-600">
            {errors.statusCode}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Response Percentage
        </label>

        <div className="flex items-center gap-2">
          <Input
            type="number"
            name="percentage"
            value={form.percentage}
            onChange={handleChange}
            min="0"
            max="100"
            step="0.01"
            placeholder="0"
          />

          <span className="text-sm font-medium text-slate-500">
            %
          </span>
        </div>
        {errors.percentage && (
          <p className="mt-1 text-sm text-red-600">
            {errors.percentage}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Response Time
        </label>

        <div className="flex items-center gap-2">
          <Input
            type="number"
            name="responseTimeMs"
            value={form.responseTimeMs}
            onChange={handleChange}
            min="0"
            max="300000"
            step="1"
            placeholder="0"
          />

          <span className="text-sm font-medium text-slate-500">
            ms
          </span>
        </div>
        {errors.responseTimeMs && (
          <p className="mt-1 text-sm text-red-600">
            {errors.responseTimeMs}
          </p>
        )}
      </div>

      <div>
        <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Response Body
            </label>
          </div>

          <Badge
            variant={
              jsonIsValid
                ? "success"
                : "error"
            }
          >
            {jsonIsValid
              ? "Valid JSON"
              : "Invalid JSON"}
          </Badge>
        </div>

        <textarea
          name="responseBody"
          value={form.responseBody}
          onChange={handleChange}
          rows={12}
          placeholder={`{\n  "message": "Success"\n}`}
          className={`w-full rounded-xl border bg-white p-4 font-mono text-sm outline-none transition ${
            errors.responseBody
              ? "border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          }`}
        />

        {errors.responseBody && (
          <p className="mt-2 text-sm text-red-600">
            {errors.responseBody}
          </p>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">
            Response Preview
          </label>

          <Badge variant="info">
            Preview
          </Badge>
        </div>

        <div className="min-h-[180px] overflow-auto rounded-xl bg-slate-900 p-4">
          {jsonIsValid ? (
            <pre className="whitespace-pre-wrap break-words font-mono text-sm text-green-300">
              {JSON.stringify(
                JSON.parse(
                  form.responseBody
                ),
                null,
                2
              )}
            </pre>
          ) : (
            <div className="flex min-h-[150px] items-center justify-center">
              <div className="text-center">
                <p className="font-semibold text-red-400">
                  Invalid JSON
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Enter valid JSON to see the response preview.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300 flex-shrink-0"
          />

          <div>
            <p className="text-sm font-medium text-slate-800">
              Make this the active response
            </p>
          </div>
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>

        <Button type="submit" className="w-full sm:w-auto">
          {isEditing
            ? "Update Response"
            : "Add Response"}
        </Button>
      </div>
    </form>
  );
}

export default ResponseForm;