import { useState, useEffect } from 'react';
import { useBlueprints } from './useBlueprints';
import { getRecommendations } from '../utils/recommendationEngine';

export function useRecommendations(cakeConfig) {
  const { data: blueprints, isLoading, error } = useBlueprints();
  const [results, setResults] = useState({ topMatches: [], bestScore: 0, isWeakMatch: false });

  useEffect(() => {
    // Only run the math if Supabase has returned the catalog and the user has a config
    if (blueprints && blueprints.length > 0 && cakeConfig) {
      const matchResults = getRecommendations(cakeConfig, blueprints);
      setResults(matchResults);
    }
  }, [blueprints, cakeConfig]);

  return { ...results, isLoading, error };
}