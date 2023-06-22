import { MyActivity } from "@/components/my-activity";
import { TimeSpend } from "@/components/time-spend";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

async function Report() {
  const client = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await client.auth.getSession();

  const userId = session?.user.id as string;

  return (
    <div className="w-full">
      <div className="w-full mt-4 flex gap-y-4 flex-col pb-28">
        <MyActivity userId={userId} />
        <TimeSpend userId={userId} />
      </div>
    </div>
  );
}

export default Report;
