"use client";

import { GoogleIcon } from "@/icons/google";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDb } from "@/hooks/use-db";

export function Login() {
  const { client: supabase } = useDb();
  const router = useRouter();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== "undefined" ? window.location.origin : "",
      },
    });
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="w-full flex justify-center mt-24">
      <Card className="w-full max-w-xs">
        <CardHeader>
          <CardTitle className="text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter with your google account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button onClick={handleLogin}>
            <GoogleIcon className="h-4 w-4 mr-2" /> Go!
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
