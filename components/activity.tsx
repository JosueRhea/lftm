import { Button } from "./ui/button";
import { AddActivity } from "./add-activity";
import { ActivityProps } from "@/types/db";
import { iconsKV } from "@/data/icons";

type Props = {
  isPlus?: boolean;
  isActive?: boolean;
  disabled?: boolean;
  data?: ActivityProps;
};

export function Activity({
  isPlus = false,
  isActive = false,
  disabled = false,
  data,
}: Props) {
  if (isPlus) {
    return <AddActivity />;
  }

  const name = data?.name;
  const icon = data?.icon as string;

  const IconComp = iconsKV[icon];

  return (
    <Button
      className={`w-full ${isActive ? "border-primary" : ""}`}
      variant={"outline"}
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
