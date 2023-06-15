import { Activity } from "@/components/activity";
import { Button } from "@/components/ui/button";
import { StopCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="mt-12">
      <div className="w-full flex flex-col items-center">
        <p className="text-4xl">0: 00: 00</p>
        <p className="text-xl">Sleep</p>
        <div className="flex gap-x-2 mt-2">
          <Button>
            <StopCircle className="w-4 h-4 mr-2" />
            Stop
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Activities
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mt-4 gap-4">
          <Activity />
          <Activity />
          <Activity />
          <Activity isPlus={true} />
        </div>
      </div>
    </div>
  );
}
