"use client";
import { RecordWithCounterProps } from "@/types/db";
import { ActivityProgress } from "./activity-progress";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface Props {
  data: RecordWithCounterProps[];
  setSelectedIndex: (index: number) => void;
  selectedIndex: number;
}

export function MostTrackedActivities({
  data,
  selectedIndex,
  setSelectedIndex,
}: Props) {
  const { replace } = useRouter();
  return (
    <div className="w-full">
      <div className="flex flex-col gap-y-2 mt-2">
        {data.length > 0 ? (
          <>
            {data.map((record, index) => (
              <ActivityProgress
                key={record.id}
                icon={record.activity.icon}
                name={record.activity.name}
                value={record.counter}
                setSelectedIndex={setSelectedIndex}
                index={index}
                selectedIndex={selectedIndex}
              />
            ))}
          </>
        ) : (
          <div className="w-full flex flex-col h-52 items-center justify-center text-center">
            <p>Start tracking your activities to see them here.</p>
            <Button className="mt-2" onClick={() => replace("/")}>
              Let's get started
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
