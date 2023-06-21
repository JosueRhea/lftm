import { iconsKV } from "@/data/icons";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  icon: string;
  value: number;
  setSelectedIndex: (index: number) => void;
  index: number;
  selectedIndex: number;
}

export function ActivityProgress({
  icon,
  name,
  value,
  setSelectedIndex,
  index,
  selectedIndex,
}: Props) {
  const IconComp = iconsKV[icon];

  if (!IconComp) return null;

  const isActive = index === selectedIndex;

  const rounded = Math.round(value * 100) / 100;
  return (
    <div
      className={cn("w-full flex gap-x-2 items-end", !isActive && "opacity-50")}
      onMouseEnter={() => setSelectedIndex(index)}
    >
      {IconComp && <IconComp className="w-4 h-4" />}
      <div className="w-full">
        <p className="text-zinc-600">{name}</p>
        <Progress value={value} className="h-4" />
      </div>
      <p className="text-xs">{rounded}%</p>
    </div>
  );
}
