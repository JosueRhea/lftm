import { useActivities } from "@/hooks/use-activities";
import { Activity } from "./activity";
import { Skeleton } from "./ui/skeleton";

interface Props {
  userId: string;
  currentActivityId: string | null;
}

export function ActivitiesList({ userId, currentActivityId }: Props) {
  const { data, error, isLoading } = useActivities({ userId });

  if (isLoading || !data) {
    return (
      <div className="mt-4 w-full">
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mt-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  const activities = data?.activity ?? [];

  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mt-4 gap-4">
      {error == null &&
        activities.map((activity) => {
          const isActive =
            currentActivityId != null && activity.id == currentActivityId;
          const isDisabled =
            (currentActivityId != null && activity.id != currentActivityId) ||
            isActive;

          return (
            <Activity
              key={activity.id}
              data={activity}
              disabled={isDisabled}
              isActive={isActive}
              userId={userId}
            />
          );
        })}
      <Activity isPlus={true} userId={userId} />
    </div>
  );
}
