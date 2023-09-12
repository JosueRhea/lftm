"use client";
import { useCurrentActivity } from "@/hooks/use-current-activity";
import { useDb } from "@/hooks/use-db";
import { suscribeToCurrentUserData } from "@lftm/api";
import { useEffect, useState } from "react";
import { RecordWithRelationsProps } from "@/types/db";
import { RunningCounter } from "./counter";
import { Drawer } from "vaul";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  userId: string;
}

export function CurrentActivities({ userId }: Props) {
  const { client } = useDb();
  const {
    data: res,
    error,
    isLoading,
    invalidate,
    stopActivity,
  } = useCurrentActivity({ userId });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const channel = suscribeToCurrentUserData(client, {
      userId,
      callback: async () => {
        invalidate();
      },
      tag: "current-activity-subscription",
    }).subscribe(() => {});
    return () => {
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (res && res.length <= 0) {
      setOpen(false);
    }
  }, [res]);

  if (isLoading && !res) null;

  const handleOnStop = async (record: RecordWithRelationsProps) => {
    if (!record?.id || record.id.length <= 0) return;

    stopActivity({ record: record });
  };

  if (error || !res) return null;

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} shouldScaleBackground>
      <AnimatePresence mode="wait">
        {/* <Drawer.Trigger asChild> */}
        {res.length > 0 && (
          <motion.button
            className="fixed bottom-0 w-full right-0 p-4 left-0 h-24 text-foreground border border-border shadow-xl max-w-4xl mx-auto rounded-tr-xl rounded-tl-xl items-center z-30 bg-background"
            onClick={(event) => {
              event.stopPropagation();
              setOpen(true);
            }}
            initial={{ y: 200 }}
            animate={{ y: 0, transition: {
              mass: 0
            } }}
            exit={{
              y: 200,
            }}
            key={"motion-button-counter"}
          >
            {res.length > 0 && (
              <Activity
                record={res[0] as RecordWithRelationsProps}
                stopCounter={handleOnStop}
              />
            )}
          </motion.button>
        )}
      </AnimatePresence>
      {/* </Drawer.Trigger> */}
      <Drawer.Portal>
        <Drawer.Overlay className="fixed z-40 inset-0 bg-black/40" />
        <Drawer.Content className="bg-background max-w-4xl mx-auto z-50 rounded-t-[10px] h-full max-h-[50%] fixed bottom-0 left-0 right-0 w-full shadow-xl border border-border">
          <div className="w-full h-full p-4 flex flex-col overflow-y-auto gap-y-6">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300" />
            {res.length > 0 &&
              res.map((record) => (
                <Activity
                  record={(record as RecordWithRelationsProps) ?? undefined}
                  stopCounter={handleOnStop}
                  key={record.id}
                />
              ))}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

interface ActivityProps {
  record: RecordWithRelationsProps;
  stopCounter: (record: RecordWithRelationsProps) => void;
}

function Activity({ record, stopCounter }: ActivityProps) {
  return (
    <RunningCounter
      startDate={new Date(record.created_at as string)}
      name={record.activity.name}
      icon={record.activity.icon}
      stopCounter={stopCounter}
      record={record}
    />
  );
}
