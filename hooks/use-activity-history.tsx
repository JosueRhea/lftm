import { deleteRecordActivity, getActivityHistory } from "@/services/activity";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDb } from "./use-db";
import { RecordWithRelationsProps } from "@/types/db";
import { useState } from "react";

interface Props {
  userId: string;
}

export function useActivityHistory({ userId }: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { client } = useDb();
  const key = ["activity-history", userId, selectedDate.toISOString()];
  const { data, isLoading, isRefetching, error } = useQuery({
    queryKey: key,
    queryFn: () => getActivityHistory(client, { userId, date: selectedDate }),
  });
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (recordId: string) => {
      await deleteRecordActivity(client, { recordId });
    },
    onMutate: async (recordId) => {
      await queryClient.cancelQueries();

      const previousRecords = queryClient.getQueryData(
        key
      ) as RecordWithRelationsProps[];

      const newRecords = previousRecords?.filter(
        (record) => record.id !== recordId
      );

      queryClient.setQueryData(key, newRecords);
      return { previousRecords };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(key, context?.previousRecords);
    },
    onSettled: () => {
      queryClient.invalidateQueries();
    },
  });

  const deleteRecord = async (recordId: string) => {
    await mutateAsync(recordId);
  };

  const onDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setSelectedDate(newDate);
      queryClient.invalidateQueries(key);
    }
  };

  return {
    data,
    error,
    isLoading,
    isRefetching,
    deleteRecord,
    onDateChange,
    selectedDate,
  };
}
