import { Activities } from "@/components/activities";
import { CurrentActivities } from "@/components/current-activities";
import { TimeSpend } from "@/components/time-spend";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { getActivities } from "@lftm/api";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { AlertCircle, ArrowRight } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Home() {
  const client = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await client.auth.getSession();
  const userId = session?.user.id as string;
  // const { data, error } = await getUserData(client, {
  //   userId,
  // });

  const { data: activitiesData, error: activitiesError } = await getActivities(
    client,
    { userId }
  );

  const activities = activitiesData || [];

  return (
    <div className="mt-4 pb-52">
      <TimeSpend userId={userId} />
      <Button className="mt-4" asChild>
        <Link href="/report">
          Full report <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </Button>
      <div className="mt-4">
        <CardTitle>Activities</CardTitle>
        {activitiesError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{activitiesError.message}</AlertDescription>
          </Alert>
        )}
        {!activitiesError && (
          <Activities activities={activities} userId={userId} />
        )}
      </div>
    </div>
  );
}
