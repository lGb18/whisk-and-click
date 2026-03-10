export function scoreSimilarity(config, catalog) {
  const weights = {
    occasion: 10,
    budget: 5,
    size_category: 5,
    flavor: 10,
    // tiers: 2,
    // frosting: 2,
    style: 7,
    // colorTheme: 1,
    // shape: 1
  };

  const maxScore = Object.values(weights).reduce((sum, value) => sum + value, 0);

  return catalog
    .map((cake) => {
      let score = 0;

      for (const key in weights) {
        if (String(config[key]) === String(cake[key])) {
          score += weights[key];
        }
      }

      return {
        ...cake,
        score,
        normalizedScore: score / maxScore
      };
    })
    .sort((a, b) => b.normalizedScore - a.normalizedScore);
}