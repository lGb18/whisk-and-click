import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export function useBlueprints() {
  return useQuery({
    queryKey: ['cake_blueprints'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cake_blueprints')
        .select('*');
      
      if (error) throw new Error(error.message);
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24 // 24-hour cache
  });
}