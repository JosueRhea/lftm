import "./globals.css";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import { Login } from "@/components/login";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Providers from "@/lib/provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Metadata } from "next";
import { CurrentActivities } from "@/components/current-activities";
import { SkipToContent } from "@/components/skip-to-content";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "lftm",
  description: "Track your habits and goals.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const shouldShowLogin = session == null;

  const username = session?.user.user_metadata.name;
  const avatar = session?.user.user_metadata.avatar_url;

  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div
            className="w-full h-full min-h-screen flex flex-col items-center px-4 bg-background"
            vaul-drawer-wrapper=""
          >
            <main className="w-full max-w-4xl h-full min-h-screen relative">
              <SkipToContent />
              <Providers>
                <Header avatar={avatar} username={username} />
                {shouldShowLogin ? (
                  <Login />
                ) : (
                  <>
                    {children}
                    <CurrentActivities userId={session.user.id} />
                  </>
                )}
              </Providers>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
