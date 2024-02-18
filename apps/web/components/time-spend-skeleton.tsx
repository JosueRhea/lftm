import { Skeleton } from "./ui/skeleton";

export const TimeSpendSkeleton = () => {
  return (
    <div>
      <Skeleton className="w-full h-52" />
      <Skeleton className="w-full sm:w-1/4 h-16 my-4" />
    </div>
  );
};
