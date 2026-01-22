import { supabase } from "../lib/supabaseClient";

/**
 * Update the logged-in user's profile row.
 * Assumes your trigger created a row in public.profiles at signup.
 */

export async function updateMyProfile(profile) {
  const { data: userResp, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!userResp?.user) throw new Error("Not authenticated");

  const user = userResp.user;

  const { error } = await supabase
    .from("profiles")
    .update(profile)
    .eq("id", user.id);

  if (error) throw error;
}