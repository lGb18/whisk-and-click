import { calculateCosineSimilarity } from './scoreSimilarity';

/**
 * Processes the user's config against the entire database catalog.
 */
export function getRecommendations(userConfig, catalog) {
  if (!catalog || catalog.length === 0) {
    return { topMatches: [], bestScore: 0, isWeakMatch: true };
  }

  // 1. Score every blueprint in the database using 4D Vector Math
  const scoredCatalog = catalog.map(blueprint => {
    const score = calculateCosineSimilarity(userConfig, blueprint);
    return { ...blueprint, matchScore: score };
  });

  // 2. Sort by highest score first (closest to 1.0)
  scoredCatalog.sort((a, b) => b.matchScore - a.matchScore);

  // 3. Apply the Color Filter (Soft Filter)
  const requestedColor = userConfig.primary_color;
  let finalResults = scoredCatalog;

  if (requestedColor && requestedColor !== "Any") {
    // Look for cakes that match the requested color
    const colorMatches = scoredCatalog.filter(
      cake => cake.primary_color.toLowerCase() === requestedColor.toLowerCase()
    );
    
    // If we found exact color matches, prioritize them!
    if (colorMatches.length > 0) {
      finalResults = colorMatches;
    }
  }

  // 4. Extract the absolute best match
  const topMatches = finalResults.slice(0, 3);
  const bestScore = topMatches.length > 0 ? topMatches[0].matchScore : 0;

  // 5. Threshold Return
  return {
    topMatches,
    bestScore,
    isWeakMatch: bestScore < 0.85 // 85% requirement for a standard catalog match
  };
}