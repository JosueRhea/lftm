import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDb } from "./use-db";
import { ActivityProps, RecordWithRelationsProps } from "@/types/db";
import { createRecord, getCurrentActivity, stopRecord } from "@lftm/api";

interface Props {
  userId: string;
}

export function useCurrentActivity({ userId }: Props) {
  const { client } = useDb();
  const key = ["currentActivity", userId];
  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: key,
    queryFn: () => getCurrentActivity(client, { userId }),
  });
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries(key);
  };

  const { mutate: startActivityMut } = useMutation({
    mutationFn: async ({ record }: { record: RecordWithRelationsProps }) => {
      await createRecord(client, {
        activityId: record.activity.id,
        userId,
      });
    },
    onMutate: async ({ record }: { record: RecordWithRelationsProps }) => {
      await queryClient.cancelQueries();
      const previousRecords = queryClient.getQueryData(key);

      if(previousRecords && Array.isArray(previousRecords)){
        queryClient.setQueryData(key, [...previousRecords, record]);
      }
      return { previousRecords };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(key, context?.previousRecords);
    },
    onSettled: () => {
      queryClient.invalidateQueries(key);
    },
  });

  const { mutate: stopActivityMut } = useMutation({
    mutationFn: async ({ record }: { record: RecordWithRelationsProps }) => {
      await stopRecord(client, {
        userId,
        currentRecordId: record.id,
      });
    },
    onMutate: async ({record}) => {
      await queryClient.cancelQueries();
      const previousRecords = queryClient.getQueryData(key);

      if(previousRecords && Array.isArray(previousRecords)){
        const newRecords = previousRecords.filter((rcord)=> rcord.id != record.id)
        queryClient.setQueryData(key, newRecords);
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

  const startActivity = ({ activity }: { activity: ActivityProps }) => {
    const newRecord = {
      activity,
      activity_id: activity.id,
      created_at: new Date().toISOString(),
      user_id: userId,
      end_date: null,
      id: "",
    } satisfies RecordWithRelationsProps;
    startActivityMut({ record: newRecord });
  };

  const stopActivity = ({ record }: { record: RecordWithRelationsProps }) => {
    stopActivityMut({ record });
  };

  return {
    data,
    error,
    isLoading,
    invalidate,
    isRefetching,
    startActivity,
    stopActivity,
  };
}
