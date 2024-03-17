import { MatchState } from "@/types/types";
import { GenderType, Match, SemesterType, UserRole } from "@prisma/client";

import { type ClassValue, clsx } from "clsx";
import {
  isToday,
  isTomorrow,
  isYesterday,
  format,
  differenceInHours,
} from "date-fns";
import { nb } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = <Type = unknown>(url: string) =>
  fetch(url).then((res) => res.json()) as Promise<Type>;

export const getCurrentSemesterType = () => {
  return new Date().getMonth() >= 6 ? SemesterType.AUTUMN : SemesterType.SPRING;
};

export const getCurrentYear = () => {
  return new Date().getFullYear();
};

export const getCurrentSeason = () => {
  const year = getCurrentYear();
  return getCurrentSemesterType() === SemesterType.AUTUMN
    ? `${year}/${year + 1}`
    : `${year - 1}/${year}`;
};

export const formatDateVerbose = (date: Date) => {
  if (isToday(date)) {
    return "I dag";
  }
  if (isTomorrow(date)) {
    return "I morgen";
  }
  if (isYesterday(date)) {
    return "I går";
  }
  return format(date, "d. MMMM", { locale: nb });
};

export const getResultColor = (res: "W" | "D" | "L") => {
  switch (res) {
    case "W":
      return "bg-green-400";
    case "D":
      return "bg-gray-400";
    case "L":
      return "bg-red-400";
  }
};

export const isCSV = (file: File) => {
  return file && file.name.endsWith(".csv");
};

export const translateGender = (genderStr: string): GenderType => {
  switch (genderStr) {
    case "Mann":
      return GenderType.MAN;
    case "Kvinne":
      return GenderType.WOMAN;
    default:
      return GenderType.MAN;
  }
};

export const getExpectedMatchState = (kickoffTime: Match["kickoffTime"]) => {
  if (!kickoffTime) {
    return MatchState.UNKNOWN;
  }

  const now = new Date();
  const kickoffTimeDate = new Date(kickoffTime);
  const matchDurationInHours = 2;

  if (kickoffTimeDate > now) {
    return MatchState.NOT_STARTED;
  } else if (
    Math.abs(differenceInHours(now, kickoffTimeDate)) < matchDurationInHours
  ) {
    return MatchState.ONGOING;
  } else {
    return MatchState.FINISHED;
  }
};

export const getMatchTime = (kickoffTime: Date) => {
  const currentTime = new Date().getTime();
  const ko = new Date(kickoffTime).getTime();
  // Calculate difference in minutes
  const diffMinutes = Math.floor((currentTime - ko) / 60000);

  if (diffMinutes <= 45) {
    // First half
    return `${diffMinutes}'`; // ' indicates minutes in football
  } else if (diffMinutes > 45 && diffMinutes <= 60) {
    // Halftime break
    return "Pause";
  } else if (diffMinutes > 60 && diffMinutes <= 105) {
    // Second half (subtracting the 15-minute break)
    return `${diffMinutes - 15}'`;
  } else {
    // After match duration
    return "90'+";
  }
};
