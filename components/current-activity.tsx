"use client";
import { StopCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { stopRecord, suscribeToCurrentUserData } from "@/services/activity";
import { useCurrentActivity } from "@/hooks/use-current-activity";
import { Skeleton } from "./ui/skeleton";
import { Counter } from "./counter";
import { useDb } from "@/hooks/use-db";
import { RecordWithRelationsProps } from "@/types/db";

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
        <Skeleton className="h-10 w-64 rounded-md" />
        <Skeleton className="h-6 mt-2 w-52 rounded-md" />
        <div className="flex gap-x-2 mt-2">
          <Skeleton className="h-10 w-64 rounded-md" />
        </div>
      </div>
    );
  }

  const handleOnStop = async () => {
    if (!res?.id || res.id.length <= 0) return;

    stopActivity({ record: res as RecordWithRelationsProps });
  };

  return (
    <div className="w-full flex flex-col items-center my-10">
      {!error && (
        <Counter
          record={(res as RecordWithRelationsProps) ?? undefined}
          stopCounter={handleOnStop}
        />
      )}
    </div>
  );
}
