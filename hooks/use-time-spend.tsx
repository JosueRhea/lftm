import { get7dRecords } from "@/services/activity";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface Props {
  userId: string;
}

export const useTimeSpend = ({ userId }: Props) => {
  const [date, setDate] = useState(new Date());
  const client = createClientComponentClient();
  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: ["use-time-spend", userId, date],
    queryFn: () => get7dRecords(client, { userId, date }),
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await queryClient.invalidateQueries(["use-time-spend", userId, date]);
  };

  const onDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  return {
    data,
    error,
    isLoading,
    isRefetching,
    selectedDate: date,
    onDateChange,
    invalidate,
  };
};
