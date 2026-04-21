export const constraints = [
  {
    id: "RULE-001",
    category: "physical",
    severity: "warning",
    description: "Small cakes may be too small for large formal occasions",
    condition: (config) =>
      config.size_category === "small" &&
      (config.occasion === "wedding" || config.occasion === "anniversary"),
    message:
      "A small cake may not provide enough servings for a wedding or large celebration.",
    suggestion:
      "Consider a medium or large size for weddings or events with many guests."
  },
  {
    id: "RULE-002",
    category: "business",
    severity: "warning",
    description: "Large cakes rarely fit into the low budget tier",
    condition: (config) =>
      config.size_category === "large" && config.budget === "low",
    message:
      "Large cakes are usually above the low budget range due to serving count and labor.",
    suggestion:
      "Increase your budget tier or choose a smaller size to stay within a low budget."
  },
  {
    id: "RULE-003",
    category: "capability",
    severity: "error",
    description: "Playful/cartoon styles are not offered for formal weddings",
    condition: (config) =>
      config.occasion === "wedding" &&
      ["cartoon", "kids", "character"].includes(
        (config.style || "").toLowerCase()
      ),
    message:
      "Cartoon or kids styles are not available for formal wedding cakes.",
    suggestion: "Choose a classic, minimalist, or floral wedding style instead."
  },
  {
    id: "RULE-004",
    category: "business",
    severity: "warning",
    description: "Highly detailed styles may exceed low budget expectations",
    condition: (config) =>
      config.budget === "low" &&
      ["floral", "luxury", "hand_painted"].includes(
        (config.style || "").toLowerCase()
      ),
    message:
      "Detailed floral or luxury designs are labor‑intensive and may not fit a low budget.",
    suggestion:
      "Simplify to a minimalist or rustic design, or increase the budget tier."
  },
  {
    id: "RULE-005",
    category: "business",
    severity: "warning",
    description: "Premium flavors may cost more in the lowest budget tier",
    condition: (config) =>
      config.budget === "low" &&
      ["red_velvet", "carrot", "pistachio"].includes(
        (config.flavor || "").toLowerCase()
      ),
    message:
      "Premium flavors typically cost more than basic vanilla or chocolate at a low budget.",
    suggestion:
      "Choose a simpler flavor (vanilla or chocolate) or increase your budget."
  },
  // {
  //   id: "RULE-101",
  //   category: "physical",
  //   severity: "error",
  //   description: "Small cakes cannot support 3 tiers safely",
  //   condition: (config) =>
  //     config.size_category === "small" &&
  //     Number(config.tiers) >= 3,
  //   message:
  //     "Three‑tier constructions are not supported on the smallest cake size.",
  //   suggestion:
  //     "Choose 1–2 tiers for small cakes, or increase to a medium or large size."
  // },
  // {
  //   id: "RULE-102",
  //   category: "physical",
  //   severity: "warning",
  //   description: "Very tall cakes require sufficient size and structure",
  //   condition: (config) =>
  //     ["medium"].includes(config.size_category) &&
  //     Number(config.tiers) >= 4,
  //   message:
  //     "Very tall tiered cakes need additional structural support and may be unstable at this size.",
  //   suggestion:
  //     "Reduce the number of tiers or choose a larger base size for tall designs."
  // },

  // // ---- frosting ----

  // {
  //   id: "RULE-201",
  //   category: "business",
  //   severity: "error",
  //   description: "Fondant is not available for low budget cakes",
  //   condition: (config) =>
  //     config.budget === "low" &&
  //     (config.frosting || "").toLowerCase() === "fondant",
  //   message:
  //     "Fondant‑covered cakes are not offered in the lowest budget tier due to higher labor and material costs.",
  //   suggestion:
  //     "Choose buttercream or increase your budget tier if you’d like a fondant finish."
  // },
  // {
  //   id: "RULE-202",
  //   category: "capability",
  //   severity: "warning",
  //   description:
  //     "Sharp‑edge or very smooth finishes are harder to achieve with whipped frosting",
  //   condition: (config) =>
  //     ["whipped_cream", "whipped"].includes(
  //       (config.frosting || "").toLowerCase()
  //     ) &&
  //     ["modern", "minimalist"].includes(
  //       (config.style || "").toLowerCase()
  //     ),
  //   message:
  //     "Very sharp, smooth edges are challenging with whipped frostings compared with buttercream or fondant.",
  //   suggestion:
  //     "Choose buttercream or fondant for precise modern edges, or switch to a softer rustic style."
  // },

  // // ---- colorTheme ----

  // {
  //   id: "RULE-301",
  //   category: "aesthetic",
  //   severity: "warning",
  //   description: "Very dark color themes can stain and affect perceived taste",
  //   condition: (config) =>
  //     ["black", "navy", "deep_red"].includes(
  //       (config.colorTheme || "").toLowerCase()
  //     ),
  //   message:
  //     "Very dark frostings can stain teeth and may slightly alter perceived taste.",
  //   suggestion:
  //     "Consider using dark colors as accents instead of the primary color, especially for large events."
  // },
  // {
  //   id: "RULE-302",
  //   category: "aesthetic",
  //   severity: "warning",
  //   description:
  //     "Kids occasions usually use bright or pastel color themes rather than very formal palettes",
  //   condition: (config) =>
  //     config.occasion === "kids_birthday" &&
  //     ["black", "all_white"].includes(
  //       (config.colorTheme || "").toLowerCase()
  //     ),
  //   message:
  //     "Very formal or dark color themes are unusual for children’s cakes.",
  //   suggestion:
  //     "Consider brighter or character‑inspired colors for kids’ celebrations."
  // },

  // // ---- shape ----

  // {
  //   id: "RULE-401",
  //   category: "business",
  //   severity: "warning",
  //   description: "Non‑round shapes typically cost more than basic round designs",
  //   condition: (config) =>
  //     config.budget === "low" &&
  //     !["round", "rectangular"].includes(
  //       (config.shape || "").toLowerCase()
  //     ),
  //   message:
  //     "Novelty shapes (e.g., heart, number, custom silhouettes) usually require more labor than basic round or rectangular cakes.",
  //   suggestion:
  //     "Choose a round or rectangular shape to stay within a low budget, or increase your budget tier."
  // },
  // {
  //   id: "RULE-402",
  //   category: "physical",
  //   severity: "warning",
  //   description:
  //     "Tall multi‑tiered cakes are more stable with round or square bases",
  //   condition: (config) =>
  //     Number(config.tiers) >= 3 &&
  //     !["round", "square"].includes(
  //       (config.shape || "").toLowerCase()
  //     ),
  //   message:
  //     "Very tall tiered cakes are usually built on round or square bases for stability.",
  //   suggestion:
  //     "Use a round or square base shape for 3+ tier designs, or reduce the number of tiers."
  // }
];
