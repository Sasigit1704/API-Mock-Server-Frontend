export function generateValidationRules(schema) {
  const rules = [];

  const createRule = (fieldPath, dataType) => ({
    fieldPath,
    dataType,
    isRequired: true,
    minLength: null,
    maxLength: null,
    minValue: null,
    maxValue: null,
    pattern: "",
    errorMessage: "",
  });

  const getDataType = (value) => {
    if (Array.isArray(value)) return "Array";
    if (value !== null && typeof value === "object") {
      return "Object";
    }
    if (typeof value === "string") return "String";
    if (typeof value === "number") return "Number";
    if (typeof value === "boolean") return "Boolean";

    return "String";
  };

  const traverse = (value, currentPath = "", isRoot = false) => {

    // ARRAY
    if (Array.isArray(value)) {
      if (currentPath) {
        rules.push(
          createRule(currentPath, "Array")
        );
      }

      // Validate the type of items inside the array
      if (value.length > 0) {
        const firstItem = value[0];

        if (
          firstItem !== null &&
          typeof firstItem === "object" &&
          !Array.isArray(firstItem)
        ) {
          traverse(
            firstItem,
            `${currentPath}[*]`,
            false
          );
        } else {
          rules.push(
            createRule(
              `${currentPath}[*]`,
              getDataType(firstItem)
            )
          );
        }
      }

      return;
    }

    // OBJECT
    if (
      value !== null &&
      typeof value === "object"
    ) {
      Object.entries(value).forEach(
        ([key, childValue]) => {
          const path = currentPath
            ? `${currentPath}.${key}`
            : key;

          traverse(
            childValue,
            path,
            false
          );
        }
      );

      return;
    }

    // PRIMITIVE
    if (currentPath) {
      rules.push(
        createRule(
          currentPath,
          getDataType(value)
        )
      );
    }
  };

  try {
    const parsedSchema = JSON.parse(schema);

    traverse(
      parsedSchema,
      "",
      true
    );

    return rules;
  } catch {
    return [];
  }
}