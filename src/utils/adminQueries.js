import { supabase } from "../lib/supabaseClient";

export async function fetchAllProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, is_active, created_at, updated_at, disabled_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function updateUserRole({ targetUserId, newRole, note = "" }) {
  const { data, error } = await supabase.rpc("set_user_role", {
    p_target_user_id: targetUserId,
    p_new_role: newRole,
    p_note: note,
  });

  if (error) throw error;
  return data;
}

export async function updateUserAccessState({ targetUserId, isActive, note = "" }) {
  const { data, error } = await supabase.rpc("set_user_access_state", {
    p_target_user_id: targetUserId,
    p_is_active: isActive,
    p_note: note,
  });

  if (error) throw error;
  return data;
}