import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDb } from "./use-db";
import { PostgrestError } from "@supabase/supabase-js";
import { getAverageActivity, getTopActivities } from "@lftm/api";

interface Props {
  userId: string;
}

export const useTopActivities = ({ userId }: Props) => {
  const { client } = useDb();

  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: ["use-overview", userId],
    queryFn: () =>
      getTopActivities(client, {
        userId,
      }),
    refetchOnWindowFocus: true,
  });
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await queryClient.invalidateQueries(["use-overview", userId]);
  };

  return {
    data,
    error: error as PostgrestError,
    isLoading,
    isRefetching,
    invalidate,
  };
};

export const useAverageTrackedTime = ({ userId }: Props) => {
  const { client } = useDb();

  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: ["use-average-tracked-time", userId],
    queryFn: () =>
      getAverageActivity(client, {
        userId,
      }),
    refetchOnWindowFocus: true,
  });
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await queryClient.invalidateQueries(["use-average-tracked-time", userId]);
  };

  return {
    data,
    error: error as PostgrestError,
    isLoading,
    isRefetching,
    invalidate,
  };
};
