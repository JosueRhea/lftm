"use client";
import { useActivityHistory } from "@/hooks/use-activity-history";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RecordHistory } from "./record-history";
import { RecordWithRelationsProps } from "@/types/db";
import { SelectDate } from "./select-date";

interface Props {
  userId: string;
}

export function ActivityHistory({ userId }: Props) {
  const { data, selectedDate, onDateChange } = useActivityHistory({
    userId,
  });
  return (
    <>
      <div className="w-full flex justify-between items-center">
        <CardTitle>Activity History</CardTitle>
        <SelectDate selectedDate={selectedDate} onSelectDate={onDateChange} />
      </div>
      <div className="flex flex-col gap-y-2">
        {data && data.length > 0 ? (
          data?.map((record) => (
            <RecordHistory
              key={record.id}
              data={record as RecordWithRelationsProps}
              userId={userId}
            />
          ))
        ) : (
          <div className="py-16 text-center flex items-center justify-center">
            <p>No data to display</p>
          </div>
        )}
      </div>
    </>
  );
}
