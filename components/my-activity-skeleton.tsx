import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

function ProgressSkeleton() {
  return (
    <div className={"w-full flex gap-2 items-end"}>
      <Skeleton className="w-4 h-4" />
      <div className="w-full">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-full h-4 mt-2" />
      </div>
      <Skeleton className="w-6 h-4" />
    </div>
  );
}

export function MyActivitySkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="w-full flex justify-between items-center">
          <Skeleton className="w-40 h-8" />
          <Skeleton className="w-[170px] sm:w-[250px] h-8" />
        </div>
      </CardHeader>
      <CardContent className="w-full flex items-center justify-center"></CardContent>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="w-full flex items-center justify-center">
          <Skeleton className="w-52 h-52 rounded-full" />
        </div>
        <div className="w-full">
          <div className="flex flex-col gap-y-2 mt-2">
            <ProgressSkeleton />
            <ProgressSkeleton />
            <ProgressSkeleton />
            <ProgressSkeleton />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
