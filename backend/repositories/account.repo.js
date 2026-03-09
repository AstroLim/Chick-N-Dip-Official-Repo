import { supabase } from "../utils/supabase/client";

/**
 * Raw DB operations for profiles only.
 */

export async function getProfileById(id) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getProfileByEmail(email) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("Email", email)
    .single();

  if (error) throw error;
  return data;
}

export async function listProfiles({ limit = 100, offset = 0, role } = {}) {
  let q = supabase
    .from("profiles")
    .select("*")
    .order("CreatedAt", { ascending: false })
    .range(offset, offset + limit - 1);

  if (role) q = q.eq("Role", role);

  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function updateProfile(id, patch) {
  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProfile(id) {
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}