import { get24hRecords } from "@/services/activity";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Props {
  userId: string;
}

export const useMyActivity = ({ userId }: Props) => {
  const client = createClientComponentClient();
  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: ["use-my-activity", userId],
    queryFn: () => get24hRecords(client, { userId }),
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
};
