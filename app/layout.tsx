import "./globals.css";
import { Inter } from "next/font/google";
import { Nav } from "@/components/nav";
import { Header } from "@/components/header";
import { Login } from "@/components/login";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Providers from "@/lib/provider";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
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
          <main className="w-full max-w-4xl">
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
