import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const useDb = () => {
  const client = createClientComponentClient();
  return {
    client,
  };
};
