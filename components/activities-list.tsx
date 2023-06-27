import { useActivities } from "@/hooks/use-activities";
import { Activity } from "./activity";

interface Props {
  userId: string;
  currentActivityId: string | null;
}

export function ActivitiesList({ userId, currentActivityId }: Props) {
  const { data, error, isLoading } = useActivities({ userId });

  if (isLoading) {
    return <p>Loading</p>;
  }

  const activities = data?.activity ?? [];

  return (
    <>
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
    </>
  );
}
