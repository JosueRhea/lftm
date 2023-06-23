"use client";
import { Button } from "./ui/button";
import { AddActivity } from "./add-activity";
import { ActivityProps } from "@/types/db";
import { iconsKV } from "@/data/icons";
import { createRecord } from "@/services/activity";
import { useDb } from "@/hooks/use-db";

type Props = {
  isPlus?: boolean;
  isActive?: boolean;
  disabled?: boolean;
  data?: ActivityProps;
};

export function Activity({
  isPlus = false,
  isActive = false,
  disabled = false,
  data,
}: Props) {
  if (isPlus) {
    return <AddActivity />;
  }
  const { client } = useDb();

  const name = data?.name;
  const icon = data?.icon as string;

  const IconComp = iconsKV[icon];

  const handleOnClick = async () => {
    const {
      data: { session },
    } = await client.auth.getSession();

    if (!session) return;

    const { error } = await createRecord(client, {
      activityId: data?.id as string,
      userId: session.user.id,
    });

    if (!error) {
      console.log("record created");
    }
  };

  return (
    <Button
      className={`w-full ${isActive ? "border-primary" : ""}`}
      variant={"outline"}
      onClick={disabled ? undefined : handleOnClick}
      disabled={disabled}
    >
      <IconComp
        className={`w-4 h-4 mr-2 ${
          isActive ? "animate-bounce" : "animate-none"
        }`}
      />
      {name}
    </Button>
  );
}
