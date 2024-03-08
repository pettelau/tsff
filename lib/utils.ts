import { SemesterType, UserRole } from "@prisma/client";


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
