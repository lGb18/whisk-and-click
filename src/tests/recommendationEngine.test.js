import { describe, it, expect } from "vitest";
import { recommendationEngine } from "../utils/recommendationEngine";

const mockCatalog = [
  {
    cake_id: "cake_1",
    occasion: "birthday",
    size_category: "medium",
    flavor: "chocolate",
    style: "elegant",
    budget: "small",
    tags: ["number-shaped"],
    is_available: true,
  },
  {
    cake_id: "cake_2",
    occasion: "wedding",
    size_category: "large",
    flavor: "vanilla",
    style: "classic",
    budget: "high",
    tags: ["floral"],
    is_available: true,
  },
  {
    cake_id: "cake_3",
    occasion: "anniversary",
    size_category: "large",
    flavor: "chocolate",
    style: "classic",
    budget: "high",
    tags: ["floral"],
    is_available: true,
  },
  {
    cake_id: "cake_4",
    occasion: "birthday",
    size_category: "medium",
    flavor: "vanilla",
    style: "classic",
    budget: "medium",
    tags: ["floral"],
    is_available: true,
  },
  {
    cake_id: "cake_5",
    occasion: "wedding",
    size_category: "large",
    flavor: "caramel",
    style: "playful",
    budget: "high",
    tags: ["floral"],
    is_available: true,
  },
];

describe("recommendationEngine", () => {
  it("return ranked recommendation", () => {
    const input = {
        occasion : "birthday",
        size_category: "medium",
        budget: "medium",
        style: "classic",
        flavor: "vanilla",
    };
    const result = recommendationEngine(input, mockCatalog);
    expect(result.candidates.length).toBeGreaterThan(0);
    expect(result.ranked.length).toBeGreaterThan(0);
    expect(result.topMatches.length).toBeLessThanOrEqual(3);
    expect(result.isWeakMatch).toEqual(expect.any(Boolean));
  });
});