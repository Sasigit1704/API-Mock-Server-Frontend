import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

function ValidationRuleForm({
  fields,
  onAdd,
  initialRule = null,
  onUpdate,
  onCancelEdit,
}) {
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

  const [rule, setRule] = useState(emptyRule);

  const isEditing = initialRule !== null;

  /*
   * Fields can come from the generated JSON Schema metadata:
   * {
   *   fieldPath: "name",
   *   dataType: "String",
   *   isRequired: true
   * }
   *
   * Older/manual callers may still provide plain strings,
   * so those remain supported.
   */
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

  /*
   * Decide which validation errors are applicable
   * for the selected data type and configured rules.
   */
  const getValidationTypes = (currentRule) => {
    const types = [];

    // Required applies to every field
    if (currentRule.isRequired) {
      types.push("Required");
    }

    // Type validation applies to every field
    types.push("Type");

    if (
      currentRule.dataType === "String"
    ) {
      if (currentRule.minLength !== "" &&
          currentRule.minLength !== null) {
        types.push("MinLength");
      }

      if (currentRule.maxLength !== "" &&
          currentRule.maxLength !== null) {
        types.push("MaxLength");
      }

      if (
        currentRule.pattern &&
        currentRule.pattern.trim() !== ""
      ) {
        types.push("Pattern");
      }
    }

    if (
      currentRule.dataType === "Number"
    ) {
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

  /*
   * Create an error-response object.
   */
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
        fieldPath:
          initialRule.fieldPath || "",

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
  }, [initialRule]);

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    if (name === "fieldPath") {
      const metadata = getFieldMetadata(value);

      setRule((prev) => ({
        ...prev,
        fieldPath: value,
        dataType:
          metadata?.dataType || prev.dataType,
        isRequired:
          metadata?.isRequired ?? prev.isRequired,
      }));

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

  /*
   * Add/update an individual custom error response.
   */
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

  /*
   * Get existing error-response configuration.
   */
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

  /*
   * Remove custom configuration for a
   * particular validation type.
   */
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

      /*
       * Remove empty custom error responses.
       *
       * This means if the user doesn't configure
       * an error response, backend will use the
       * default validation error.
       */
      errorResponses:
        (rule.errorResponses || []).filter(
          (response) =>
            response.responseBody &&
            response.responseBody.trim() !== ""
        ),
    };
  };

  const handleSubmit = () => {
    if (!rule.fieldPath.trim()) {
      return;
    }

    const preparedRule = prepareRule();

    if (isEditing) {
      onUpdate(preparedRule);
    } else {
      onAdd(preparedRule);
      setRule(emptyRule);
    }
  };

  const handleCancel = () => {
    setRule(emptyRule);

    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const validationTypes =
    getValidationTypes(rule);

  return (
    <div className="space-y-5 rounded-xl border bg-slate-50 p-5">

      {/* Field + Type */}

      <div className="grid grid-cols-2 gap-4">

        <Select
          name="fieldPath"
          value={rule.fieldPath}
          onChange={handleChange}
          disabled={isEditing}
        >
          <option value="">
            Select Field
          </option>

          {normalizedFields.map((field) => (
            <option
              key={field.fieldPath}
              value={field.fieldPath}
            >
              {field.fieldPath}
            </option>
          ))}
        </Select>

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

      {getFieldMetadata(rule.fieldPath) && (
        <p className="text-xs text-slate-500">
          Schema detected:
          <span className="ml-1 font-medium text-slate-700">
            {getFieldMetadata(rule.fieldPath).dataType}
          </span>
          <span className="ml-2 font-medium">
            {getFieldMetadata(rule.fieldPath).isRequired
              ? "Required"
              : "Optional"}
          </span>
        </p>
      )}

      {/* Length validations */}

      {rule.dataType === "String" && (
        <div className="grid grid-cols-2 gap-4">

          <Input
            type="number"
            name="minLength"
            placeholder="Min Length"
            value={rule.minLength}
            onChange={handleChange}
          />

          <Input
            type="number"
            name="maxLength"
            placeholder="Max Length"
            value={rule.maxLength}
            onChange={handleChange}
          />

        </div>
      )}

      {/* Number validations */}

      {rule.dataType === "Number" && (
        <div className="grid grid-cols-2 gap-4">

          <Input
            type="number"
            name="minValue"
            placeholder="Min Value"
            value={rule.minValue}
            onChange={handleChange}
          />

          <Input
            type="number"
            name="maxValue"
            placeholder="Max Value"
            value={rule.maxValue}
            onChange={handleChange}
          />

        </div>
      )}

      {/* Pattern */}

      {rule.dataType === "String" && (
        <Input
          name="pattern"
          placeholder="Regex Pattern (Optional)"
          value={rule.pattern}
          onChange={handleChange}
        />
      )}

      {/* Required */}

      <label className="flex items-center gap-3">

        <input
          type="checkbox"
          name="isRequired"
          checked={rule.isRequired}
          onChange={handleChange}
        />

        Required Field

      </label>

      {/* Error Responses */}

      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">

        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Validation Error Responses
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Configure a custom response for each validation failure.
            Leave the response body empty to use the default validation error.
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

                  <div>
                    <h4 className="font-medium text-slate-800">
                      {validationType}
                    </h4>

                    <p className="text-xs text-slate-500">
                      Error response for{" "}
                      {validationType}
                      validation.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 text-sm">

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
                    />

                    Enabled

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
                  rows={5}
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

      {/* Submit */}

      <div className="flex gap-3">

        <Button
          type="button"
          onClick={handleSubmit}
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
          >
            Cancel
          </Button>
        )}

      </div>

    </div>
  );
}

export default ValidationRuleForm;