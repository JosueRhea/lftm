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

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "lftm",
  description: "Track your habits and goals.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/logo.png",
    },
  },
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
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
