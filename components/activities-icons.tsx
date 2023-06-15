"use client";
import { icons } from "@/data/icons";
import { useState } from "react";

interface Props {
  onChange?: (value: string) => void;
}

export function ActivitiesIcons({ onChange }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleOnClick = (value: string) => {
    setSelected(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="w-full grid grid-cols-6 mt-4 gap-x-2 gap-y-4">
      {icons.map((icon) => {
        const Icon = icon.icon;

        const isSelected = selected === icon.name;

        return (
          <button
            value={icon.name}
            key={icon.name}
            onClick={() => handleOnClick(icon.name)}
            className={`border-2 aspect-square ${
              isSelected ? "border-primary" : "border-transparent"
            }`}
          >
            <Icon className="w-full" />
          </button>
        );
      })}
    </div>
  );
}
