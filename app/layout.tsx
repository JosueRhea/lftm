import "./globals.css";
import { Inter } from "next/font/google";
import { Nav } from "@/components/nav";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "lftm",
  description: "Track your habits and goals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col items-center px-4`}>
        <main className="w-full max-w-4xl">
          <Header />
          <Nav />
          {children}
        </main>
      </body>
    </html>
  );
}
