import { supabase } from "../utils/supabase/client";

import * as sectionRepo from "../repositories/menuSection.repo";
import * as itemRepo from "../repositories/menuItem.repo";
import * as linkRepo from "../repositories/menuSectionItem.repo";
import * as imageRepo from "../repositories/menuImage.repo";


/* =========================================================
   1) PUBLIC MENU OPERATIONS (Customer-facing)
   ========================================================= */

/**
 * Fetches the public menu for customer display.
 *
 * This function retrieves all AVAILABLE menu sections and their items
 * in a single query using Supabase relational embedding.
 *
 * @returns {Promise<Array<{section: Object, items: Array<Object>}>>}
 * Example return structure:
 * [
 *   {
 *     section: { id, Name, Description, Availability },
 *     items: [
 *       { id, Name, Price, Description, ImageUrl, sort_order }
 *     ]
 *   }
 * ]
 */
export async function getPublicMenu() {

  const { data, error } = await supabase
    .from("MenuSection")
    .select(`
      id,
      Name,
      Description,
      Availability,
      MenuSectionItem (
        sort_order,
        MenuItem (
          id,
          Name,
          Price,
          Availability,
          Description,
          ImagePath
        )
      )
    `)
    .eq("Availability", true)
    .order("sort_order", { foreignTable: "MenuSectionItem", ascending: true });

  if (error) throw error;

  // Transform Supabase relational response into UI-friendly structure
  return (data || []).map((sectionRow) => {

    const items = (sectionRow.MenuSectionItem || [])
      .map((link) => {

        const item = link.MenuItem;
        if (!item) return null;

        return {
          ...item,
          sort_order: link.sort_order,
          ImageUrl: imageRepo.toPublicImageUrl(item.ImagePath),
        };

      })
      .filter(Boolean);

    return {
      section: { ...sectionRow, MenuSectionItem: undefined },
      items,
    };
  });
}


/* =========================================================
   2) ADMIN MENU OPERATIONS 
   ========================================================= */

/**
 * Fetches the complete menu for admin dashboards.
 *
 * @returns {Promise<{sections:Array, unassignedItems:Array}>}
 *
 * Example:
 * {
 *   sections: [
 *     { section:{...}, items:[...] }
 *   ],
 *   unassignedItems: [...]
 * }
 */
export async function getAdminMenu() {

  const [sections, items, links] = await Promise.all([
    sectionRepo.listAllSectionsAdmin(),
    itemRepo.listAllItemsAdmin(),
    linkRepo.listLinksAdmin(),
  ]);

  // Build grouped menu structure
  const grouped = groupMenuByLinks(sections, links, items);

  // Determine which items are assigned to a section
  const linkedItemIds = new Set((links || []).map((l) => l.menu_item_id));

  // Items not present in the link table are considered "unassigned"
  const unassignedItems = (items || [])
    .filter((item) => !linkedItemIds.has(item.id))
    .map((item) => ({
      ...item,
      ImageUrl: imageRepo.toPublicImageUrl(item.ImagePath),
    }))
    .sort((a, b) => (a.Name || "").localeCompare(b.Name || ""));

  return { sections: grouped, unassignedItems };
}


/* =========================================================
   3) Menu Sections
   ========================================================= */

/**
 * Retrieves all menu sections for the admin dashboard, regardless
 * of availability.
 *
 * @returns {Promise<Array<Object>>}
 */
export const listAllSectionsAdmin = sectionRepo.listAllSectionsAdmin;


/**
 * Creates a new menu section.
 *
 * The database automatically generates the UUID primary key.
 *
 * @param {Object} section
 * @param {string} section.Name
 * @param {string} section.Description
 * @param {boolean} section.Availability
 *
 * @returns {Promise<Object>}
 * Newly created section row
 *
 * Edge cases:
 * - Empty name should be validated on frontend
 * - Duplicate names may be allowed depending on business rules
 */
export const createSection = sectionRepo.createSection;


/**
 * Updates an existing menu section.
 *
 * Allows partial updates (PATCH-style).
 *
 * @param {string} id
 * UUID of the section to update
 *
 * @param {Object} patch
 * Fields to update
 *
 * Example patch:
 * {
 *   Name: "Updated Section",
 *   Availability: false
 * }
 *
 * @returns {Promise<Object>}
 * Updated section row
 *
 */
export const updateSection = sectionRepo.updateSection;


/**
 * Deletes a menu section.
 *
 * Important:
 * If the section still contains linked items,
 * deletion may fail depending on foreign key constraints.
 *
 * Recommended workflow:
 * 1. Remove links from MenuSectionItem
 * 2. Delete section
 *
 * @param {string} id
 * UUID of the section
 *
 * @returns {Promise<boolean>}
 * true if deletion succeeded
 */
