/**
 * Calculates the Cosine Similarity
 * @param {Object} userVector
 * @param {Object} cakeBlueprint
 * @returns {Number}
 */
export function calculateCosineSimilarity(userVector, cakeBlueprint) {
  // Define the exact 4 dimensions we use for our math
  const dimensions = ['form_factor', 'complexity', 'aesthetic', 'flavor'];

  let dotProduct = 0;
  let userMagnitudeSq = 0;
  let cakeMagnitudeSq = 0;

  for (const key of dimensions) {
    const uVal = Number(userVector[key]) || 1;
    const cVal = Number(cakeBlueprint[key]) || 1;

    dotProduct += uVal * cVal;
    userMagnitudeSq += uVal * uVal;
    cakeMagnitudeSq += cVal * cVal;
  }

  const userMagnitude = Math.sqrt(userMagnitudeSq);
  const cakeMagnitude = Math.sqrt(cakeMagnitudeSq);

  // Prevent division by zero
  if (userMagnitude === 0 || cakeMagnitude === 0) return 0;

  // Return the final similarity percentage
  return dotProduct / (userMagnitude * cakeMagnitude);
}