export const constraints = [
  {
    id: "RULE-001",
    category: "physical",
    severity: "error",
    description: "Small cakes cannot support 3 tiers",
    condition: (config) => config.size_category === "Small" && config.tiers === "3",
    message: "Small cakes cannot have 3 tiers.",
    suggestion: "Choose 1 or 2 tiers, or increase the cake size."
  },
  {
    id: "RULE-002",
    category: "business",
    severity: "error",
    description: "Fondant is not available for low budget cakes",
    condition: (config) => config.budget === "Low" && config.frosting === "Fondant",
    message: "Fondant is unavailable for the low budget range.",
    suggestion: "Choose buttercream or increase the budget."
  },
  {
    id: "RULE-003",
    category: "capability",
    severity: "error",
    description: "Cartoon style is not suitable for wedding cakes",
    condition: (config) => config.occasion === "Wedding" && config.style === "Cartoon",
    message: "Cartoon style is not available for wedding cakes.",
    suggestion: "Choose minimalist or floral style."
  },
  {
    id: "RULE-004",
    category: "business",
    severity: "warning",
    description: "Complex styles may exceed low budget expectations",
    condition: (config) => config.budget === "Low" && config.style === "Floral",
    message: "This design may not fully match the selected budget.",
    suggestion: "You may need to simplify the design or increase the budget."
  }
];