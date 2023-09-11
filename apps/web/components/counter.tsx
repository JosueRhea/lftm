"use client";
import { iconsKV } from "@/data/icons";
import { getCounterFromStartDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { RecordWithRelationsProps } from "@/types/db";
import { AnimatePresence, motion } from "framer-motion";
import { StopCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Props {
  record: RecordWithRelationsProps;
  stopCounter: (record: RecordWithRelationsProps) => void;
}

function Digit({
  value,
  keyVal,
  type,
}: {
  value: number;
  keyVal: any;
  type: string;
}) {
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ y: 5, opacity: 0 }}
          transition={{
            duration: 0.1,
          }}
          key={keyVal}
        >
          <p>{value}</p>
        </motion.div>
      </AnimatePresence>
      <span>{type}</span>
    </>
  );
}

export function RunningCounter({
  startDate,
  icon,
  name,
  record,
  stopCounter,
}: {
  startDate: Date;
  name: string;
  icon: string;
  record: RecordWithRelationsProps;
  stopCounter: (record: RecordWithRelationsProps) => void;
}) {
  const [parsedDate, setParsedDate] = useState(
    getCounterFromStartDate(startDate)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setParsedDate(getCounterFromStartDate(startDate));
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const IcomComp = iconsKV[icon];

  return (
    <div className="flex w-full flex-col">
      <div className="w-full flex gap-x-4 items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="rounded-full bg-red-400/20 hover:bg-red-400/30 p-2 transition-colors duration-200"
                onClick={() => stopCounter(record)}
              >
                <StopCircle className="w-6 h-6 stroke-red-400" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Stop counter</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex flex-col">
          <div className="flex gap-x-2">
            {parsedDate.days > 0 && (
              <Digit
                keyVal={`${record.id}-${parsedDate.days}`}
                value={parsedDate.days}
                type="d"
              />
            )}
            <Digit
              keyVal={`${record.id}-${parsedDate.hours}`}
              value={parsedDate.hours}
              type="h"
            />
            <Digit
              keyVal={`${record.id}-${parsedDate.minutes}`}
              value={parsedDate.minutes}
              type="m"
            />
            {parsedDate.days === 0 && (
              <Digit
                keyVal={`${record.id}-${parsedDate.seconds}`}
                value={parsedDate.seconds}
                type="s"
              />
            )}
          </div>
          <div className="flex gap-x-2 items-center text-muted-foreground">
            <p className="text-base">{name}</p>
            {IcomComp && <IcomComp className="w-4 h-4" />}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Counter({ record, stopCounter }: Props) {
  return (
    <div
      className={cn(
        "w-full flex items-center justify-center bg-secondary rounded-md py-2 px-4 text-secondary-foreground"
      )}
    >
      <RunningCounter
        startDate={new Date(record.created_at as string)}
        name={record.activity.name}
        icon={record.activity.icon}
        stopCounter={stopCounter}
        record={record}
      />
    </div>
  );
}