export const deleteSection = sectionRepo.deleteSection;


/* =========================================================
   4) Menu Items
   ========================================================= */

/**
 * Retrieves all menu items for admin management.
 *
 * Includes:
 * - unavailable items
 * - items not assigned to sections
 *
 * @returns {Promise<Array<Object>>}
 */
export const listAllItemsAdmin = itemRepo.listAllItemsAdmin;


/**
 * Creates a new menu item.
 *
 * @param {Object} item
 * @param {string} item.Name
 * @param {number} item.Price
 * @param {string} item.Description
 * @param {boolean} item.Availability
 * @param {string} [item.ImagePath]
 *
 * @returns {Promise<Object>}
 * Newly created MenuItem row
 *
 * Edge cases:
 * - Price validation should occur on frontend
 * - ImagePath may initially be null until upload
 */
export const createItem = itemRepo.createItem;


/**
 * Updates a menu item.
 *
 * Supports partial updates.
 *
 * @param {string} id
 * UUID of the menu item
 *
 * @param {Object} patch
 * Fields to update
 *
 * Example:
 * {
 *   Price: 250,
 *   Availability: false
 * }
 *
 * @returns {Promise<Object>}
 * Updated MenuItem row
 */
export const updateItem = itemRepo.updateItem;


/**
 * Deletes a menu item.
 *
 * Important:
 * If the item is linked in MenuSectionItem,
 * deletion may fail due to foreign key constraints.
 *
 * Recommended workflow:
 * 1. Remove section links
 * 2. Delete item
 *
 * @param {string} id
 * UUID of the item
 *
 * @returns {Promise<boolean>}
 */
export const deleteItem = itemRepo.deleteItem;

/**
 * Deletes a menu item and all its section links.
 * Use this instead of deleteItem when the item may be linked in MenuSectionItem.
 *
 * @param {string} id - UUID of the menu item
 * @returns {Promise<boolean>}
 */
export async function deleteMenuItem(id) {
  await linkRepo.removeAllLinksForItem(id);
  return itemRepo.deleteItem(id);
}


/* =========================================================
   5) Section ↔ Item Links
   ========================================================= */

/**
 * Creates a relationship between a menu section and a menu item.
 *
 * This uses the MenuSectionItem table which represents
 * a MANY-TO-MANY relationship.
 *
 * Example:
 * "Classic Burger" can appear in both:
 * - Burgers
 * - Best Sellers
 *
 * @param {Object} link
 * @param {string} link.menu_section_id
 * UUID of the section
 *
 * @param {string} link.menu_item_id
 * UUID of the item
 *
 * @param {number} link.sort_order
 * Determines item order inside the section
 *
 * @returns {Promise<Object>}
 * Newly created link row
 *
 * Edge cases:
 * - Duplicate links may be prevented by DB constraint
 */
export const addItemToSection = linkRepo.addItemToSection;


/**
 * Updates properties of a section-item relationship.
 *
 * Typically used for:
 * - updating sort_order
 * - reordering menu items
 *
 * @param {string} menu_section_id
 * @param {string} menu_item_id
 * @param {Object} patch
 *
 * Example:
 * {
 *   sort_order: 3
 * }
 *
 * @returns {Promise<Object>}
 */
export const updateLink = linkRepo.updateLink;


/**
 * Removes an item from a menu section.
 *
 * This DOES NOT delete the item itself.
 * It only removes the relationship.
 *
 * @param {Object} params
 * @param {string} params.menu_section_id
 * @param {string} params.menu_item_id
 *
 * @returns {Promise<boolean>}
 */
export const removeItemFromSection = linkRepo.removeItemFromSection;


/**
 * Retrieves all section-item relationships.
 *
 * Used internally by admin menu assembly to rebuild
 * the hierarchical structure of the menu.
 *
 * @returns {Promise<Array<Object>>}
 *
 * Example row:
 * {
 *   menu_section_id: "uuid",
 *   menu_item_id: "uuid",
 *   sort_order: 1
 * }
 */
export const listLinksAdmin = linkRepo.listLinksAdmin;

/**
 * Appends an item to the END of a section by automatically picking the next `sort_order`.
 *
 * @param {string} sectionId - UUID of the MenuSection (`MenuSection.id`)
 * @param {string} itemId - UUID of the MenuItem (`MenuItem.id`)
 *
 * @returns {Promise<Object>} Newly created (or existing) MenuSectionItem link row:
 * {
 *   menu_section_id: string,
 *   menu_item_id: string,
 *   sort_order: number,
 *   ...other columns
 * }
 */

