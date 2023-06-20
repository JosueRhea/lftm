"use client";
import { getCounterFromStartDate } from "@/lib/date";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  startDate: Date;
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
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{
            duration: 0.5,
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

export function Counter({ startDate }: Props) {
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

  return (
    <div className="w-full flex items-center justify-center">
      <div className="text-4xl flex gap-x-2">
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
  );
}
