import { Club, Match } from "@prisma/client";

export type CompetitionTeam = {
  team: string;
  teamId: number;
  matchesPlayed: number;
  points: number;
  win: number;
  draw: number;
  lose: number;
  goalsScored: number;
  goalsConceded: number;
  formMatches: FormMatch[];
};

export type FormMatch = {
  matchId: number;
  homeClubId: number;
  awayClubId: number;
  homeClubName: string;
  awayClubName: string;
  outcome: "W" | "D" | "L";
  result: string;
  kickoffTime: Date | null;
};

export type MatchWithTeams = Match & {
  homeTeam: Club;
  awayTeam: Club;
};

export type ServiceMenuT = {
  name: string;
  href: string;
  icon: JSX.Element;
  hideIfNoClub: boolean;
};

export type PlayerGoals = {
  id: number
  firstName: string;
  lastName: string;
  clubName: string | null;
  goals: number;
}
export type PlayerYellow = {
  id: number
  firstName: string;
  lastName: string;
  clubName: string | null;
  yellows: number;
}
export type PlayerRed = {
  id: number
  firstName: string;
  lastName: string;
  clubName: string | null;
  reds: number;
}
export type PlayerWithClub = {
  id: number;
  firstName: string;
  lastName: string;
  club: Club | null;
};


export enum MatchState {
  NOT_STARTED,
  ONGOING,
  FINISHED,
  UNKNOWN,
}

export enum RecipientGroup {
  ALL_USERS = "ALL_USERS",
  ALL_SERVICE = "ALL_SERVICE",
  SERVICE_WITH_TEAM = "SERVICE_WITH_TEAM",
  ADMIN = "ADMIN",
  CUSTOM = "CUSTOM",
}