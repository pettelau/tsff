import {
  CompetitionType,
  MatchEventType,
  Position,
  SemesterType,
  UserRole,
  Venue,
} from "@prisma/client";

export const userRolesMap = {
  [UserRole.ADMIN]: { label: "Admin" },
  [UserRole.USER]: { label: "Servicebruker" },
} satisfies Record<UserRole, { label: string }>;

export const userRolesList = Object.entries(userRolesMap).map(
  ([type, { label }]) => ({
    type,
    label,
  }),
) satisfies { type: string; label: string }[];

export const positionsMap = {
  [Position.KEEPER]: { label: "Keeper", order: 1 },
  [Position.BACK]: { label: "Back", order: 2 },
  [Position.CENTRE_BACK]: { label: "Midtstopper", order: 3 },
  [Position.MIDTFIELDER]: { label: "Midtbane", order: 4 },
  [Position.WINGER]: { label: "Kant", order: 5 },
  [Position.STRIKER]: { label: "Spiss", order: 6 },
} satisfies Record<Position, { label: string; order: number }>;

export const positionsList = Object.entries(positionsMap).map(
  ([type, { label, order }]) => ({
    type,
    label,
    order,
  }),
) satisfies { type: string; label: string; order: number }[];

export const matchEventTypesMap = {
  [MatchEventType.GOAL]: { label: "Mål" },
  [MatchEventType.RED_CARD]: { label: "Rødt kort" },
  [MatchEventType.YELLOW_CARD]: { label: "Gult kort" },
} satisfies Record<MatchEventType, { label: string }>;

export const matchEventTypesList = Object.entries(matchEventTypesMap).map(
  ([type, { label }]) => ({
    type,
    label,
  }),
) satisfies { type: string; label: string }[];

export const venuesMap = {
  [Venue.TEMPE_HOVEDBANE]: { label: "Tempe hovedbane" },
  [Venue.TEMPE_KUNSTGRESS]: { label: "Tempe kunstgress" },
  [Venue.OTHER]: { label: "Ukjent" },
} satisfies Record<Venue, { label: string }>;

export const venuesList = Object.entries(venuesMap).map(
  ([type, { label }]) => ({
    type,
    label,
  }),
) satisfies { type: string; label: string }[];

export const competitionTypesMap = {
  [CompetitionType.AVDELING_A]: { label: "Avdeling A" },
  [CompetitionType.AVDELING_B]: { label: "Avdeling B" },
  [CompetitionType.AVDELING_C]: { label: "Avdeling C" },
  [CompetitionType.A_SLUTTSPILL]: { label: "A-sluttspill" },
  [CompetitionType.B_SLUTTSPILL]: { label: "B-sluttspill" },
  [CompetitionType.C_SLUTTSPILL]: { label: "C-sluttspill" },
  [CompetitionType.D_SLUTTSPILL]: { label: "D-sluttspill" },
  [CompetitionType.E_SLUTTSPILL]: { label: "E-sluttspill" },
  [CompetitionType.FRIENDLY]: { label: "Treningskamper" },
} satisfies Record<CompetitionType, { label: string }>;

export const competitionTypesList = Object.entries(competitionTypesMap).map(
  ([type, { label }]) => ({
    type,
    label,
  }),
) satisfies { type: string; label: string }[];

export const SemesterTypesMap = {
  [SemesterType.AUTUMN]: { label: "Høst" },
  [SemesterType.SPRING]: { label: "Vår" },
} satisfies Record<SemesterType, { label: string }>;