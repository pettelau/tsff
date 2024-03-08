import { SemesterType, UserRole } from "@prisma/client";

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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
