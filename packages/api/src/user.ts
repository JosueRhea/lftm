import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types";

export async function getUserData(
  client: SupabaseClient<Database>,
  { userId }: { userId: string }
) {
  return await client
    .from("profiles")
    .select("activity(*), *")
    .eq("id", userId)
    .single()
    .throwOnError();
}

export async function getActivities(
  client: SupabaseClient<Database>,
  { userId }: { userId: string }
) {
  return await client
    .from("activity")
    .select("*")
    .order("updated_at", { ascending: false })
    .eq("user_id", userId);
}
