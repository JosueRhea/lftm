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
    <Card className="col-span-4">
      <CardHeader>
        <div className="w-full flex justify-between items-center">
          <CardTitle>Activity History</CardTitle>
          <SelectDate selectedDate={selectedDate} onSelectDate={onDateChange} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        {data &&
          data?.map((record) => (
            <RecordHistory
              key={record.id}
              data={record as RecordWithRelationsProps}
              userId={userId}
            />
          ))}
      </CardContent>
    </Card>
  );
}
