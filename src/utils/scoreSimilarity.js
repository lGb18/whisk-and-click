export function scoreSimilarity(config, catalog) {
  const weights = {
    occasion: 2,
    budget: 1,
    size: 2,
    tiers: 2,
    frosting: 2,
    style: 3,
    colorTheme: 1,
    shape: 1
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