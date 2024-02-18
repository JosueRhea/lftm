import { eachDayOfInterval } from "date-fns";
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

export function createDayDatesArray({ from, to }: { from: Date; to: Date }) {
  const datesArray = eachDayOfInterval({ start: from, end: to }).map((date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return { start: dayStart, end: dayEnd };
  });

  return datesArray;
}

function ten(i: number) {
  return (i < 10 ? "0" : "") + i;
}

export function toDatetimeLocal(date: string) {
  const dateCons = new Date(date);
  const YYYY = dateCons.getFullYear();
  const MM = ten(dateCons.getMonth() + 1);
  const DD = ten(dateCons.getDate());
  const HH = ten(dateCons.getHours());
  const II = ten(dateCons.getMinutes());
  const SS = ten(dateCons.getSeconds());

  return YYYY + "-" + MM + "-" + DD + "T" + HH + ":" + II + ":" + SS;
}
