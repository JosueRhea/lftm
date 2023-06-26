import { deleteRecordActivity, getActivityHistory } from "@/services/activity";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDb } from "./use-db";
import { RecordWithRelationsProps } from "@/types/db";

interface Props {
  userId: string;
}

export function useActivityHistory({ userId }: Props) {
  const key = ["activity-history", userId];
  const { client } = useDb();
  const { data, isLoading, isRefetching, error } = useQuery({
    queryKey: key,
    queryFn: () => getActivityHistory(client, { userId }),
  });
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (recordId: string) => {
      await deleteRecordActivity(client, { recordId });
    },
    onMutate: async (recordId) => {
      await queryClient.cancelQueries(key);

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
      queryClient.invalidateQueries(key);
    },
  });

  const deleteRecord = async (recordId: string) => {
    await mutateAsync(recordId);
  };

  return {
    data,
    error,
    isLoading,
    isRefetching,
    deleteRecord,
  };
}
