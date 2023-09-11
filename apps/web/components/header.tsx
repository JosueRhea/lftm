'use client'
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ToggleTheme } from "./toggle-theme";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface Props {
  username?: string;
  avatar?: string;
}

export function Header({ avatar, username }: Props) {
  const avatarFallback = username ? username[0] : "NA";
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="flex mt-2 items-center py-2 justify-between sticky top-0 bg-background/60 z-20 backdrop-blur-lg">
      <div className="flex items-center gap-x-2">
        <Avatar>
          <AvatarImage src={avatar} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-foreground">
            {format(date, "h:mm a")}
          </p>
          <p className="text-muted-foreground font-sm">
            {format(date, "MMMM dd - yy")}
          </p>
        </div>
      </div>
      <ToggleTheme />
    </header>
  );
}
