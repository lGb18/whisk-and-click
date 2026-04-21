import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export function useBestSellers(limit = 10) {
  return useQuery({
    queryKey: ['best_sellers', limit],
    queryFn: async () => {
      // Query the View exactly like a normal table!
      const { data, error } = await supabase
        .from('top_selling_cakes')
        .select('*')
        .limit(limit);
      
      if (error) throw new Error(error.message);
      return data;
    }
  });
}