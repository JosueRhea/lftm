import { get7dRecords } from "@/services/activity";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDb } from "./use-db";
import { PostgrestError } from "@supabase/supabase-js";

interface Props {
  userId: string;
}

export const useTimeSpend = ({ userId }: Props) => {
  const { client } = useDb();
  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: ["use-time-spend", userId],
    queryFn: () => get7dRecords(client, { userId, date: new Date() }),
    refetchOnWindowFocus: true,
  });
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await queryClient.invalidateQueries(["use-time-spend", userId]);
  };

  return {
    data,
    error: error as PostgrestError,
    isLoading,
    isRefetching,
    invalidate,
  };
};
