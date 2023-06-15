import { ActivitiesIcons } from "./activities-icons";
import { Button } from "./ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";

export function AddActivity() {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add new activity</DialogTitle>
        <DialogDescription>
          Create a new activity to track your time.
        </DialogDescription>
      </DialogHeader>
      <div>
        <label className="text-sm" htmlFor="name">
          Name
        </label>
        <Input id="name" className="col-span-3 mt-2" />

        <ActivitiesIcons />
      </div>
      <DialogFooter>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </DialogContent>
  );
}
