export function scoreSimilarity(config, catalog) {
  const weights = {
    occasion: 10,
    budget: 5,
    size_category: 5,
    flavor: 4,
    // tiers: 2,
    // frosting: 2,
    style: 9,
    // colorTheme: 1,
    // shape: 1
  };
  const normalize = (value) => String(value ?? "").trim().toLowerCase();
  const activeMaxScore = Object.entries(weights).reduce((sum, [key, value]) => {
    return normalize(config[key]) ? sum + value : sum;
  }, 0) || 1;

  return catalog
    .map((cake) => {
      let score = 0;

      for (const key in weights) {
        if (normalize(config[key]) === normalize(cake[key])) {
          score += weights[key];
        }
      }

      return {
        ...cake,
        score,
        normalizedScore: score / activeMaxScore
      };
    })
    .sort((a, b) => b.normalizedScore - a.normalizedScore);
}