// processor of the full recommendation pipeline
// config + catalog > filter > score > return result/fallback
import { filterCandidates } from "../utils/filterCandidates";
import { scoreSimilarity } from "../utils/scoreSimilarity";


export function recommendationEngine(cakeConfig, cakeCatalog){

    const candidates = filterCandidates(cakeConfig, cakeCatalog);
    const ranked = scoreSimilarity(cakeConfig, candidates);
    const topMatches = ranked.slice(0, 3);
    const bestMatch = topMatches[0];
    const thirdMatch = topMatches[2];

    const bestScore = bestMatch?.normalizedScore ?? 0;
    const thirdScore = thirdMatch?.normalizedScore ?? 0;

    const isWeakMatch =
        ranked.length === 0 ||
        bestScore < 0.5 ||
        (topMatches.length >= 3 && bestScore - thirdScore < 0.1);
        
  return {
    candidates,
    ranked,
    topMatches,
    isWeakMatch,
  };
}


    // console.log("engine reco:", topMatches);
    // console.log("filtered:", candidates.length);
    // console.log("top:", ranked[0]);
//   if (!bestMatch || bestMatch.normalizedScore < 0.6) {
//     navigate("/fallback");
//     return null;
//   }