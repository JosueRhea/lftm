"use client";
import { Button } from "./ui/button";
import { AddActivity } from "./add-activity";
import { ActivityProps } from "@/types/db";
import { iconsKV } from "@/data/icons";
import { useCurrentActivity } from "@/hooks/use-current-activity";

type Props = {
  isPlus?: boolean;
  isActive?: boolean;
  disabled?: boolean;
  data?: ActivityProps;
  userId: string;
};

export function Activity({
  isPlus = false,
  isActive = false,
  disabled = false,
  data,
  userId,
}: Props) {
  const { startActivity } = useCurrentActivity({ userId });

  if (isPlus) {
    return <AddActivity />;
  }

  if (!data) return null;

  const name = data?.name;
  const icon = data?.icon as string;

  const IconComp = iconsKV[icon];

  return (
    <Button
      className={`w-full ${isActive ? "border-primary" : ""}`}
      variant={"outline"}
      onClick={disabled ? undefined : () => startActivity({ activity: data })}
      disabled={disabled}
    >
      <IconComp
        className={`w-4 h-4 mr-2 ${
          isActive ? "animate-bounce" : "animate-none"
        }`}
      />
      {name}
    </Button>
  );
}
