import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function MyActivitySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="w-40 h-8" />
      </CardHeader>
      <CardContent className="w-full flex items-center justify-center">
        <Skeleton className="w-52 h-52 rounded-full" />
      </CardContent>
    </Card>
  );
}
