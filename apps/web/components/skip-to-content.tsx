"use client";
import { Blocks, Timer } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const SkipToContent = () => {
  const handleOnSkipTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.focus();
    }
  };
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className="z-30 sr-only focus:not-sr-only focus-visible:absolute focus-visible:top-6 focus-visible:left-0 focus-visible:px-4 focus-visible:py-2"
        asChild
      >
        <Button variant="secondary">Skip to content</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onSelect={() => handleOnSkipTo("activities-counter")}>
          <Timer className="mr-2 h-4 w-4" />
          <span>Counter</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleOnSkipTo("activities-list")}>
          <Blocks className="mr-2 h-4 w-4" />
          <span>Activities</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
