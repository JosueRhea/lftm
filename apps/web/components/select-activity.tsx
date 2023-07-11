import { ActivityProps } from "@/types/db";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Props {
  selectedActivity: string;
  onChange: (value: string) => void;
  activities: ActivityProps[];
}

export function SelectActivity({
  onChange,
  selectedActivity,
  activities,
}: Props) {
  return (
    <Select value={selectedActivity} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an activity" />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        <SelectGroup>
          <SelectLabel>Activities</SelectLabel>
          {activities.map((activity) => (
            <SelectItem key={activity.id} value={activity.id}>
              {activity.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
