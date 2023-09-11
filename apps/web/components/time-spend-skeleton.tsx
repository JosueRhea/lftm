import { Skeleton } from "./ui/skeleton";

export const TimeSpendSkeleton = () => {
  return (
    <div>
      <div className="w-full flex justify-between items-center">
        <Skeleton className="w-24 sm:w-40 h-8" />
        <Skeleton className="w-[170px] sm:w-[250px] h-8" />
      </div>
      <Skeleton className="w-full h-52" />
    </div>
  );
};
