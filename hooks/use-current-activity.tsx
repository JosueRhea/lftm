import { getCurrentActivity } from "@/services/activity";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Props {
  userId: string;
}

export function useCurrentActivity({ userId }: Props) {
  const client = createClientComponentClient();
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
