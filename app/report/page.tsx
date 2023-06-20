import { MyActivity } from "@/components/my-activity";
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
      <div className="w-full mt-4">
        <MyActivity userId={userId} />
      </div>
    </div>
  );
}

export default Report;
