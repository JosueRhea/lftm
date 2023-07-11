import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useDb } from "./use-db";
import { get24hRecords } from "@lftm/api";

interface Props {
  userId: string;
}

export const useMyActivity = ({ userId }: Props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { client } = useDb();
  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: ["use-my-activity", userId, selectedDate.toISOString()],
    queryFn: () => get24hRecords(client, { userId, date: selectedDate }),
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await queryClient.invalidateQueries([
      "use-my-activity",
      userId,
      selectedDate,
    ]);
  };

  const onDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setSelectedDate(newDate);
    }
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
