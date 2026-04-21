import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export function useCarousel() {
  return useQuery({
    queryKey: ['carousel_slides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carousel_slides')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw new Error(error.message);
      return data;
    }
  });
}