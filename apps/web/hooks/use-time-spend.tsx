import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDb } from "./use-db";
import { PostgrestError } from "@supabase/supabase-js";
import { useActivities } from "./use-activities";
import { useEffect, useState } from "react";
import { get7dRecords } from "@lftm/api";

interface Props {
  userId: string;
}

export const useTimeSpend = ({ userId }: Props) => {
  const { client } = useDb();
  const { data: activities } = useActivities({ userId });
  const [selectedActivity, setSelectedActivity] = useState(
    activities && activities?.length > 0
      ? activities?.[0].id
      : null
  );
  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: ["use-time-spend", userId, selectedActivity],
    queryFn: () =>
      get7dRecords(client, {
        userId,
        date: new Date(),
        activityId: selectedActivity,
      }),
    refetchOnWindowFocus: true,
    enabled: selectedActivity != null,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    setSelectedActivity(
      activities && activities?.length > 0
        ? activities?.[0].id
        : null
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
  };
};
