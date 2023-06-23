"use client";
import { Loader2, Plus } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { useDb } from "@/hooks/use-db";

export function AddActivity() {
  const [open, setOpen] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {client} = useDb()
  const router = useRouter();

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

    setIsLoading(true);
    const {
      data: { session },
    } = await client.auth.getSession();

    const { error } = await createActivity(client, {
      name,
      icon: selectedIcon!,
      userId: session?.user.id as string,
    });
    setIsLoading(false);
    if (error) {
      setErrors([error.message]);
      return;
    }

    setOpen(false);
    router.refresh();
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
