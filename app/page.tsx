import { Activities } from "@/components/activities";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getUserData } from "@/services/user";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { AlertCircle } from "lucide-react";
import { StopCircle } from "lucide-react";
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
      <div className="w-full flex flex-col items-center">
        <p className="text-4xl">0: 00: 00</p>
        <p className="text-xl">Sleep</p>
        <div className="flex gap-x-2 mt-2">
          <Button>
            <StopCircle className="w-4 h-4 mr-2" />
            Stop
          </Button>
        </div>
      </div>
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
