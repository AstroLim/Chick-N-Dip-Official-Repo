import { supabase } from "../utils/supabase/client";

/**
 * Raw DB operations for inquiry_messages.
 */

export async function createMessage({ inquiry_id, sender_id, sender_type = "user", body }) {
  const { data, error } = await supabase
    .from("inquiry_messages")
    .insert([{ inquiry_id, sender_id, sender_type, body }])
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function listMessagesByInquiryId(inquiryId) {
  const { data, error } = await supabase
    .from("inquiry_messages")
    .select("*")
    .eq("inquiry_id", inquiryId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function deleteMessage(id) {
  const { error } = await supabase.from("inquiry_messages").delete().eq("id", id);
  if (error) throw error;
  return true;
}