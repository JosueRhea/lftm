import { get24hRecords } from "@/services/activity";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface Props {
  userId: string;
}

export const useMyActivity = ({ userId }: Props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const client = createClientComponentClient();
  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: ["use-my-activity", userId, selectedDate],
    queryFn: () => get24hRecords(client, { userId, date: selectedDate }),
  });
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await queryClient.invalidateQueries(["currentActivity", userId]);
  };

  const onDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  return {
    data,
    error: error as Error,
    isLoading,
    invalidate,
    isRefetching,
    onDateChange,
    selectedDate,
  };
};
