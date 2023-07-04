"use client";
import { iconsKV } from "@/data/icons";
import { getCounterFromStartDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { RecordWithRelationsProps } from "@/types/db";
import { AnimatePresence, motion } from "framer-motion";
import { StopCircle, Triangle } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  record?: RecordWithRelationsProps;
  stopCounter: () => void;
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

function RunningCounter({
  startDate,
  icon,
  name,
  stopCounter,
}: {
  startDate: Date;
  name: string;
  icon: string;
  stopCounter: () => void;
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
    <div className="text-2xl flex w-full flex-col">
      <div className="w-full flex justify-between items-center">
        <button
          className="rounded-full bg-red-400/20 hover:bg-red-400/30 p-2 transition-colors duration-200"
          onClick={stopCounter}
        >
          <StopCircle className="w-6 h-6 stroke-red-400" />
        </button>
        <div className="flex gap-x-2">
          {parsedDate.days > 0 && (
            <Digit keyVal={parsedDate.days} value={parsedDate.days} type="d" />
          )}
          <Digit keyVal={parsedDate.hours} value={parsedDate.hours} type="h" />
          <Digit
            keyVal={parsedDate.minutes}
            value={parsedDate.minutes}
            type="m"
          />
          {parsedDate.days === 0 && (
            <Digit
              keyVal={parsedDate.seconds}
              value={parsedDate.seconds}
              type="s"
            />
          )}
        </div>
      </div>
      <div className="w-full flex justify-between items-center mt-2">
        <p className="text-lg">{name}</p>
        {IcomComp && <IcomComp className="w-4 h-4" />}
      </div>
    </div>
  );
}

function IddleCounter() {
  return (
    <div className="text-base flex justify-between items-center w-full">
      <div>
        <Triangle className="w-4 h-4" />
      </div>
      <div>
        No activity yet. <strong>Start one!</strong>
      </div>
    </div>
  );
}

export function Counter({ record, stopCounter }: Props) {
  const isCounterRunning = record != null;
  return (
    <motion.div
      className={cn(
        "w-full flex items-center justify-center bg-primary max-5/6 max-w-xs text-primary-foreground py-2 px-4",
        isCounterRunning ? "rounded-xl" : "rounded-full"
      )}
      layout
    >
      {record ? (
        <RunningCounter
          startDate={new Date(record.created_at as string)}
          name={record.activity.name}
          icon={record.activity.icon}
          stopCounter={stopCounter}
        />
      ) : (
        <IddleCounter />
      )}
    </motion.div>
  );
}
