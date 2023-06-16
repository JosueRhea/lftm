"use client";
import { Plus } from "lucide-react";
import { ActivitiesIcons } from "./activities-icons";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { FormEvent, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import { createActivity } from "@/services/activity";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function AddActivity() {
  const [open, setOpen] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const client = createClientComponentClient();

  const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors([]);
    const name = nameRef.current?.value || "";
    const errorsEncountered = [];

    if (name.length <= 0) errorsEncountered.push("Name is required");
    if (!selectedIcon) errorsEncountered.push("Icon is required");

    if (errorsEncountered.length > 0) {
      setErrors(errorsEncountered);
      return;
    }

    const {
      data: { session },
    } = await client.auth.getSession();

    const { error } = await createActivity(client, {
      name,
      icon: selectedIcon!,
      userId: session?.user.id as string,
    });    
    if (error) {
      setErrors([error.message]);
      return;
    }

    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(openChanged) => {
        setOpen(openChanged);

        if (!openChanged) {
          // Reset the form
          nameRef.current!.value = "";
          setSelectedIcon(null);
          setErrors([]);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new activity</DialogTitle>
          <DialogDescription>
            Create a new activity to track your time.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleOnSubmit}>
          <label className="text-sm" htmlFor="name">
            Name
          </label>
          <Input id="name" ref={nameRef} className="col-span-3 mt-2" />
          <ActivitiesIcons onChange={setSelectedIcon} />
          {errors.length > 0 && (
            <Alert variant="destructive" className="my-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <ul>
                {errors.map((error) => (
                  <li className="list-disc" key={error}>
                    <AlertDescription>{error}</AlertDescription>
                  </li>
                ))}
              </ul>
            </Alert>
          )}
          <DialogFooter className="mt-2">
            <Button type="submit" className="w-full">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
