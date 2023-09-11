"use client";
import { useEffect } from "react";
import { useCurrentActivity } from "@/hooks/use-current-activity";
import { Skeleton } from "./ui/skeleton";
import { Counter } from "./counter";
import { useDb } from "@/hooks/use-db";
import { RecordWithRelationsProps } from "@/types/db";
import { suscribeToCurrentUserData } from "@lftm/api";

interface Props {
  userId: string;
}

export function CurrentActivity({ userId }: Props) {
  const { client } = useDb();
  const {
    data: res,
    error,
    isLoading,
    invalidate,
    stopActivity,
  } = useCurrentActivity({ userId });

  useEffect(() => {
    const channel = suscribeToCurrentUserData(client, {
      userId,
      callback: async () => {
        invalidate();
      },
      tag: "current-activity-subscription",
    }).subscribe(() => {});
    return () => {
      channel.unsubscribe();
    };
  }, []);

  if (isLoading && !res) {
    return (
      <div className="w-full flex flex-col items-center">
        <Skeleton className="h-10 w-full max-w-xs rounded-full" />
      </div>
    );
  }

  const handleOnStop = async (record: RecordWithRelationsProps) => {
    if (!record?.id || record.id.length <= 0) return;

    stopActivity({ record: record });
  };

  return (
    <div className="w-full">
      {!error && res && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 my-4 gap-2">
          {res.length > 0 &&
            res.map((record) => (
              <Counter
                record={(record as RecordWithRelationsProps) ?? undefined}
                stopCounter={handleOnStop}
                key={record.id}
              />
            ))}
        </div>
      )}
      {res && res.length <= 0 && (
        <p className="text-center">Start a new activity</p>
      )}
    </div>
  );
}
