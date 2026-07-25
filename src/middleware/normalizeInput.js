function normalizeValue(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (
    value &&
    typeof value === "object"
  ) {
    return Object.fromEntries(
      Object.entries(value).map(
        ([key, nestedValue]) => [
          key,
          normalizeValue(nestedValue)
        ]
      )
    );
  }

  return value;
}

export function normalizeInput(req, res, next) {
  if (req.body) {
    req.body = normalizeValue(req.body);
  }

  next();
}