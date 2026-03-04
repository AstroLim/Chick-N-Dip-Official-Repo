import { supabase } from "../utils/supabase/client";

export async function listPublicItems() {
  const { data, error } = await supabase
    .from("MenuItem")
    .select("*")
    .order("Name", { ascending: true });
  if (error) throw error;
  return data;
}

export async function createItem(item) {
  const { data, error } = await supabase
    .from("MenuItem")
    .insert([item])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateItem(id, patch) {
  const { data, error } = await supabase
    .from("MenuItem")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteItem(id) {
  const { error } = await supabase.from("MenuItem").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function listAllItemsAdmin() {
  const { data, error } = await supabase
    .from("MenuItem")
    .select("*")
    .order("Name", { ascending: true });

  if (error) throw error;
  return data;
}