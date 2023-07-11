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

// export async function updateUserData(
//   client: SupabaseClient<Database>,
//   { userId, data }: { userId: string; data: any }
// ) {
//   return await client.from("profiles").update(data).eq("id", userId);
// }
