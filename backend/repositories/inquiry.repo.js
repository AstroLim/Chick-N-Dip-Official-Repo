import { supabase } from "../utils/supabase/client";

/**
 * Raw DB operations for inquiries.
 */

export async function createInquiry({ subject, created_by, status = "open" }) {
  console.log("from repo, creating inquiry");
  const { data, error } = await supabase
    .from("inquiries")
    .insert([{ subject, created_by, status }])
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function getInquiryById(id) {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function listMyInquiries({ userId, limit = 50, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .eq("created_by", userId)
    .eq("is_deleted", false)
    .order("updated_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data ?? [];
}

export async function listAllInquiriesAdmin({ limit = 100, offset = 0, status } = {}) {
  let q = supabase
    .from("inquiries")
    .select("*")
    .order("updated_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) q = q.eq("status", status);

  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function updateInquiry(id, patch) {
  const { data, error } = await supabase
    .from("inquiries")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

/**
 * Soft delete
 */
export async function softDeleteInquiry(id) {
  const { data, error } = await supabase
    .from("inquiries")
    .update({ is_deleted: true })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

/**
 * Hard delete
 */
export async function hardDeleteInquiry(id) {
  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) throw error;
  return true;
}