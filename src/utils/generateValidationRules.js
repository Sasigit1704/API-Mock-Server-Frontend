export function generateValidationRules(schema) {
  const rules = [];

  const createRule = (
    fieldPath,
    dataType,
    isRequired = true
  ) => ({
    fieldPath,
    dataType,
    isRequired,
    minLength: null,
    maxLength: null,
    minValue: null,
    maxValue: null,
    pattern: "",
    errorMessage: "",
    errorResponses: [],
  });

  const getDataType = (value) => {
    if (Array.isArray(value)) return "Array";

    if (
      value !== null &&
      typeof value === "object"
    ) {
      return "Object";
    }

    if (typeof value === "string") return "String";
    if (typeof value === "number") return "Number";
    if (typeof value === "boolean") return "Boolean";

    return "String";
  };

  const getSchemaDataType = (schemaNode) => {
    if (!schemaNode || typeof schemaNode !== "object") {
      return "String";
    }

    const type = schemaNode.type;

    if (type === "string") return "String";

    if (
      type === "integer" ||
      type === "number"
    ) {
      return "Number";
    }

    if (type === "boolean") return "Boolean";

    if (type === "array") return "Array";

    if (type === "object") return "Object";

    // Some schemas omit "type" but provide properties.
    if (
      schemaNode.properties &&
      typeof schemaNode.properties === "object"
    ) {
      return "Object";
    }

    return "String";
  };

  /*
   * ============================================================
   * JSON SCHEMA MODE
   * ============================================================
   *
   * Example:
   *
   * {
   *   "type": "object",
   *   "properties": {
   *     "name": { "type": "string" },
   *     "age": { "type": "integer" }
   *   },
   *   "required": ["name"]
   * }
   *
   * Produces:
   * name -> String -> required
   * age  -> Number -> optional
   *
   * We deliberately do NOT generate:
   * type
   * properties.name.type
   * properties.name
   */
  const traverseJsonSchema = (
    schemaNode,
    currentPath = "",
    parentRequired = false
  ) => {
    if (
      !schemaNode ||
      typeof schemaNode !== "object"
    ) {
      return;
    }

    const schemaType =
      getSchemaDataType(schemaNode);

    if (
      currentPath &&
      schemaType !== "Object"
    ) {
      rules.push(
        createRule(
          currentPath,
          schemaType,
          parentRequired
        )
      );
    }

    // Object properties
    if (
      schemaNode.properties &&
      typeof schemaNode.properties === "object"
    ) {
      const requiredFields =
        Array.isArray(schemaNode.required)
          ? schemaNode.required
          : [];

      Object.entries(
        schemaNode.properties
      ).forEach(
        ([propertyName, propertySchema]) => {
          const propertyPath =
            currentPath
              ? `${currentPath}.${propertyName}`
              : propertyName;

          const isRequired =
            requiredFields.includes(
              propertyName
            );

          const propertyType =
            getSchemaDataType(
              propertySchema
            );

          if (propertyType === "Object") {
            // Add the object itself so it can be
            // selected as a validation field.
            rules.push(
              createRule(
                propertyPath,
                "Object",
                isRequired
              )
            );

            traverseJsonSchema(
              propertySchema,
              propertyPath,
              isRequired
            );

            return;
          }

          if (propertyType === "Array") {
            rules.push(
              createRule(
                propertyPath,
                "Array",
                isRequired
              )
            );

            if (
              propertySchema &&
              propertySchema.items
            ) {
              const itemSchema =
                propertySchema.items;

              const itemType =
                getSchemaDataType(
                  itemSchema
                );

              if (itemType === "Object") {
                traverseJsonSchema(
                  itemSchema,
                  `${propertyPath}[*]`,
                  false
                );
              } else {
                rules.push(
                  createRule(
                    `${propertyPath}[*]`,
                    itemType,
                    false
                  )
                );
              }
            }

            return;
          }

          rules.push(
            createRule(
              propertyPath,
              propertyType,
              isRequired
            )
          );
        }
      );
    }

    // Root-level array schema
    if (
      schemaType === "Array" &&
      schemaNode.items &&
      currentPath
    ) {
      const itemType =
        getSchemaDataType(
          schemaNode.items
        );

      if (itemType === "Object") {
        traverseJsonSchema(
          schemaNode.items,
          `${currentPath}[*]`,
          false
        );
      } else {
        rules.push(
          createRule(
            `${currentPath}[*]`,
            itemType,
            false
          )
        );
      }
    }
  };

  /*
   * ============================================================
   * NORMAL JSON SAMPLE MODE
   * ============================================================
   *
   * This preserves the old behavior for input such as:
   *
   * {
   *   "name": "Sasi",
   *   "age": 25
   * }
   *
   * No "type" or "properties" are required.
   */
  const traverseSampleJson = (
    value,
    currentPath = ""
  ) => {
    if (Array.isArray(value)) {
      if (currentPath) {
        rules.push(
          createRule(
            currentPath,
            "Array",
            true
          )
        );
      }

      if (value.length > 0) {
        const firstItem = value[0];

        if (
          firstItem !== null &&
          typeof firstItem === "object" &&
          !Array.isArray(firstItem)
        ) {
          traverseSampleJson(
            firstItem,
            `${currentPath}[*]`
          );
        } else {
          rules.push(
            createRule(
              `${currentPath}[*]`,
              getDataType(firstItem),
              false
            )
          );
        }
      }

      return;
    }

    if (
      value !== null &&
      typeof value === "object"
    ) {
      Object.entries(value).forEach(
        ([key, childValue]) => {
          const path = currentPath
            ? `${currentPath}.${key}`
            : key;

          traverseSampleJson(
            childValue,
            path
          );
        }
      );

      return;
    }

    if (currentPath) {
      rules.push(
        createRule(
          currentPath,
          getDataType(value),
          true
        )
      );
    }
  };

  try {
    if (
      typeof schema !== "string" ||
      !schema.trim()
    ) {
      return [];
    }

    const parsed = JSON.parse(schema);

    /*
     * Detect a real JSON Schema.
     *
     * "type" by itself is enough for primitive schemas,
     * while "properties", "required", "items", "$schema",
     * or "$ref" indicate schema-style input.
     */
    const isJsonSchema =
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (
        Object.prototype.hasOwnProperty.call(
          parsed,
          "properties"
        ) ||
        Object.prototype.hasOwnProperty.call(
          parsed,
          "required"
        ) ||
        Object.prototype.hasOwnProperty.call(
          parsed,
          "items"
        ) ||
        Object.prototype.hasOwnProperty.call(
          parsed,
          "$schema"
        ) ||
        (
          Object.prototype.hasOwnProperty.call(
            parsed,
            "type"
          ) &&
          (
            parsed.type === "object" ||
            parsed.type === "array" ||
            parsed.type === "string" ||
            parsed.type === "number" ||
            parsed.type === "integer" ||
            parsed.type === "boolean"
          )
        )
      );

    if (isJsonSchema) {
      traverseJsonSchema(parsed);
    } else {
      traverseSampleJson(parsed);
    }

    /*
     * Remove duplicate field paths while preserving
     * the first generated definition.
     */
    const uniqueRules = [];
    const seen = new Set();

    rules.forEach((rule) => {
      if (
        !rule.fieldPath ||
        seen.has(rule.fieldPath)
      ) {
        return;
      }

      seen.add(rule.fieldPath);
      uniqueRules.push(rule);
    });

    return uniqueRules;
  } catch {
    return [];
  }
}