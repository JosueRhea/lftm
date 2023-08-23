import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ToggleTheme } from "./toggle-theme";
import { Logo } from "@/icons/logo";

interface Props {
  username?: string;
  avatar?: string;
}

export function Header({ avatar, username }: Props) {
  const avatarFallback = username ? username[0] : "NA";

  return (
    <header className="flex items-center py-2 justify-between sticky top-0 bg-background/60 z-20 backdrop-blur-lg">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight flex gap-x-2 items-center">
        <Logo className="w-8 h-8 fill-foreground" />
      </h3>
      <div className="flex items-center gap-x-2">
        <ToggleTheme />
        <Avatar>
          <AvatarImage src={avatar} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
