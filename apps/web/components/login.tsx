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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDb } from "@/hooks/use-db";
import { Input } from "./ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

export function Login() {
  const { client: supabase } = useDb();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [askForOtp, setAskForOtp] = useState(false);
  const [otpValue, setOtpValue] = useState("");

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== "undefined" ? window.location.origin : "",
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      },
    });
    router.refresh();
  };

  const handleOtp = async () => {
    if (otp.length <= 0) return;
    const { error } = await supabase.auth.signInWithOtp({
      email: otp,
      options: {
        shouldCreateUser: false,
      },
    })

    if (error) {
      console.error(error)
      return
    }

    setAskForOtp(true)
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      console.log("Refreshing")
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
        </CardHeader>
        <CardContent className="grid gap-4">
          {askForOtp ? (
            <div className="w-full flex items-center justify-center flex-col gap-y-2">
              <p className="text-center text-muted-foreground">
                Enter the OTP sent to {otp}
              </p>
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={async (value) => {
                  setOtpValue(value)
                  if (value.length === 6) {
                    const {
                      data: { session },
                      error,
                    } = await supabase.auth.verifyOtp({
                      email: otp,
                      token: value,
                      type: 'email',
                    })
                  }
                }}
                render={({ slots }) => (
                  <InputOTPGroup>
                    {slots.map((slot, index) => (
                      <InputOTPSlot key={index} {...slot} />
                    ))}{" "}
                  </InputOTPGroup>
                )}
              />
            </div>
          ) : (
            <>
              <div className="w-full">
                <p className="text-center text-muted-foreground">
                  Enter with your google account.
                </p>
                <Button className="w-full mt-2" onClick={handleLogin}>
                  <GoogleIcon className="h-4 w-4 mr-2" /> Go!
                </Button>
              </div>
              <p className="text-center">or</p>
              <div className="w-full">
                <p className="text-center text-muted-foreground">
                  Get one time password
                </p>
                <Input value={otp} onChange={(e) => {
                  setOtp(e.target.value)
                }} className="mb-2" placeholder="Email" />
                <Button disabled={otp.length <= 0} className="w-full" onClick={handleOtp}>
                  Get OTP
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
