import { supabase } from "../utils/supabase/client.js";
import * as accountRepo from "../repositories/account.repo.js";
import * as validators from "../utils/validators.js"
import * as normalizers from "../utils/normalizers.js"

const NAME_MAX = 80;
const EMAIL_MAX = 120;

/**
 * GET OWN PROFILE
 */
export async function getMyProfile() {
  const userId = await getCurrentUserIdOrThrow();
  return accountRepo.getProfileById(userId);
}

/**
 * UPDATE OWN PROFILE
 * Email change updates both Auth and profiles table.
 */
export async function updateMyProfile({ firstName, lastName, email }) {
  const user = await getCurrentUserOrThrow();
  const patch = {};

  if (firstName !== undefined) {
    const FirstName = normalizers.cleanText(firstName);
    validators.assertLen("First name", FirstName, 1, NAME_MAX);
    patch.FirstName = FirstName;
  }

  if (lastName !== undefined) {
    const LastName = normalizers.cleanText(lastName);
    validators.assertLen("Last name", LastName, 1, NAME_MAX);
    patch.LastName = LastName;
  }

  if (email !== undefined) {
    const Email = normalizers.cleanEmail(email);
    validators.assertLen("Email", Email, 5, EMAIL_MAX);

    const { error } = await supabase.auth.updateUser({ email: Email });
    if (error) throw error;

    patch.Email = Email;
  }

  if (!Object.keys(patch).length) {
    throw new Error("No profile changes provided.");
  }

  return accountRepo.updateProfile(user.id, patch);
}

/**
 * CHANGE OWN PASSWORD
 */
export async function changeMyPassword({ newPassword }) {
  await getCurrentUserOrThrow();

  const password = (newPassword ?? "").toString();
  validators.assertLen("Password", password, 6, 128);

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) throw error;
  return true;
}

/**
 * ADMIN: LIST ALL ACCOUNTS
 */
export async function listAllAccounts({ limit = 100, offset = 0, role } = {}) {
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Forbidden. Admin access required.");

  if (role) validators.assertRole(role);

  return accountRepo.listProfiles({ limit, offset, role });
}

/**
 * ADMIN: GET ACCOUNT BY ID
 */
export async function getAccountByIdForAdmin(id) {
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("Forbidden. Admin access required.");

  return accountRepo.getProfileById(id);
}

// HELPERS
export async function getCurrentUserOrThrow() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;

  const user = data?.user ?? null;
  if (!user?.id) throw new Error("Not authenticated.");

  return user;
}

export async function getCurrentUserIdOrThrow() {
  const user = await getCurrentUserOrThrow();
  return user.id;
}

export async function getCurrentAccountOrThrow() {
  const user = await getCurrentUserOrThrow();
  const profile = await accountRepo.getProfileById(user.id);

  return {
    auth: user,
    profile,
  };
}

export async function isCurrentUserAdmin() {
  const { profile } = await getCurrentAccountOrThrow();
  return profile?.Role === "admin";
}