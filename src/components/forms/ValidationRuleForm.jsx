import { useEffect, useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

const emptyRule = {
  fieldPath: "",
  dataType: "String",
  isRequired: true,
  minLength: "",
  maxLength: "",
  minValue: "",
  maxValue: "",
  pattern: "",
  errorResponses: [],
};

function ValidationRuleForm({
  fields,
  onAdd,
  initialRule = null,
  onUpdate,
  onCancelEdit,
}) {
  const [rule, setRule] = useState(emptyRule);
  const [errors, setErrors] = useState({});

  const isEditing = initialRule !== null;

  const normalizedFields = (fields || [])
    .map((field) => {
      if (typeof field === "string") {
        return {
          fieldPath: field,
          dataType: "String",
          isRequired: true,
        };
      }

      return {
        fieldPath: field.fieldPath || "",
        dataType: field.dataType || "String",
        isRequired: field.isRequired ?? false,
      };
    })
    .filter((field) => field.fieldPath);

  const getFieldMetadata = (fieldPath) =>
    normalizedFields.find(
      (field) => field.fieldPath === fieldPath
    );

  const getValidationTypes = (currentRule) => {
    const types = [];

    if (currentRule.isRequired) {
      types.push("Required");
    }

    types.push("Type");

    if (currentRule.dataType === "String") {
      if (
        currentRule.minLength !== "" &&
        currentRule.minLength !== null
      ) {
        types.push("MinLength");
      }

      if (
        currentRule.maxLength !== "" &&
        currentRule.maxLength !== null
      ) {
        types.push("MaxLength");
      }

      if (
        currentRule.pattern &&
        currentRule.pattern.trim() !== ""
      ) {
        types.push("Pattern");
      }
    }

    if (currentRule.dataType === "Number") {
      if (
        currentRule.minValue !== "" &&
        currentRule.minValue !== null
      ) {
        types.push("MinValue");
      }

      if (
        currentRule.maxValue !== "" &&
        currentRule.maxValue !== null
      ) {
        types.push("MaxValue");
      }
    }

    return types;
  };

  const createEmptyErrorResponse = (
    validationType
  ) => ({
    validationType,
    statusCode: 422,
    responseBody: "",
    isEnabled: true,
  });

  useEffect(() => {
    if (initialRule) {
      setRule({
        fieldPath: initialRule.fieldPath || "",
        dataType:
          initialRule.dataType || "String",
        isRequired:
          initialRule.isRequired ?? true,
        minLength:
          initialRule.minLength ?? "",
        maxLength:
          initialRule.maxLength ?? "",
        minValue:
          initialRule.minValue ?? "",
        maxValue:
          initialRule.maxValue ?? "",
        pattern:
          initialRule.pattern || "",
        errorResponses:
          initialRule.errorResponses || [],
      });
    } else {
      setRule(emptyRule);
    }

    setErrors({});
  }, [initialRule]);

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    if (name === "fieldPath") {
      const metadata =
        getFieldMetadata(value);

      setRule((prev) => ({
        ...prev,
        fieldPath: value,
        dataType:
          metadata?.dataType ||
          prev.dataType,
        isRequired:
          metadata?.isRequired ??
          prev.isRequired,
      }));

      if (errors.fieldPath) {
        setErrors((prev) => ({
          ...prev,
          fieldPath: "",
        }));
      }

      return;
    }

    setRule((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleErrorResponseChange = (
    validationType,
    field,
    value
  ) => {
    setRule((prev) => {
      const existing =
        prev.errorResponses || [];

      const index =
        existing.findIndex(
          (item) =>
            item.validationType ===
            validationType
        );

      if (index === -1) {
        return {
          ...prev,
          errorResponses: [
            ...existing,
            {
              ...createEmptyErrorResponse(
                validationType
              ),
              [field]: value,
            },
          ],
        };
      }

      const updated = [...existing];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        errorResponses: updated,
      };
    });
  };

  const getErrorResponse = (
    validationType
  ) => {
    return (
      rule.errorResponses?.find(
        (item) =>
          item.validationType ===
          validationType
      ) ||
      createEmptyErrorResponse(
        validationType
      )
    );
  };

  const handleRemoveErrorResponse = (
    validationType
  ) => {
    setRule((prev) => ({
      ...prev,
      errorResponses:
        (prev.errorResponses || []).filter(
          (item) =>
            item.validationType !==
            validationType
        ),
    }));
  };

  const prepareRule = () => {
    return {
      ...rule,

      minLength:
        rule.minLength === ""
          ? null
          : Number(rule.minLength),

      maxLength:
        rule.maxLength === ""
          ? null
          : Number(rule.maxLength),

      minValue:
        rule.minValue === ""
          ? null
          : Number(rule.minValue),

      maxValue:
        rule.maxValue === ""
          ? null
          : Number(rule.maxValue),

      errorResponses:
        (rule.errorResponses || []).filter(
          (response) =>
            response.responseBody &&
            response.responseBody.trim() !== ""
        ),
    };
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

  const handleSubmit = () => {
    const newErrors = {};

    if (!rule.fieldPath.trim()) {
      newErrors.fieldPath =
        "Please select a field.";
    }

    if (
      rule.dataType === "String" &&
      rule.minLength !== "" &&
      rule.maxLength !== "" &&
      Number(rule.minLength) >
        Number(rule.maxLength)
    ) {
      newErrors.minLength =
        "Minimum length cannot be greater than maximum length.";
    }

    if (
      rule.dataType === "Number" &&
      rule.minValue !== "" &&
      rule.maxValue !== "" &&
      Number(rule.minValue) >
        Number(rule.maxValue)
    ) {
      newErrors.minValue =
        "Minimum value cannot be greater than maximum value.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError(newErrors);
      return;
    }

    const preparedRule =
      prepareRule();

    if (isEditing) {
      onUpdate(preparedRule);
    } else {
      onAdd(preparedRule);
      setRule(emptyRule);
      setErrors({});
    }
  };

  const handleCancel = () => {
    setRule(emptyRule);
    setErrors({});

    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const validationTypes =
    getValidationTypes(rule);

  return (
    <div className="space-y-5 rounded-xl border bg-slate-50 p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Select
            name="fieldPath"
            value={rule.fieldPath}
            onChange={handleChange}
            disabled={isEditing}
          >
            <option value="">
              Select Field
            </option>

            {normalizedFields.map(
              (field) => (
                <option
                  key={field.fieldPath}
                  value={field.fieldPath}
                >
                  {field.fieldPath}
                </option>
              )
            )}
          </Select>

          {errors.fieldPath && (
            <p className="mt-2 text-sm text-red-600">
              {errors.fieldPath}
            </p>
          )}
        </div>

        <Select
          name="dataType"
          value={rule.dataType}
          onChange={handleChange}
        >
          <option value="String">
            String
          </option>
          <option value="Number">
            Number
          </option>
          <option value="Boolean">
            Boolean
          </option>
          <option value="Array">
            Array
          </option>
          <option value="Object">
            Object
          </option>
        </Select>
      </div>

      {rule.dataType === "String" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Input
              type="number"
              name="minLength"
              placeholder="Min Length"
              value={rule.minLength}
              onChange={handleChange}
            />

            {errors.minLength && (
              <p className="mt-2 text-sm text-red-600">
                {errors.minLength}
              </p>
            )}
          </div>

          <div>
            <Input
              type="number"
              name="maxLength"
              placeholder="Max Length"
              value={rule.maxLength}
              onChange={handleChange}
            />
          </div>
        </div>
      )}

      {rule.dataType === "Number" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Input
              type="number"
              name="minValue"
              placeholder="Min Value"
              value={rule.minValue}
              onChange={handleChange}
            />

            {errors.minValue && (
              <p className="mt-2 text-sm text-red-600">
                {errors.minValue}
              </p>
            )}
          </div>

          <div>
            <Input
              type="number"
              name="maxValue"
              placeholder="Max Value"
              value={rule.maxValue}
              onChange={handleChange}
            />
          </div>
        </div>
      )}

      {rule.dataType === "String" && (
        <Input
          name="pattern"
          placeholder="Regex Pattern (Optional)"
          value={rule.pattern}
          onChange={handleChange}
        />
      )}

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          name="isRequired"
          checked={rule.isRequired}
          onChange={handleChange}
          className="h-4 w-4 flex-shrink-0 rounded border-slate-300"
        />

        <span className="text-sm font-medium text-slate-700">
          Required Field
        </span>
      </label>

      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Validation Error Responses
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Configure a custom response for each validation failure.
          </p>
        </div>

        {validationTypes.map(
          (validationType) => {
            const errorResponse =
              getErrorResponse(
                validationType
              );

            return (
              <div
                key={validationType}
                className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-slate-800">
                    {validationType}
                  </h4>

                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={
                        errorResponse.isEnabled
                      }
                      onChange={(e) =>
                        handleErrorResponseChange(
                          validationType,
                          "isEnabled",
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 flex-shrink-0 rounded border-slate-300"
                    />

                    <span>
                      Enabled
                    </span>
                  </label>
                </div>

                <Input
                  type="number"
                  placeholder="HTTP Status Code"
                  value={
                    errorResponse.statusCode
                  }
                  onChange={(e) =>
                    handleErrorResponseChange(
                      validationType,
                      "statusCode",
                      Number(e.target.value)
                    )
                  }
                />

                <textarea
                  rows={4}
                  placeholder={`{
  "message": "${validationType} validation failed."
}`}
                  value={
                    errorResponse.responseBody
                  }
                  onChange={(e) =>
                    handleErrorResponseChange(
                      validationType,
                      "responseBody",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />

                {errorResponse.responseBody && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      handleRemoveErrorResponse(
                        validationType
                      )
                    }
                  >
                    Clear Custom Response
                  </Button>
                )}
              </div>
            );
          }
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          onClick={handleSubmit}
          className="w-full sm:w-auto"
        >
          {isEditing
            ? "Update Validation Rule"
            : "+ Add Validation Rule"}
        </Button>

        {isEditing && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}

export default ValidationRuleForm;