import { useState, useEffect } from "react";
import {
  Save,
  X,
  Lock,
  AlertTriangle,
} from "lucide-react";

import ValidationRuleForm from "./ValidationRuleForm";
import ValidationRulesTable from "./ValidationRulesTable";

import { generateValidationRules } from "../../utils/generateValidationRules";

import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

function EndpointForm({
  onSave,
  onCancel,
  collections,
  endpoint,
}) {
  const [formData, setFormData] =
    useState({
      name: "",
      method: "GET",
      path: "",
      statusCode: 200,

      requestSchema: "",

      responseBody: "",

      validationRules: [],

      collectionId: "",

      enablePercentageBasedResponses:
        false,

      enableInputErrors: true,

      enableProcessErrors: false,
      processErrors: [],

      enableRateLimiting: false,
      rateLimitRequests: 10,
      rateLimitWindowSeconds: 60,
      rateLimitStatusCode: 429,
      rateLimitResponseBody: "{\n  \"message\": \"Rate limit exceeded.\"\n}",

      enableMalformedJson: false,
      malformedJsonStatusCode: 500,
      malformedJsonResponseBody: "{\n  \"error\": \"Malformed response\"",

      isEnabled: true,

      requiresAuthentication: false,
      authenticationToken: "",
    });

  const [errors, setErrors] =
    useState({});

  const [parsedFields, setParsedFields] =
    useState([]);

  const [editingRuleIndex, setEditingRuleIndex] =
    useState(null);

  const validateForm = (
    data = formData
  ) => {
    const newErrors = {};

    if (!data.name.trim()) {
      newErrors.name =
        "Endpoint name is required.";
    }

    if (!data.path.trim()) {
      newErrors.path =
        "Endpoint path is required.";
    } else if (
      !data.path.startsWith("/")
    ) {
      newErrors.path =
        "Path must start with '/'.";
    }

    if (!data.collectionId) {
      newErrors.collectionId =
        "Please select a collection.";
    }

    if (
      Number(data.statusCode) < 100 ||
      Number(data.statusCode) > 599
    ) {
      newErrors.statusCode =
        "Status code must be between 100 and 599.";
    }

    if (!data.responseBody.trim()) {
      newErrors.responseBody =
        "Response body is required.";
    } else {
      try {
        JSON.parse(
          data.responseBody
        );
      } catch {
        newErrors.responseBody =
          "Response body must be valid JSON.";
      }
    }

    if (data.enableRateLimiting) {
      if (Number(data.rateLimitRequests) <= 0) {
        newErrors.rateLimitRequests =
          "Requests allowed must be greater than 0.";
      }

      if (Number(data.rateLimitWindowSeconds) <= 0) {
        newErrors.rateLimitWindowSeconds =
          "Time window must be greater than 0 seconds.";
      }

      if (
        Number(data.rateLimitStatusCode) < 100 ||
        Number(data.rateLimitStatusCode) > 599
      ) {
        newErrors.rateLimitStatusCode =
          "Rate limit status code must be between 100 and 599.";
      }

      if (!data.rateLimitResponseBody?.trim()) {
        newErrors.rateLimitResponseBody =
          "Rate limit response body is required.";
      } else {
        try {
          JSON.parse(data.rateLimitResponseBody);
        } catch {
          newErrors.rateLimitResponseBody =
            "Rate limit response body must be valid JSON.";
        }
      }
    }

    if (data.enableMalformedJson) {
      if (
        Number(data.malformedJsonStatusCode) < 100 ||
        Number(data.malformedJsonStatusCode) > 599
      ) {
        newErrors.malformedJsonStatusCode =
          "Malformed JSON status code must be between 100 and 599.";
      }

      if (!data.malformedJsonResponseBody?.trim()) {
        newErrors.malformedJsonResponseBody =
          "Malformed JSON response body is required.";
      }
    }

    if (
      data.requiresAuthentication &&
      !data.authenticationToken.trim()
    ) {
      newErrors.authenticationToken =
        "Authentication token is required when authentication is enabled.";
    }

    setErrors(newErrors);

    return newErrors;
  };

  const scrollToFirstError = (validationErrors) => {
    const firstErrorField = Object.keys(validationErrors)[0];

    if (!firstErrorField) return;

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

  const applyGeneratedRules = (
    schema,
    currentRules = []
  ) => {
    if (
      typeof schema !== "string" ||
      !schema.trim()
    ) {
      setParsedFields([]);
      return currentRules;
    }

    const generatedRules =
      generateValidationRules(schema);

    setParsedFields(
      generatedRules.map((rule) => ({
        fieldPath: rule.fieldPath,
        dataType: rule.dataType,
        isRequired: rule.isRequired,
      }))
    );

    return generatedRules.map(
      (generatedRule) => {
        const existingRule =
          currentRules.find(
            (rule) =>
              rule.fieldPath ===
              generatedRule.fieldPath
          );

        return existingRule
          ? {
              ...generatedRule,
              ...existingRule,
              dataType:
                generatedRule.dataType,
              isRequired:
                generatedRule.isRequired,
            }
          : generatedRule;
      }
    );
  };

  useEffect(() => {
    if (!endpoint) {
      return;
    }

    const endpointData = {
      ...endpoint,

      validationRules:
        endpoint.validationRules ||
        [],

      enablePercentageBasedResponses:
        endpoint
          .enablePercentageBasedResponses ??
        false,

      enableInputErrors:
        endpoint.enableInputErrors ??
        true,

      enableProcessErrors:
        endpoint.enableProcessErrors ??
        false,

      processErrors:
        endpoint.processErrors ||
        [],

      enableRateLimiting:
        endpoint.enableRateLimiting ??
        false,

      rateLimitRequests:
        endpoint.rateLimitRequests ??
        10,

      rateLimitWindowSeconds:
        endpoint.rateLimitWindowSeconds ??
        60,

      rateLimitStatusCode:
        endpoint.rateLimitStatusCode ??
        429,

      rateLimitResponseBody:
        endpoint.rateLimitResponseBody ||
        "{\n  \"message\": \"Rate limit exceeded.\"\n}",

      enableMalformedJson:
        endpoint.enableMalformedJson ?? false,

      malformedJsonStatusCode:
        endpoint.malformedJsonStatusCode ?? 500,

      malformedJsonResponseBody:
        endpoint.malformedJsonResponseBody ||
        "{\n  \"error\": \"Malformed response\"",

      requiresAuthentication:
        endpoint
          .requiresAuthentication ??
        false,

      authenticationToken:
        endpoint.authenticationToken ||
        "",
    };

    if (endpoint.requestSchema) {
      endpointData.validationRules =
        applyGeneratedRules(
          endpoint.requestSchema,
          endpointData.validationRules
        );
    } else {
      setParsedFields([]);
    }

    setFormData(endpointData);
  }, [endpoint]);

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    const updatedFormData = {
      ...formData,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    };

    if (
      name === "requestSchema"
    ) {
      try {
        JSON.parse(value);

        updatedFormData.validationRules =
          applyGeneratedRules(
            value,
            formData.validationRules ||
              []
          );
      } catch {
        setParsedFields([]);
      }
    }

    setFormData(
      updatedFormData
    );

    validateForm(
      updatedFormData
    );
  };

  const handleAddRule = (
    rule
  ) => {
    setFormData(
      (prev) => {
        const existingIndex =
          prev.validationRules.findIndex(
            (existingRule) =>
              existingRule.fieldPath ===
              rule.fieldPath
          );

        if (existingIndex !== -1) {
          const updatedRules = [
            ...prev.validationRules,
          ];

          updatedRules[
            existingIndex
          ] = rule;

          return {
            ...prev,
            validationRules:
              updatedRules,
          };
        }

        return {
          ...prev,

          validationRules: [
            ...prev.validationRules,
            rule,
          ],
        };
      }
    );
  };

  const handleEditRule = (
    index
  ) => {
    setEditingRuleIndex(index);
  };

  const handleUpdateRule = (
    updatedRule
  ) => {
    setFormData(
      (prev) => ({
        ...prev,

        validationRules:
          prev.validationRules.map(
            (rule, index) =>
              index ===
              editingRuleIndex
                ? updatedRule
                : rule
          ),
      })
    );

    setEditingRuleIndex(null);
  };

  const handleCancelEditRule =
    () => {
      setEditingRuleIndex(null);
    };

  const handleDeleteRule = (
    index
  ) => {
    setFormData(
      (prev) => ({
        ...prev,

        validationRules:
          prev.validationRules.filter(
            (_, ruleIndex) =>
              ruleIndex !== index
          ),
      })
    );
  };

  const isValidJson = () => {
    if (
      !formData.responseBody.trim()
    ) {
      return false;
    }

    try {
      JSON.parse(
        formData.responseBody
      );

      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        scrollToFirstError(validationErrors);
        return;
      }

    onSave({
      ...formData,

      statusCode:
        Number(
          formData.statusCode
        ),

      requiresAuthentication:
        Boolean(
          formData.requiresAuthentication
        ),

      enableInputErrors:
        Boolean(
          formData.enableInputErrors
        ),

      enablePercentageBasedResponses:
        Boolean(
          formData
            .enablePercentageBasedResponses
        ),

      enableProcessErrors:
        Boolean(
          formData.enableProcessErrors
        ),

      processErrors:
        formData.processErrors || [],

      enableRateLimiting:
        Boolean(
          formData.enableRateLimiting
        ),

      rateLimitRequests:
        Number(
          formData.rateLimitRequests
        ),

      rateLimitWindowSeconds:
        Number(
          formData.rateLimitWindowSeconds
        ),

      rateLimitStatusCode:
        Number(
          formData.rateLimitStatusCode
        ),

      rateLimitResponseBody:
        formData.rateLimitResponseBody || "",

      enableMalformedJson:
        Boolean(formData.enableMalformedJson),

      malformedJsonStatusCode:
        Number(formData.malformedJsonStatusCode),

      malformedJsonResponseBody:
        formData.malformedJsonResponseBody || "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 sm:space-y-8"
    >
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Endpoint Configuration
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Configure the mock endpoint and its request and response behavior.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Endpoint Name
        </label>

        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Get User"
        />

        {errors.name && (
          <p className="mt-2 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            HTTP Method
          </label>

          <Select
            name="method"
            value={formData.method}
            onChange={handleChange}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Endpoint Path
          </label>

          <Input
            name="path"
            value={formData.path}
            onChange={handleChange}
            placeholder="/users"
          />

          {errors.path && (
            <p className="mt-2 text-sm text-red-600">
              {errors.path}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            HTTP Status Code
          </label>

          <Input
            type="number"
            name="statusCode"
            value={formData.statusCode}
            onChange={handleChange}
          />

          {errors.statusCode && (
            <p className="mt-2 text-sm text-red-600">
              {errors.statusCode}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Collection
          </label>

          <Select
            name="collectionId"
            value={
              formData.collectionId
            }
            onChange={handleChange}
          >
            <option value="">
              Select Collection
            </option>

            {collections.map(
              (collection) => (
                <option
                  key={collection.id}
                  value={
                    collection.id
                  }
                >
                  {collection.name}
                </option>
              )
            )}
          </Select>

          {errors.collectionId && (
            <p className="mt-2 text-sm text-red-600">
              {errors.collectionId}
            </p>
          )}
        </div>
      </div>

      <div>
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-slate-900">
            Request Schema
          </h3>

          <p className="text-sm text-slate-500">
            Define the expected request JSON structure. JSON Schema with type/properties/required is supported, and normal sample JSON is also supported.
          </p>
        </div>

        <textarea
          name="requestSchema"
          value={
            formData.requestSchema
          }
          onChange={handleChange}
          rows={8}
          placeholder={`JSON Schema:
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "integer" }
  },
  "required": ["name"]
}`}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-amber-100 p-2">
            <AlertTriangle
              size={20}
              className="text-amber-600"
            />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">
              Input Errors
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Control whether this endpoint validates incoming request data using the configured request schema and validation rules.
            </p>
          </div>
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="enableInputErrors"
            checked={
              formData.enableInputErrors
            }
            onChange={handleChange}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 flex-shrink-0"
          />

          <div>
            <p className="text-sm font-medium text-slate-800">
              Enable Input Errors
            </p>

            <p className="mt-1 text-xs text-slate-500">
              When enabled, invalid request input follows the configured validation rules and validation error responses.
            </p>
          </div>
        </label>

        <div className="mt-4">
          <Badge
            variant={
              formData.enableInputErrors
                ? "warning"
                : "secondary"
            }
          >
            {formData.enableInputErrors
              ? "Input validation enabled"
              : "Input validation disabled"}
          </Badge>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Validation Rules
          </h3>

          <p className="text-sm text-slate-500">
            Configure request validation rules for this endpoint.
          </p>
        </div>

        <ValidationRuleForm
          fields={parsedFields}
          onAdd={handleAddRule}
          initialRule={
            editingRuleIndex !== null
              ? formData
                  .validationRules[
                  editingRuleIndex
                ]
              : null
          }
          onUpdate={
            handleUpdateRule
          }
          onCancelEdit={
            handleCancelEditRule
          }
        />

        <ValidationRulesTable
          rules={
            formData.validationRules
          }
          onEdit={
            handleEditRule
          }
          onDelete={
            handleDeleteRule
          }
        />
      </div>

      <div>
        <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <label className="text-sm font-medium text-slate-700">
            Default Response Body
          </label>

          <Badge
            variant={
              isValidJson()
                ? "success"
                : "error"
            }
          >
            {isValidJson()
              ? "Valid JSON"
              : "Invalid JSON"}
          </Badge>
        </div>

        <textarea
          name="responseBody"
          value={
            formData.responseBody
          }
          onChange={handleChange}
          rows={10}
          placeholder={`{\n  "message": "Success"\n}`}
          className={`w-full rounded-xl border px-4 py-3 font-mono text-sm transition focus:outline-none focus:ring-4 ${
            errors.responseBody
              ? "border-red-500 focus:ring-red-100"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
          }`}
        />

        {errors.responseBody && (
          <p className="mt-2 text-sm text-red-600">
            {errors.responseBody}
          </p>
        )}

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Response Preview
            </label>

            <Badge variant="info">
              Preview
            </Badge>
          </div>

          <div className="min-h-[220px] overflow-auto rounded-xl border border-slate-200 bg-slate-900 p-4">
            {isValidJson() ? (
              <pre className="whitespace-pre-wrap break-words font-mono text-sm text-green-300">
                {JSON.stringify(
                  JSON.parse(
                    formData.responseBody
                  ),
                  null,
                  2
                )}
              </pre>
            ) : (
              <div className="flex h-[180px] items-center justify-center">
                <div className="text-center">
                  <p className="font-semibold text-red-400">
                    Invalid JSON
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Response preview will appear once the JSON is valid.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <div className="mb-4">
          <h3 className="font-semibold text-slate-900">
            Response Selection
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Choose how this endpoint selects its response.
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="enablePercentageBasedResponses"
            checked={
              formData
                .enablePercentageBasedResponses
            }
            onChange={handleChange}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 flex-shrink-0"
          />

          <div>
            <p className="text-sm font-medium text-slate-700">
              Enable Percentage-Based Responses
            </p>

            <p className="mt-1 text-xs text-slate-500">
              When enabled, multiple active responses are selected according to their configured percentages.
            </p>
          </div>
        </label>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <div className="mb-4">
          <h3 className="font-semibold text-slate-900">
            Rate Limiting
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Simulate a request limit for this endpoint within a fixed time window.
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="enableRateLimiting"
            checked={formData.enableRateLimiting}
            onChange={handleChange}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 flex-shrink-0"
          />
          <div>
            <p className="text-sm font-medium text-slate-800">
              Enable Rate Limiting
            </p>
            <p className="mt-1 text-xs text-slate-500">
              After the configured number of requests, further requests receive rate limits.
            </p>
          </div>
        </label>

        {formData.enableRateLimiting && (
          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Requests Allowed
                </label>
                <Input
                  type="number"
                  min="1"
                  name="rateLimitRequests"
                  value={formData.rateLimitRequests}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Window (seconds)
                </label>
                <Input
                  type="number"
                  min="1"
                  name="rateLimitWindowSeconds"
                  value={formData.rateLimitWindowSeconds}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Limit Status Code
                </label>
                <Input
                  type="number"
                  min="100"
                  max="599"
                  name="rateLimitStatusCode"
                  value={formData.rateLimitStatusCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Rate Limit Response Body
              </label>
              <textarea
                name="rateLimitResponseBody"
                value={formData.rateLimitResponseBody}
                onChange={handleChange}
                rows={5}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <div className="mb-4 flex items-start gap-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <Lock
              size={20}
              className="text-blue-600"
            />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Authentication
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Optionally require an authentication token before this endpoint can be accessed.
            </p>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            name="requiresAuthentication"
            checked={
              formData
                .requiresAuthentication
            }
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 flex-shrink-0"
          />

          <span className="text-sm font-medium text-slate-700">
            Require Authentication Token
          </span>
        </label>

        {formData
          .requiresAuthentication && (
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Authentication Token
            </label>

            <Input
              type="password"
              name="authenticationToken"
              value={
                formData
                  .authenticationToken
              }
              onChange={handleChange}
              placeholder="Enter authentication token"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
        <input
          id="enabled"
          type="checkbox"
          name="isEnabled"
          checked={
            formData.isEnabled
          }
          onChange={handleChange}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 flex-shrink-0"
        />

        <label
          htmlFor="enabled"
          className="text-sm font-medium text-slate-700 cursor-pointer"
        >
          Endpoint Enabled
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          <X size={18} className="mr-2" />
          Cancel
        </Button>

        <Button type="submit" className="w-full sm:w-auto">
          <Save size={18} className="mr-2" />
          {endpoint
            ? "Update Endpoint"
            : "Save Endpoint"}
        </Button>
      </div>
    </form>
  );
}

export default EndpointForm;