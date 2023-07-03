import "./globals.css";
import { Inter } from "next/font/google";
import { Nav } from "@/components/nav";
import { Header } from "@/components/header";
import { Login } from "@/components/login";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Providers from "@/lib/provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Metadata } from "next";
import Image from "next/image";

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
      <body className={`${inter.className} flex flex-col items-center px-4`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <main className="w-full max-w-4xl h-full min-h-screen relative">
            <Providers>
              <Header avatar={avatar} username={username} />
              <Nav />
              {shouldShowLogin ? <Login /> : children}
            </Providers>
            <Image
              src="/gradient.png"
              alt="gradient"
              width={500}
              height={600}
              className="fixed bottom-0 right-0 left-0 w-full -z-10 opacity-10"
              priority
            />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
