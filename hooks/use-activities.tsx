import { getUserData } from "@/services/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDb } from "./use-db";

interface Props {
  userId?: string;
}

export const useActivities = ({ userId }: Props) => {
  const { client } = useDb();
  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: ["use-activities", userId],
    queryFn: () => getUserData(client, { userId: userId ?? "" }),
    staleTime: Infinity,
    enabled: userId != null,
  });
  const queryClient = useQueryClient();

  const invalidate = async () => {
    if (!userId) {
      const {
        data: { session },
      } = await client.auth.getSession();
      await queryClient.invalidateQueries(["use-activities", session?.user.id]);
    } else {
      await queryClient.invalidateQueries(["use-activities", userId]);
    }
  };

  return {
    data: data?.data,
    error: data?.error,
    isLoading,
    invalidate,
    isRefetching,
  };
};
