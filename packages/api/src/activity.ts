import {
  Database,
  DayRecordStat,
  RecordWithCounterProps,
  RecordWithRelationsProps,
} from "./types";
import {
  createDayDatesArray,
  getCounterFromStartAndEndDate,
  sumTwoCounters,
} from "./lib/date";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  isSameDay,
  endOfDay,
  addDays,
  startOfDay,
  differenceInCalendarDays,
  differenceInMilliseconds,
} from "date-fns";

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
  // const currentActivity = await client
  //   .from("profiles")
  //   .select("current_activity")
  //   .eq("id", userId)
  //   .single()
  //   .throwOnError();

  // if (currentActivity.error) {
  //   throw new Error("Something went wrong");
  // }

  // if (currentActivity.data.current_activity == null) return null;

  const activityData = await client
    .from("record")
    .select("*, activity(*)")
    .eq("user_id", userId)
    .is("end_date", null)
    .throwOnError();

  if (activityData.error) {
    throw new Error("Something went wrong");
  }

  return activityData.data;
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
      event: "*",
      schema: "public",
      table: "record",
      filter: `user_id=eq.${userId}`,
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
    created_at,
  }: {
    activityId: string;
    userId: string;
    created_at: string;
  }
) {
  const recordData = await client
    .from("record")
    .insert({
      activity_id: activityId,
      user_id: userId,
      created_at: created_at,
      elapsed_ms: 0,
    })
    .select("*")
    .single();

  if (recordData.error) return recordData;

  const activityData = await client
    .from("activity")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", activityId);

  return activityData;
}

const parseStartAndEndDate = (start: string, end: string) => {
  const startDay = new Date(start);
  const endDay = new Date(end);
  const sameDay = isSameDay(startDay, endDay);
  if (sameDay) {
    const elapsedMs = differenceInMilliseconds(endDay, startDay);
    return [{ start: startDay, end: endDay, diff: elapsedMs }];
  }

  const daysDiff = differenceInCalendarDays(endDay, startDay);
  console.log({ daysDiff });

  const result = [];

  for (let i = 0; i <= daysDiff; i++) {
    const currentDate = addDays(startDay, i);

    const rangeStart = i === 0 ? startDay : startOfDay(currentDate);
    const rangeEnd = i === daysDiff ? endDay : endOfDay(currentDate);

    const diff = differenceInMilliseconds(rangeEnd, rangeStart);

    result.push({
      start: rangeStart,
      end: rangeEnd,
      diff: diff,
    });
  }

  return result;
};

export async function stopRecord(
  client: SupabaseClient<Database>,
  { currentRecordId, userId }: { userId: string; currentRecordId: string }
) {
  const recordToUpdate = await client
    .from("record")
    .select("created_at, activity_id")
    .eq("id", currentRecordId)
    .single();
  if (recordToUpdate.error || !recordToUpdate?.data.created_at)
    return recordToUpdate;

  // const diff = differenceInMilliseconds(
  //   new Date(),
  //   new Date(recordToUpdate.data.created_at)
  // );

  // // Convert milliseconds to hours, minutes, and seconds
  // const hours = Math.floor(diff / (1000 * 60 * 60));
  // const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  // const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // console.log(
  //   `Time elapsed: ${hours} hours, ${minutes} minutes, ${seconds} seconds`
  // );

  const result = parseStartAndEndDate(
    recordToUpdate.data.created_at,
    new Date().toISOString()
  );

  const { error } = await client
    .from("record")
    .delete()
    .eq("id", currentRecordId);

  if (error) {
    throw new Error("Something went wrong");
  }

  const recordData = await client.from("record").insert(
    result.map((data) => {
      return {
        created_at: data.start.toISOString(),
        end_date: data.end.toISOString(),
        activity_id: recordToUpdate.data.activity_id,
        user_id: userId,
        elapsed_ms: data.diff,
      };
    })
  );

  return recordData;
}

