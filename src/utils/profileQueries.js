import { supabase } from "../lib/supabaseClient";

export async function updateOwnProfile({ userId, fullName }) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}