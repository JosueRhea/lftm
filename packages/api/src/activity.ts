import {
  Database,
  RecordWithCounterProps,
  RecordWithRelationsProps,
  TimeSpendProps,
} from "./types";
import {
  createDayDatesArray,
  getCounterFromStartAndEndDate,
  sumTwoCounters,
} from "./lib/date";
import { SupabaseClient } from "@supabase/supabase-js";
import { differenceInDays } from "date-fns";

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
    })
    .select("*")
    .single();

  if (recordData.error) return recordData;

  const activityData = await client
    .from("activity")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", activityId);

  if (activityData.error) return activityData;

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
      end_date: new Date().toUTCString(),
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

  from.setHours(0, 0, 0, 0);
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

  const data = res.data as RecordWithRelationsProps[];

  if (data == null || data.length <= 0) return { dayRecords: [] };

  const datesArray = createDayDatesArray({ from, to });

  const parsedDays = datesArray.map((day) => {
    const start = day.start.getTime();
    const end = day.end.getTime();

    const findedDays = data.filter((record) => {
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

    return {
      start: day.start,
      end: day.end,
      records: findedDays,
    };
  });

  let totalTrackedTime = {
    hours: 0,
    minutes: 0,
    seconds: 0,
    days: 0,
  }
  const daysData: TimeSpendProps[] = parsedDays.map((day) => {
    const start = day.start;
    const end = day.end;

    const defaultCounterTime = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      days: 0,
    };

    const formatedDate = start.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    });

    if (day.records.length <= 0)
      return {
        dayStart: day.start,
        dayEnd: day.end,
        counter: 0,
        counterTime: defaultCounterTime,
        formatedDate,
      };

    const startTime = start.getTime();
    const endTime = end.getTime();

    let counter = 0.0;
    let counterTime = defaultCounterTime;
    day.records.forEach((record) => {
      const startDate = new Date(record.created_at as string);
      if (startDate.getTime() < startTime) {
        startDate.setTime(startTime);
      }

      const endDate =
        record.end_date != null
          ? new Date(record.end_date as string)
          : new Date();

      if (endDate.getTime() > endTime) {
        endDate.setTime(endTime);
      }

      const sub = endDate.getTime() - startDate.getTime();
      const diff = sub / (1000 * 60 * 60);
      const newCounterTime = getCounterFromStartAndEndDate(startDate, endDate);
      counter += diff;
      counterTime = sumTwoCounters(newCounterTime, counterTime);
      totalTrackedTime = sumTwoCounters(totalTrackedTime, newCounterTime);
    });

    return {
      dayStart: day.start,
      dayEnd: day.end,
      counter: counter,
      counterTime: counterTime,
      formatedDate,
    };
  });

  return {
    dayRecords: daysData,
    totalTrackedTime,
  };
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
    .update({ created_at: record.created_at, end_date: record.end_date })
    .eq("id", record.id);
  if (res.error) {
    throw new Error("Something went wrong updating the record");
  }

  return res.data;
}
