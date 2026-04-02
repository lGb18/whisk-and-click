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
  const { data, error } = await supabase.functions.invoke("admin-user-control", {
    body: {
      action: "set_role",
      targetUserId,
      newRole,
      note,
    },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);

  return data?.data;
}

export async function updateUserAccessState({ targetUserId, isActive, note = "" }) {
  const { data, error } = await supabase.functions.invoke("admin-user-control", {
    body: {
      action: "set_access_state",
      targetUserId,
      isActive,
      note,
    },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);

  return data?.data;
}