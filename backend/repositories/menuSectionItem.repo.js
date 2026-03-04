import { supabase } from "../utils/supabase/client";

export async function addItemToSection({ menu_section_id, menu_item_id, sort_order = 0 }) {
  const { data, error } = await supabase
    .from("MenuSectionItem")
    .insert([{ menu_section_id, menu_item_id, sort_order }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateLink(menu_section_id, menu_item_id, patch) {
  const { data, error } = await supabase
    .from("MenuSectionItem")
    .update(patch)
    .eq("menu_section_id", menu_section_id)
    .eq("menu_item_id", menu_item_id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function removeItemFromSection({ menu_section_id, menu_item_id }) {
  const { error } = await supabase
    .from("MenuSectionItem")
    .delete()
    .eq("menu_section_id", menu_section_id)
    .eq("menu_item_id", menu_item_id);
  if (error) throw error;
  return true;
}

export async function listLinksAdmin() {
  const { data, error } = await supabase.from("MenuSectionItem").select("*");
  if (error) throw error;
  return data;
}