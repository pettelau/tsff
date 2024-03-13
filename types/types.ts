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
};
