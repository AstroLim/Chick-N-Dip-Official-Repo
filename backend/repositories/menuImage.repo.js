// backend/repositories/menuImage.repo.js
import { supabase } from "../utils/supabase/client";

const BUCKET = "menu-images";
const BASE_IMAGE_URL =
  "https://uukmxxswbccctevqyymo.supabase.co/storage/v1/object/public/menu-images/";

const NO_IMAGE_URL = BASE_IMAGE_URL + "no-image/No-Image-Placeholder.png";

function isFullUrl(s) {
  return typeof s === "string" && (s.startsWith("http://") || s.startsWith("https://"));
}

export function toPublicImageUrl(imagePathOrUrl) {
  if (!imagePathOrUrl) return NO_IMAGE_URL;
  if (isFullUrl(imagePathOrUrl)) return imagePathOrUrl;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(imagePathOrUrl);
  return data?.publicUrl || NO_IMAGE_URL;
}

/**
 * Uploads a menu image and returns a storage path + public URL.
 * Path convention: `${sectionId}/${itemId}.${ext}` (uuid/uuid.ext)
 */
export async function uploadMenuImage(file, { sectionId, itemId }) {
  const ext = file.name.split(".").pop();
  const path = `${sectionId}/${itemId}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, publicUrl: data?.publicUrl || NO_IMAGE_URL };
}

export { NO_IMAGE_URL, BASE_IMAGE_URL };