import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useDb } from "./use-db";
import { get24hRecords, get24hRecordsByActivityId } from "@lftm/api";

interface Props {
  userId: string;
}

export const useMyActivity = ({ userId }: Props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { client } = useDb();
  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: ["use-my-activity", userId, selectedDate.toISOString()],
    queryFn: () => get24hRecords(client, { userId, date: selectedDate }),
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await queryClient.invalidateQueries([
      "use-my-activity",
      userId,
      selectedDate,
    ]);
  };

  const onDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setSelectedDate(newDate);
    }
  };

  return {
    data,
    error: error as Error,
    isLoading,
    invalidate,
    isRefetching,
    onDateChange,
    selectedDate,
  };
};

interface ActivityProps extends Props {
  activityId: string | null;
}
export const useActivityRecords = ({ userId, activityId }: ActivityProps) => {
  const { client } = useDb();
  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: ["use-activity-records", userId, activityId],
    queryFn: () =>
      get24hRecordsByActivityId(client, {
        userId,
        date: new Date(),
        activityId: activityId ?? "",
      }),
    refetchOnWindowFocus: false,
    enabled: activityId != null,
  });
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await queryClient.invalidateQueries([
      "use-activity-records",
      userId,
      activityId,
    ]);
  };
  return {
    data,
    error: error as Error,
    isLoading,
    invalidate,
    isRefetching,
  };
};
