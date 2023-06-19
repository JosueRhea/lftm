import { Activities } from "@/components/activities";
import { CurrentActivity } from "@/components/current-activity";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getCurrentActivity } from "@/services/activity";
import { getUserData } from "@/services/user";
import { RecordWithRelationsProps } from "@/types/db";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { AlertCircle } from "lucide-react";
import { cookies } from "next/headers";

export default async function Home() {
  const client = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await client.auth.getSession();
  const { data, error } = await getUserData(client, {
    userId: session?.user.id as string,
  });

  const activities = data?.activity || [];

  const userId = session?.user.id as string;
  const currentActivityId = data?.current_activity;
  let currentActivity = null;
  if (currentActivityId) {
    const { data } = await getCurrentActivity(client, {
      activityId: currentActivityId,
    });
    if (data) currentActivity = data;
  }

  return (
    <div className="mt-12">
      <CurrentActivity
        currentActivity={currentActivity as RecordWithRelationsProps}
        userId={userId}
      />
      <div className="mt-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Activities
        </h3>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        <Activities
          currentActivityServer={currentActivity as RecordWithRelationsProps}
          activities={activities}
          userId={userId}
        />
      </div>
    </div>
  );
}
