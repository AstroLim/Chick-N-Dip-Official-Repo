import * as authRepo from "../repositories/auth.repo";
import { supabase } from "../utils/supabase/client";

const PENDING_KEY = "pendingProfile";

/**
 * Registers a new user account.
 *
 * This function temporarily stores the user's profile information
 * (first name and last name) in localStorage before calling the
 * repository signUp function.
 *
 * Why this exists:
 * Supabase Auth creates the user immediately, but the profile
 * table entry may not yet exist until the database trigger runs.
 * Storing the data locally ensures we can update the profile
 * once authentication is confirmed.
 *
 * @param {Object} params
 * @param {string} params.email - User email address
 * @param {string} params.password - User password
 * @param {string} params.firstName - User first name
 * @param {string} params.lastName - User last name
 *
 * @returns {Promise<Object>} Supabase authentication response
 */
export async function register({ email, password, firstName, lastName }) {
  localStorage.setItem(
    PENDING_KEY,
    JSON.stringify({ firstName, lastName, email })
  );

  return authRepo.signUp({ email, password, firstName, lastName });
}

/**
 * Applies any pending profile information stored during registration.
 *
 * After a user successfully signs in or confirms their account,
 * this function checks if there is pending profile data stored
 * in localStorage and updates the corresponding row in the
 * "profiles" table.
 *
 * This ensures the user's FirstName and LastName fields are
 * correctly saved even if the profile row was created asynchronously.
 *
 * Workflow:
 * 1. Check if pending profile data exists in localStorage
 * 2. Retrieve the currently authenticated user from Supabase
 * 3. Update the user's profile record in the database
 * 4. Remove the pending data if the update succeeds
 *
 * @returns {Promise<boolean>}
 * Returns:
 *  - true  → profile was successfully updated
 *  - false → no pending data or update failed
 */
export async function applyPendingProfileIfAny() {
  const pendingRaw = localStorage.getItem(PENDING_KEY);

  if (!pendingRaw) return false;

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) return false;

  try {
    const pending = JSON.parse(pendingRaw);

    const { error: updErr } = await supabase
      .from("profiles")
      .update({
        FirstName: pending.firstName,
        LastName: pending.lastName,
      })
      .eq("id", data.user.id);

    if (!updErr) {
      localStorage.removeItem(PENDING_KEY);
      return true;
    }
  } catch (_) {

  }

  return false;
}

/**
 * Logs in an existing user.
 *
 * Delegates authentication to the repository layer which
 * communicates with Supabase Auth.
 *
 * @param {Object} params
 * @param {string} params.email - User email address
 * @param {string} params.password - User password
 *
 * @returns {Promise<Object>} Supabase authentication response
 */
export async function login({ email, password }) {
  return authRepo.signIn({ email, password });
}

/**
 * Logs out the currently authenticated user.
 *
 * Clears the user's session from Supabase Auth.
 *
 * @returns {Promise<Object>} Supabase sign-out response
 */
export async function logout() {
  return authRepo.signOut();
}