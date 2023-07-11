import { Skeleton } from "@/components/ui/skeleton";

function Loading() {
  return (
    <div className="mt-12">
      <div className="w-full flex flex-col items-center">
        <Skeleton className="h-10 w-full max-w-xs rounded-full" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-8 w-44 rounded-md" />
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mt-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Loading;
