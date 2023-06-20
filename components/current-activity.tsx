"use client";
import { StopCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { stopRecord, suscribeToCurrentUserData } from "@/services/activity";
import { useCurrentActivity } from "@/hooks/use-current-activity";
import { Skeleton } from "./ui/skeleton";
import { Counter } from "./counter";

interface Props {
  userId: string;
}

export function CurrentActivity({ userId }: Props) {
  const client = createClientComponentClient();
  const {
    data: res,
    error,
    isLoading,
    invalidate,
    isRefetching,
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

  const handleOnStop = async () => {
    if (!res?.data?.id) return;
    const { error } = await stopRecord(client, {
      userId,
      currentRecordId: res.data?.id,
    });

    if (error) {
      console.error(error);
      return;
    }
    invalidate();
  };

  if ((isLoading && !res) || isRefetching) {
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

  return (
    <div className="w-full flex flex-col items-center">
      {res && !error ? (
        <>
          <Counter startDate={new Date(res.data?.created_at as string)} />
          <p className="text-xl">{res.data?.activity?.name}</p>
          <div className="flex gap-x-2 mt-2">
            <Button onClick={handleOnStop}>
              <StopCircle className="w-4 h-4 mr-2" />
              Stop
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-4xl">0: 00: 00</p>
          <p className="mt-4">
            No activity yet. <strong>Start one!</strong>
          </p>
        </>
      )}
    </div>
  );
}
