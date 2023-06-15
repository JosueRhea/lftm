"use client";
import { Activity, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type LinkItemProps = {
  href: string;
  children: ReactNode;
};

function LinkItem({ href, children }: LinkItemProps) {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-primary text-center w-full border-b-2 ${
        isActive
          ? "border-primary text-primary"
          : "border-transparent bg-transparent text-accent-foreground"
      } h-8 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background`}
    >
      {children}
    </Link>
  );
}

export function Nav() {
  return (
    <nav className="w-full grid grid-cols-2 mt-4">
      <LinkItem href="/">
        <Home className="w-4 h-4 mr-2" /> Home
      </LinkItem>
      <LinkItem href="/report">
        <Activity className="w-4 h-4 mr-2" /> Report
      </LinkItem>
    </nav>
  );
}
