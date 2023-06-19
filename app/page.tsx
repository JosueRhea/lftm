import { Activities } from "@/components/activities";
import { CurrentActivity } from "@/components/current-activity";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getUserData } from "@/services/user";
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

  return (
    <div className="mt-12">
      <CurrentActivity userId={userId} />
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
        <Activities activities={activities} userId={userId} />
      </div>
    </div>
  );
}
