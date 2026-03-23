import { describe, it, expect } from "vitest";
import { scoreSimilarity } from "../utils/scoreSimilarity";

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

describe("scoreSimilarity", () => {

  it("ranks the stronger match higher", () => {
    const input = {
        occasion : "birthday",
        size_category: "medium",
        budget: "medium",
        style: "classic",
        flavor: "vanilla",
    };
    const result = scoreSimilarity(input, mockCatalog);
    expect(result[0].cake_id).toBe("cake_4");
    expect(result[0].normalizedScore).toBeGreaterThan(result[1].normalizedScore);
  });
});