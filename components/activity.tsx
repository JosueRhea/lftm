import { Moon, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { AddActivity } from "./add-activity";

type Props = {
  isPlus?: boolean;
  isActive?: boolean;
  disabled?: boolean;
};

export function Activity({
  isPlus = false,
  isActive = false,
  disabled = false,
}: Props) {
  if (isPlus) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </DialogTrigger>
        <AddActivity />
      </Dialog>
    );
  }

  return (
    <Button
      className={`w-full ${isActive ? "border-primary" : ""}`}
      variant={"outline"}
      disabled={disabled}
    >
      <Moon
        className={`w-4 h-4 mr-2 ${
          isActive ? "animate-bounce" : "animate-none"
        }`}
      />
      Sleep
    </Button>
  );
}
