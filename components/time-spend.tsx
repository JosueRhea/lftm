"use client";

import { TimeSpendChart } from "./time-spend-chart";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useTimeSpend } from "@/hooks/use-time-spend";

interface Props {
  userId: string;
}

export function TimeSpend({ userId }: Props) {
  const { error, data, isLoading, isRefetching } = useTimeSpend({ userId });

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Time spend on</CardTitle>
        {/* <SelectDate selectedDate={selectedDate} onSelectDate={onDateChange} /> */}
      </CardHeader>
      <CardContent className="pl-0">
        {data && data.dayRecords && <TimeSpendChart data={data.dayRecords} />}
      </CardContent>
    </Card>
  );
}
