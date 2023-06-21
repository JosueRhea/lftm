import {
  Database,
  RecordWithCounterProps,
  RecordWithRelationsProps,
} from "@/types/db";
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
  { userId }: { userId: string }
) {
  const { data } = await client
    .from("profiles")
    .select("current_activity")
    .eq("id", userId)
    .single()
    .throwOnError();

  if (data?.current_activity == null) return null;

  return await client
    .from("record")
    .select("*, activity(*)")
    .eq("id", data?.current_activity)
    .single()
    .throwOnError();
}

export function suscribeToCurrentUserData(
  client: SupabaseClient<Database>,
  {
    userId,
    callback,
    tag,
  }: {
    userId: string;
    callback: (data: any) => void;
    tag: string;
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

  console.log(recordData);

  if (recordData.error) return recordData;
  return await client
    .from("profiles")
    .update({
      current_activity: null,
    })
    .eq("id", userId);
}

export async function get24hRecords(
  client: SupabaseClient<Database>,
  { userId }: { userId: string }
) {
  const res = await client
    .from("record")
    .select(`*, activity(*)`)
    .eq("user_id", userId)
    .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order("created_at", { ascending: false })
    .throwOnError();

  const data = res.data;

  const findedRecords: RecordWithCounterProps[] = [];

  if (data == null || data.length <= 0)
    return { records: findedRecords, totalCount: 0 };

  const currentDate = new Date(); // Get the current date and time
  currentDate.setHours(0, 0, 0, 0); // Set the current time to the start of the day

  const datesArray = [];

  for (let i = 0; i < 24; i++) {
    const hourDate = new Date(currentDate.getTime() + i * 60 * 60 * 1000); // Add the current iteration hour to the date
    datesArray.push(hourDate);
  }
  const hours = datesArray.map((date) => {
    const record = data.find(
      (record) =>
        new Date(record.created_at as string).getHours() === date.getHours() &&
        new Date(record.created_at as string).getDate() === date.getDate()
    );

    return {
      date: date.toISOString(),
      record: record ?? null,
    };
  });

  let totalTrackedHours = 0;
  hours.forEach((hour) => {
    if (hour.record == null) {
      return;
    }

    const findedRecord = findedRecords.find(
      (n) => n.activity.id === hour.record?.activity_id
    );

    const record = hour.record as RecordWithRelationsProps;
    const startDate = new Date(record.created_at as string).getTime();
    const endDate =
      record.end_date != null
        ? new Date(record.end_date as string).getTime()
        : new Date().getTime();

    // i wanna convert the diff to a hours like 1.2 or whatever
    const diff = (endDate - startDate) / (1000 * 60 * 60);
    if (findedRecord == null) {
      findedRecords.push({
        ...record,
        counter: diff,
        percent: (diff / 24) * 100,
      });
    } else {
      findedRecord.counter += diff;
      findedRecord.percent = (diff / 24) * 100;
    }
    totalTrackedHours += diff;
  });

  const untrackedHours = 24 - totalTrackedHours;

  if (untrackedHours > 0) {
    findedRecords.push({
      activity: {
        created_at: "untracked",
        icon: "untracked",
        id: "untracked",
        name: "untracked",
        user_id: "untracked",
      },
      activity_id: "untracked",
      counter: untrackedHours,
      created_at: "untracked",
      end_date: "untracked",
      id: "untracked",
      user_id: "untracked",
      percent: (untrackedHours / 24) * 100,
    });
  }

  findedRecords.sort((a, b) => b.counter - a.counter);

  return { records: findedRecords, totalCount: totalTrackedHours };
}
