import { getCurrentActivity } from "@/services/activity";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDb } from "./use-db";

interface Props {
  userId: string;
}

export function useCurrentActivity({ userId }: Props) {
  const { client } = useDb();
  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: ["currentActivity", userId],
    queryFn: () => getCurrentActivity(client, { userId }),
  });
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries(["currentActivity", userId]);
  };

  return {
    data,
    error,
    isLoading,
    invalidate,
    isRefetching,
  };
}
