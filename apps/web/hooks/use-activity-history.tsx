import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDb } from "./use-db";
import { RecordWithRelationsProps } from "@/types/db";
import { useState } from "react";
import { deleteRecordActivity, getActivityHistory, updateRecordActivity } from "@lftm/api";

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
  const { mutateAsync: deleteRecordMut } = useMutation({
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

  const { mutate: updateRecordMut } = useMutation({
    mutationFn: async (newRecord: RecordWithRelationsProps) => {
      await updateRecordActivity(client, { record: newRecord });
    },
    onMutate: async (newRecord: RecordWithRelationsProps) => {
      await queryClient.cancelQueries();
      const previousRecords = queryClient.getQueryData(
        key
      ) as RecordWithRelationsProps[];
      const recordIndex = previousRecords.findIndex(
        (record) => record.id === newRecord.id
      );

      if (recordIndex !== -1) {
        // Update the record with the new data
        previousRecords[recordIndex] = newRecord;

        // Update the query data with the modified records
        queryClient.setQueryData(key, previousRecords);
      }
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
    await deleteRecordMut(recordId);
  };

  const updateRecord = (newRecord: RecordWithRelationsProps) => {
    updateRecordMut(newRecord);
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
    updateRecord,
  };
}