export async function appendItemToSection(sectionId, itemId) {
  // 1) Prevent duplicate link
  const { data: existing, error: existsErr } = await supabase
    .from("MenuSectionItem")
    .select("*")
    .eq("menu_section_id", sectionId)
    .eq("menu_item_id", itemId)
    .maybeSingle();

  if (existsErr) throw existsErr;
  if (existing) return existing;

  // 2) Find the current max sort_order in this section
  const { data: maxRow, error: maxErr } = await supabase
    .from("MenuSectionItem")
    .select("sort_order")
    .eq("menu_section_id", sectionId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (maxErr) throw maxErr;

  const nextSortOrder = (maxRow?.sort_order ?? -1) + 1;

  // 3) Insert at the end
  return addItemToSection({
    menu_section_id: sectionId,
    menu_item_id: itemId,
    sort_order: nextSortOrder,
  });
}

/**
 * Inserts an item at the START of a section (sort_order = 0),
 * shifting all existing items down by +1.
 *
 * @param {string} sectionId - UUID of MenuSection (MenuSection.id)
 * @param {string} itemId - UUID of MenuItem (MenuItem.id)
 * @returns {Promise<Object>} The created (or existing) MenuSectionItem link row
 */
export async function prependItemToSection(sectionId, itemId) {
  // 1) Prevent duplicate link
  const { data: existing, error: existsErr } = await supabase
    .from("MenuSectionItem")
    .select("*")
    .eq("menu_section_id", sectionId)
    .eq("menu_item_id", itemId)
    .maybeSingle();

  if (existsErr) throw existsErr;
  if (existing) return existing;

  // 2) Load current links for this section (ordered)
  const { data: links, error: linksErr } = await supabase
    .from("MenuSectionItem")
    .select("menu_section_id, menu_item_id, sort_order")
    .eq("menu_section_id", sectionId)
    .order("sort_order", { ascending: true });

  if (linksErr) throw linksErr;

  // 3) Shift all existing links down (+1)
  // If there are no links, this step becomes a no-op.
  if (links?.length) {
    const shifted = links.map((l) => ({
      menu_section_id: l.menu_section_id,
      menu_item_id: l.menu_item_id,
      sort_order: (l.sort_order ?? 0) + 1,
    }));

    // Use upsert to update multiple rows efficiently.
    // Assumes a unique constraint on (menu_section_id, menu_item_id).
    const { error: shiftErr } = await supabase
      .from("MenuSectionItem")
      .upsert(shifted, { onConflict: "menu_section_id,menu_item_id" });

    if (shiftErr) throw shiftErr;
  }

  // 4) Insert new link at top
  const created = await addItemToSection({
    menu_section_id: sectionId,
    menu_item_id: itemId,
    sort_order: 0,
  });

  // 5) Optional: normalize sort_order to guarantee 0..n-1
  // This makes the ordering resilient even if old data had gaps/duplicates.
  await normalizeSectionSortOrder(sectionId);

  return created;
}

/**
 * Moves an item to a new position within a section (drag/drop reorder),
 * then normalizes the section's sort_order values to be sequential (0..n-1).
 *
 *
 * Behavior:
 * 1) Loads the current links for the section in sort_order
 * 2) Removes the moving item from its current position
 * 3) Inserts it at the requested newIndex (clamped)
 * 4) Rewrites every link’s sort_order to match its array index (0..n-1)
 *
 * Edge cases:
 * - Item not linked to section → throws (frontend should append/prepend first)
 * - newIndex < 0 → treated as 0
 * - newIndex >= length → treated as last position
 *
 * @param {string} sectionId - UUID of MenuSection
 * @param {string} itemId - UUID of MenuItem to move
 * @param {number} newIndex - Target index (0-based) after move
 *
 * @returns {Promise<Array<Object>>}
 * The updated list of MenuSectionItem link rows for that section (sorted by new order)
 */
export async function moveItemWithinSection(sectionId, itemId, newIndex) {
  const safeIndex = Number.isFinite(newIndex) ? Math.trunc(newIndex) : 0;

  // 1) Load current links
  const { data: links, error: linksErr } = await supabase
    .from("MenuSectionItem")
    .select("menu_section_id, menu_item_id, sort_order")
    .eq("menu_section_id", sectionId)
    .order("sort_order", { ascending: true });

  if (linksErr) throw linksErr;

  const list = Array.isArray(links) ? links : [];

  // 2) Find the item to move
  const fromIndex = list.findIndex((l) => l.menu_item_id === itemId);
  if (fromIndex === -1) {
    throw new Error("Item is not linked to this section. Add it first before reordering.");
  }

  // 3) Remove it and insert at target index (clamped)
  const [moving] = list.splice(fromIndex, 1);

  const clampedIndex = clamp(safeIndex, 0, list.length); // note: list.length is new length after splice
  list.splice(clampedIndex, 0, moving);

  // 4) Normalize sort_order: 0..n-1
  const normalized = list.map((l, idx) => ({
    menu_section_id: sectionId,
    menu_item_id: l.menu_item_id,
    sort_order: idx,
  }));

  const { error: upErr } = await supabase
    .from("MenuSectionItem")
    .upsert(normalized, { onConflict: "menu_section_id,menu_item_id" })
    .select();

  if (upErr) throw upErr;

  // Return the normalized list (already in correct order)
  return normalized;
}


/* =========================================================
   6) IMAGE OPERATIONS (Menu Images)
   ========================================================= */

/**
 * Uploads a menu item image to Supabase Storage.
 *
 * This function delegates the actual upload to the image repository.
 *
 * Path convention used:
 * sectionId/itemId.ext
 *
 * Example:
 * burgers/550e8400-e29b-41d4-a716-446655440000.png
 *
 * @param {File|Blob} file
 * Image file selected from the frontend (input type="file")
 *
 * @param {Object} params
 * @param {string} params.sectionId
 * UUID of the menu section the item belongs to
 *
 * @param {string} params.itemId
 * UUID of the menu item
 *
 * @returns {Promise<{path: string, publicUrl: string}>}
 *
 * Example return value:
 * {
 *   path: "burgers/550e8400-e29b-41d4-a716-446655440000.png",
 *   publicUrl: "https://project.supabase.co/storage/v1/object/public/menu-images/burgers/550e8400-e29b-41d4-a716-446655440000.png"
 * }
 */
export const uploadMenuImage = imageRepo.uploadMenuImage;


/**
 * Converts an internal image storage path into a publicly accessible URL.
 *
 * Example:
 * Input:
 * "burgers/550e8400.png"
 *
 * Output:
 * "https://project.supabase.co/storage/v1/object/public/menu-images/burgers/550e8400.png"
 *
 * @param {string|null|undefined} imagePathOrUrl
 *
 * @returns {string}
 * Public image URL
 *
 * Edge cases:
 * - Missing image path
 * - Invalid storage path
 */
export const toPublicImageUrl = imageRepo.toPublicImageUrl;


/**
 * Default placeholder image used when a menu item has no image.
 *
 * This prevents broken image elements in the UI.
 *
 * Example usage in frontend:
 *
 * <img src={item.ImageUrl || menuService.NO_IMAGE_URL} />
 *
 * @type {string}
 */
export const NO_IMAGE_URL = imageRepo.NO_IMAGE_URL;


/* =========================================================
   7) PRIVATE HELPERS (Internal utilities)
   ========================================================= */

/**
 * Groups menu items into their respective sections using the
 * MenuSectionItem link table.
 *
 * Workflow:
 * 1) Build a map of sections
 * 2) Build a map of items
 * 3) Iterate link table to connect items to sections
 * 4) Sort items inside each section using sort_order
 *
 * @param {Array<Object>} sections
 * Raw rows from MenuSection table
 *
 * @param {Array<Object>} links
 * Rows from MenuSectionItem table containing:
 * { menu_section_id, menu_item_id, sort_order }
 *
 * @param {Array<Object>} items
 * Raw rows from MenuItem table
 *
 * @returns {Array<{section:Object, items:Array<Object>}>}
 */
function groupMenuByLinks(sections, links, items) {

  const sectionMap = new Map(
    (sections || []).map((section) => [
      section.id,
      { section, items: [] },
    ])
  );

  const itemMap = new Map(
    (items || []).map((item) => [item.id, item])
  );

  for (const link of links || []) {

    const bucket = sectionMap.get(link.menu_section_id);
    const item = itemMap.get(link.menu_item_id);

    if (!bucket || !item) continue;

    bucket.items.push({
      ...item,
      sort_order: link.sort_order,
      ImageUrl: imageRepo.toPublicImageUrl(item.ImagePath),
    });
  }

  // Sort items in each section
  for (const bucket of sectionMap.values()) {
    bucket.items.sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );
  }

  return Array.from(sectionMap.values());
}

/**
 * Ensures a number stays within [min, max].
 * @param {number} n
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Normalizes sort_order for a section so it becomes 0..n-1.

 * @param {string} sectionId - UUID of MenuSection
 * @returns {Promise<Array<Object>>} normalized link rows
 */
async function normalizeSectionSortOrder(sectionId) {
  const { data: links, error } = await supabase
    .from("MenuSectionItem")
    .select("menu_section_id, menu_item_id, sort_order")
    .eq("menu_section_id", sectionId)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  const list = Array.isArray(links) ? links : [];

  const normalized = list.map((l, idx) => ({
    menu_section_id: sectionId,
    menu_item_id: l.menu_item_id,
    sort_order: idx,
  }));

  if (!normalized.length) return [];

  const { error: upErr } = await supabase
    .from("MenuSectionItem")
    .upsert(normalized, { onConflict: "menu_section_id,menu_item_id" });

  if (upErr) throw upErr;

  return normalized;
}