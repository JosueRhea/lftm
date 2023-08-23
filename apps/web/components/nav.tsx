"use client";
import { Activity, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type LinkItemProps = {
  href: string;
  children: ReactNode;
};

const MotionLink = motion(Link);

const links = [
  {
    href: "/",
    name: "Home",
    icon: Home,
  },
  {
    href: "/report",
    name: "Report",
    icon: Activity,
  },
];

function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <motion.nav
      className="w-full hidden sm:grid-cols-2 mt-4 sm:grid"
      layout
      layoutRoot
    >
      {links.map(({ href, name, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <MotionLink
            href={href}
            className={`text-primary relative text-center w-full h-10 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background`}
            key={href}
            replace={true}
          >
            <Icon className="w-4 h-4 mr-2" />
            {name}
            {isActive && (
              <motion.div
                layoutId="main-navigation-indicator"
                className="absolute bottom-0 right-0 left-0 h-[2px] bg-primary"
                layout
              ></motion.div>
            )}
          </MotionLink>
        );
      })}
    </motion.nav>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <nav className="w-full h-fit grid grid-cols-2 sm:hidden fixed bottom-0 bg-background/80 backdrop-blur-md z-50 right-0 left-0">
      {links.map(({ href, name, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            href={href}
            className={cn(
              `text-foreground relative text-center w-full h-16 flex flex-col items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border-t border-muted`,
              !isActive ? "opacity-60" : ""
            )}
            key={href}
            replace={true}
          >
            <Icon className="w-4 h-4 mr-2" />
            <p>{name}</p>
            {isActive && (
              <div className="absolute top-0 right-0 left-0 h-[2px] bg-primary"></div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function Nav() {
  const pathname = usePathname();
  return (
    <>
      <DesktopNav pathname={pathname} />
      <MobileNav pathname={pathname} />
    </>
  );
}
