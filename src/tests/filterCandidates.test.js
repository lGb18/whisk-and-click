import { describe, it, expect } from "vitest";
import { filterCandidates } from "../utils/filterCandidates";

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

describe ( "filterCandidates", () => {

    it("matches only selected hard constraints" , () => {
        const config = {
            occasion : "birthday",
            size_category: "medium",
            budget: "medium",
        };
        const result = filterCandidates(config, mockCatalog);

        expect(result).toHaveLength(1);
        expect(result[0].cake_id).toBe("cake_4");
    });

});