import { getActivityHistory } from "@/services/activity";
import { useQuery } from "@tanstack/react-query";
import { useDb } from "./use-db";
interface Props {
  userId: string;
}

export function useActivityHistory({ userId }: Props) {
  const { client } = useDb();
  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ["activity-history", userId],
    queryFn: () => getActivityHistory(client, { userId }),
  });

  return {
    data: data?.data,
    error: data?.error,
    isLoading,
    isRefetching,
  };
}
