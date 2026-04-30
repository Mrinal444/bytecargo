const { Roles } = require("../constants/enums");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value) {
  if (!isNonEmptyString(value)) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function normalizeRole(role) {
  if (!isNonEmptyString(role)) {
    return null;
  }

  const normalized = role.trim().toUpperCase();

  return Object.values(Roles).includes(normalized) ? normalized : null;
}

function parsePositiveNumber(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function parsePositiveInteger(value) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

module.exports = {
  isNonEmptyString,
  isValidEmail,
  normalizeRole,
  parsePositiveNumber,
  parsePositiveInteger,
};