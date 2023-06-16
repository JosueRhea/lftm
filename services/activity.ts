import { Database } from "@/types/db";
import { SupabaseClient } from "@supabase/supabase-js";

export function suscribeToActivityChanges(
  client: SupabaseClient<Database>,
  {
    userId,
    callback,
  }: {
    userId: string;
    callback: (data: any) => void;
  }
) {

  const channel = client
    .channel("changes")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "activity",
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe(() => {
      console.log("subscribed");
    });

  return channel;
}

export async function createActivity(
  client: SupabaseClient<Database>,
  { userId, icon, name }: { userId: string; name: string; icon: string }
) {
  return await client
    .from("activity")
    .insert([{ user_id: userId, icon, name }]);
}
