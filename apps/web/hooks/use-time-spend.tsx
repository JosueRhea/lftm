import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDb } from "./use-db";
import { PostgrestError } from "@supabase/supabase-js";
import { useActivities } from "./use-activities";
import { useEffect, useState } from "react";
import { getRecords } from "@lftm/api";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";

interface Props {
  userId: string;
}

export const useTimeSpend = ({ userId }: Props) => {
  const { client } = useDb();
  const { data: activities } = useActivities({ userId });
  const [selectedActivity, setSelectedActivity] = useState(
    activities && activities?.length > 0 ? activities?.[0].id : null
  );
  const [date, setDate] = useState<DateRange | undefined>({
    // last 30 days
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: ["use-time-spend", userId, selectedActivity, date?.from, date?.to],
    queryFn: () =>
      getRecords(client, {
        userId,
        from: date?.from,
        to: date?.to,
        activityId: selectedActivity,
      }),
    refetchOnWindowFocus: true,
    enabled: selectedActivity != null,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    setSelectedActivity(
      activities && activities?.length > 0 ? activities?.[0].id : null
    );
  }, [activities]);

  const invalidate = async () => {
    await queryClient.invalidateQueries([
      "use-time-spend",
      userId,
      selectedActivity,
    ]);
  };

  const onActivityChange = (newActivityId: string) => {
    setSelectedActivity(newActivityId);
  };

  return {
    data,
    error: error as PostgrestError,
    isLoading,
    isRefetching,
    invalidate,
    onActivityChange,
    selectedActivity,
    activities: activities ?? null,
    date,
    setDate,
  };
};
