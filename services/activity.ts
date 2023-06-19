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
  const channel = client.channel("changes").on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "activity",
      filter: `user_id=eq.${userId}`,
    },
    callback
  );

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

export async function getCurrentActivity(
  client: SupabaseClient<Database>,
  { activityId }: { activityId: string }
) {
  return await client
    .from("record")
    .select("*, activity(*)")
    .eq("id", activityId)
    .single();
}

export function suscribeToCurrentUserData(
  client: SupabaseClient<Database>,
  {
    userId,
    callback,
    tag
  }: {
    userId: string;
    callback: (data: any) => void;
    tag: string
  }
) {
  const channel = client.channel(tag).on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "profiles",
      filter: `id=eq.${userId}`,
    },
    callback
  );

  return channel;
}

export async function createRecord(
  client: SupabaseClient<Database>,
  {
    activityId,
    userId,
  }: {
    activityId: string;
    userId: string;
  }
) {
  const recordData = await client
    .from("record")
    .insert({
      activity_id: activityId,
      user_id: userId,
    })
    .select("*")
    .single();

  if (recordData.error) return recordData;

  return await client
    .from("profiles")
    .update({
      current_activity: recordData.data.id,
    })
    .eq("id", userId);
}

export async function stopRecord(
  client: SupabaseClient<Database>,
  { userId, currentRecordId }: { userId: string; currentRecordId: string }
) {
  const recordData = await client
    .from("record")
    .update({
      end_date: new Date().toISOString(),
    })
    .eq("id", currentRecordId);

  if (recordData.error) return recordData;
  return await client
    .from("profiles")
    .update({
      current_activity: null,
    })
    .eq("id", userId);
}
