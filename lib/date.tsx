export function getCounterFromStartDate(startDate: Date) {
  const now = new Date();
  // force 2 days
  const diff = now.getTime() - startDate.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return {
    hours: hours % 24,
    minutes: minutes % 60,
    days,
    seconds: seconds % 60,
  };
}

export function getCounterFromDiff(diff: number) {
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return {
    hours: hours % 24,
    minutes: minutes % 60,
    days,
    seconds: seconds % 60,
  };
}

export const getCounterFromStartAndEndDate = (
  startDate: string,
  endDate: string | null
) => {
  const now = endDate ? new Date(endDate) : new Date();
  const start = new Date(startDate);

  const diff = now.getTime() - start.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return {
    hours: hours % 24,
    minutes: minutes % 60,
    days,
    seconds: seconds % 60,
  };
};
