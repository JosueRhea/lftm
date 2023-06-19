"use client";
import { StopCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { RecordWithRelationsProps } from "@/types/db";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  getCurrentActivity,
  stopRecord,
  suscribeToCurrentUserData,
} from "@/services/activity";

interface Props {
  currentActivity?: RecordWithRelationsProps | null;
  userId: string;
}

export function CurrentActivity({ currentActivity, userId }: Props) {
  const [localActivity, setLocalActivity] = useState(currentActivity);
  const client = createClientComponentClient();

  useEffect(() => {
    const channel = suscribeToCurrentUserData(client, {
      userId,
      callback: async (data) => {
        const newUserActivity = data?.new?.current_activity;
        if (newUserActivity) {
          const { data } = await getCurrentActivity(client, {
            activityId: newUserActivity,
          });

          if (data) {
            setLocalActivity(data as RecordWithRelationsProps);
          }
        }
      },
      tag: "current-activity-subscription",
    }).subscribe(() => {});

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const handleOnStop = async () => {
    if (!localActivity) return;
    const { error } = await stopRecord(client, {
      userId,
      currentRecordId: localActivity.id,
    });

    if (error) {
      console.error(error);
      return;
    }

    setLocalActivity(null);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <p className="text-4xl">0: 00: 00</p>
      {localActivity ? (
        <>
          <p className="text-xl">{localActivity.activity.name}</p>
          <div className="flex gap-x-2 mt-2">
            <Button onClick={handleOnStop}>
              <StopCircle className="w-4 h-4 mr-2" />
              Stop
            </Button>
          </div>
        </>
      ) : (
        <p className="mt-4">
          No activity yet. <strong>Start one!</strong>
        </p>
      )}
    </div>
  );
}
