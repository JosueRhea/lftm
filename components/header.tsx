import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface Props {
  username?: string;
  avatar?: string;
}

export function Header({ avatar, username }: Props) {
  const avatarFallback = username ? username[0] : "NA";

  return (
    <header className="mt-4 flex items-center justify-between">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight flex gap-x-2 items-center">
        <span>lftm</span> <Badge>Beta</Badge>
      </h3>
      <div className="flex items-center gap-x-2">
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {username ? username : "Name"}
        </p>
        <Avatar>
          <AvatarImage src={avatar} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
