import { Database } from "@/types/db";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getUserData(
  client: SupabaseClient<Database>,
  { userId }: { userId: string }
) {
  return await client
    .from("profiles")
    .select("activity(*), *")
    .eq("id", userId)
    .single();
}

// export async function updateUserData(
//   client: SupabaseClient<Database>,
//   { userId, data }: { userId: string; data: any }
// ) {
//   return await client.from("profiles").update(data).eq("id", userId);
// }
