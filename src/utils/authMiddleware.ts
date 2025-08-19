import { createClient } from "./supabase/server";

export async function checkUserAuth() {
const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return false;
  }
  return true;
}