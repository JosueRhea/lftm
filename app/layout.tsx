import "./globals.css";
import { Inter } from "next/font/google";
import { Nav } from "@/components/nav";
import { Header } from "@/components/header";
import { Login } from "@/components/login";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

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

  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col items-center px-4`}>
        <main className="w-full max-w-4xl">
          <Header />
          <Nav />
          {shouldShowLogin ? <Login /> : children}
        </main>
      </body>
    </html>
  );
}
