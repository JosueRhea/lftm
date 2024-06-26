import {
  Bike,
  BookCopy,
  Briefcase,
  Dumbbell,
  Gamepad2,
  Keyboard,
  Moon,
  Navigation2,
  Tv,
} from "lucide-react";

export const icons = [
  {
    name: "Bike",
    icon: Bike,
  },
  {
    name: "Work",
    icon: Briefcase,
  },
  {
    name: "Sleep",
    icon: Moon,
  },
  {
    name: "Gym",
    icon: Dumbbell,
  },
  {
    name: "Travel",
    icon: Navigation2,
  },
  {
    name: "Study",
    icon: BookCopy,
  },
  {
    name: "Tv",
    icon: Tv,
  },
  {
    name: "Keyboard",
    icon: Keyboard,
  },
  {
    name: "Games",
    icon: Gamepad2,
  },
];

export const iconsKV: {
  [key: string]: any;
} = {
  Bike: Bike,
  Work: Briefcase,
  Sleep: Moon,
  Gym: Dumbbell,
  Travel: Navigation2,
  Study: BookCopy,
  Tv: Tv,
  Keyboard: Keyboard,
  Games: Gamepad2,
};
