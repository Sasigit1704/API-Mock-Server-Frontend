export function parseRequestSchema(schema) {
  const fields = [];

  function traverse(value, currentPath = "") {
    // Array
    if (Array.isArray(value)) {
      if (currentPath) {
        // Add the array field itself
        fields.push(currentPath);
      }

      if (value.length > 0) {
        const firstItem = value[0];

        if (
          firstItem !== null &&
          typeof firstItem === "object" &&
          !Array.isArray(firstItem)
        ) {
          traverse(
            firstItem,
            `${currentPath}[*]`
          );
        } else {
          fields.push(
            `${currentPath}[*]`
          );
        }
      }

      return;
    }

    // Object
    if (
      value !== null &&
      typeof value === "object"
    ) {
      Object.entries(value).forEach(
        ([key, val]) => {
          const path = currentPath
            ? `${currentPath}.${key}`
            : key;

          fields.push(path);

          traverse(val, path);
        }
      );

      return;
    }
  }

  try {
    const json = JSON.parse(schema);

    traverse(json);

    return fields;
  } catch {
    return [];
  }
}