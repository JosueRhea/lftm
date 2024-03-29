import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseElapsed = (value: number) => {
  const hours = Math.floor(value / (1000 * 60 * 60));
  const minutes = Math.floor((value % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((value % (1000 * 60)) / 1000);

  if (hours > 0) {
    return hours + " hours";
  }

  if (minutes > 0) {
    return minutes + " minutes";
  }

  if (seconds > 0) {
    return seconds + " seconds";
  }

  return value + " milliseconds";
};
