import { constraints } from "../data/constraints";

export function validateConfig(config) {
  const errors = [];
  const warnings = [];

  for (const rule of constraints) {
    if (rule.condition(config)) {
      const item = {
        id: rule.id,
        message: rule.message,
        suggestion: rule.suggestion,
        category: rule.category
      };

      if (rule.severity === "error") {
        errors.push(item);
      } else {
        warnings.push(item);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}