export async function get24hRecords(
  client: SupabaseClient<Database>,
  { userId, date }: { userId: string; date: Date }
) {
  date.setHours(0, 0, 0, 0);
  const dayStart = new Date(date.getTime());
  date.setHours(23, 59, 59, 999);
  const dayEnd = new Date(date.getTime());

  const isoDayStart = dayStart.toISOString();
  const isoDayEnd = dayEnd.toISOString();

  const res = await client
    .from("record")
    .select(`*, activity(*)`)
    .eq("user_id", userId)
    .or(
      `and(created_at.gte.${isoDayStart},created_at.lte.${isoDayEnd}),and(end_date.gte.${isoDayStart},end_date.lte.${isoDayEnd}),and(created_at.lte.${isoDayStart},end_date.gte.${isoDayEnd})`
    )
    .order("created_at", { ascending: true })
    .throwOnError();

  const data = res.data as RecordWithRelationsProps[];

  const findedRecords: RecordWithCounterProps[] = [];

  if (data == null || data.length <= 0)
    return { records: findedRecords, totalCount: 0 };

  let totalTrackedHours = 0;
  data.forEach((record) => {
    if (record == null) {
      return;
    }

    const findedRecord = findedRecords.find(
      (n) => n.activity.id === record?.activity_id
    );

    // const record = hour.record as RecordWithRelationsProps;
    const startDate = new Date(record.created_at as string);
    if (startDate.getDate() < dayStart.getDate()) {
      startDate.setTime(dayStart.getTime());
    }

    const endDate =
      record.end_date != null
        ? new Date(record.end_date as string)
        : new Date();

    if (endDate.getDate() > dayEnd.getDate()) {
      endDate.setTime(dayEnd.getTime());
    }

    // i wanna convert the diff to a hours like 1.2 or whatever
    const sub = endDate.getTime() - startDate.getTime();
    const diff = sub / (1000 * 60 * 60);
    if (findedRecord == null) {
      findedRecords.push({
        ...record,
        counter: diff,
        counterTime: getCounterFromStartAndEndDate(startDate, endDate),
      });
    } else {
      // const sum = findedRecord.counter + diff;
      findedRecord.counter += diff;
      const newCounterTime = getCounterFromStartAndEndDate(startDate, endDate);
      if (findedRecord.counterTime) {
        findedRecord.counterTime = sumTwoCounters(
          newCounterTime,
          findedRecord.counterTime
        );
      }
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
        updated_at: "untracked",
      },
      activity_id: "untracked",
      counter: untrackedHours,
      created_at: "untracked",
      elapsed_ms: 0,
      end_date: "untracked",
      id: "untracked",
      user_id: "untracked",
    });
  }

  findedRecords.sort((a, b) => b.counter - a.counter);

  return { records: findedRecords, totalCount: totalTrackedHours };
}

export async function getRecords(
  client: SupabaseClient<Database>,
  {
    userId,
    from,
    to,
    activityId,
  }: {
    userId: string;
    from: Date | undefined;
    to: Date | undefined;
    activityId: string | null | undefined;
  }
) {
  if (!activityId || !from || !to) return { dayRecords: [] };

  from.setHours(20, 0, 0, 0);
  to.setHours(23, 59, 59, 999);

  const isoDayStart = from.toISOString();
  const isoDayEnd = to.toISOString();

  const res = await client
    .from("record")
    .select(`*, activity(*)`)
    .eq("user_id", userId)
    .eq("activity_id", activityId)
    .or(
      `and(created_at.gte.${isoDayStart},created_at.lte.${isoDayEnd}),and(end_date.gte.${isoDayStart},end_date.lte.${isoDayEnd}),and(created_at.lte.${isoDayStart},end_date.gte.${isoDayEnd})`
    )
    .order("created_at", { ascending: true });

  if (res.error) {
    throw new Error("Something went wrong " + res.error.message);
  }

  const data = res.data as RecordWithRelationsProps[];
  const datesArray = createDayDatesArray({ from, to });

  const parsedDays: DayRecordStat[] = datesArray.map((day) => {
    const start = day.start.getTime();
    const end = day.end.getTime();

    const filtered = data.filter((record) => {
      const recordStart = new Date(record.created_at as string).getTime();
      const recordEnd = record.end_date
        ? new Date(record.end_date).getTime()
        : new Date().getTime();

      if (
        (recordStart >= start && recordStart <= end) ||
        (recordEnd >= start && recordEnd <= end) ||
        (recordStart <= start && recordEnd >= end)
      ) {
        return true;
      }

      return false;
    });

    const tracked_ms = filtered.reduce((acc, record) => {
      return acc + record.elapsed_ms;
    }, 0);

    const avg_elapsed_ms = tracked_ms / filtered.length;

    return {
      day: day.start.toISOString(),
      tracked_ms: tracked_ms,
      activity_id: activityId,
      avg_elapsed_ms: avg_elapsed_ms,
    };
  });

  return { dayRecords: parsedDays };
}

export async function getActivityHistory(
  client: SupabaseClient<Database>,
  {
    userId,
    date,
  }: {
    userId: string;
    date: Date;
  }
) {
  date.setHours(0, 0, 0, 0);
  const isoDayStart = date.toISOString();
  date.setHours(23, 59, 59, 999);
  const dayEnd = new Date(date.getTime());
  const isoDayEnd = dayEnd.toISOString();

  console.log({ isoDayStart, isoDayEnd });
  const { data, error } = await client
    .from("record")
    .select("*, activity(*)")
    .eq("user_id", userId)
    .gte("created_at", isoDayStart)
    .lte("created_at", isoDayEnd)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error("Something went wrong");
  }

  return data;
}

export const deleteRecordActivity = async (
  client: SupabaseClient<Database>,
  { recordId }: { recordId: string }
) => {
  const res = await client.from("record").delete().eq("id", recordId);

  if (res.error) {
    throw new Error("Something went wrong");
  }

  return res.data;
};

export async function updateRecordActivity(
  client: SupabaseClient<Database>,
  { record }: { record: RecordWithRelationsProps }
) {
  const res = await client
    .from("record")
    .update({
      created_at: record.created_at,
      end_date: record.end_date,
      elapsed_ms: record.elapsed_ms,
    })
    .eq("id", record.id);
  if (res.error) {
    throw new Error("Something went wrong updating the record");
  }

  return res.data;
}
