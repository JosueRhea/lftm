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

export function getCounterFromDecimals(diff: number) {
  // console.log(diff)
  const totalMinutes = Math.floor(diff * 60);
  const minutes = totalMinutes % 60;
  const convertedHours = Math.floor(totalMinutes / 60);

  return {
    hours: convertedHours,
    minutes: minutes,
  };
}

export const getCounterFromStartAndEndDate = (
  startDate: Date,
  endDate: Date | null
) => {
  const now = endDate ? endDate : new Date();
  const start = startDate;

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

type Counter = {
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
};

export function sumTwoCounters(counter1: Counter, counter2: Counter) {
  // Extract individual components from newCounterTime
  const newDays = counter1.days;
  const newHours = counter1.hours;
  const newMinutes = counter1.minutes;
  const newSeconds = counter1.seconds;

  // Extract individual components from existingCounterTime
  const existingDays = counter2.days;
  const existingHours = counter2.hours;
  const existingMinutes = counter2.minutes;
  const existingSeconds = counter2.seconds;

  // Sum up the corresponding components
  let totalDays = existingDays + newDays;
  let totalHours = existingHours + newHours;
  let totalMinutes = existingMinutes + newMinutes;
  let totalSeconds = existingSeconds + newSeconds;

  // Handle carryover
  if (totalSeconds >= 60) {
    const minutesCarryover = Math.floor(totalSeconds / 60);
    totalSeconds %= 60;
    totalMinutes += minutesCarryover;
  }

  if (totalMinutes >= 60) {
    const hoursCarryover = Math.floor(totalMinutes / 60);
    totalMinutes %= 60;
    totalHours += hoursCarryover;
  }

  if (totalHours >= 24) {
    const daysCarryover = Math.floor(totalHours / 24);
    totalHours %= 24;
    totalDays += daysCarryover;
  }

  return {
    days: totalDays,
    hours: totalHours,
    minutes: totalMinutes,
    seconds: totalSeconds,
  };
}

export function createDayDatesArray({ count }: { count: number }) {
  const datesArray = [];

  for (let i = count - 1; i >= 0; i--) {
    const dayStart = new Date();
    dayStart.setDate(dayStart.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart.getTime());
    dayEnd.setHours(23, 59, 59, 999);

    datesArray.push({ start: dayStart, end: dayEnd });
  }

  return datesArray;
}
