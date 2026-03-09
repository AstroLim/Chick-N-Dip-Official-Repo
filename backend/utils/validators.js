function assertLen(label, value, min, max) {
  const n = value.length;
  if (n < min || n > max) {
    throw new Error(`${label} must be between ${min}-${max} characters.`);
  }
}

function assertRole(role) {
  if (!ALLOWED_ROLES.includes(role)) {
    throw new Error(`Invalid role. Allowed roles: ${ALLOWED_ROLES.join(", ")}`);
  }
}