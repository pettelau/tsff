import { db } from "@/lib/db";
import { MatchEventType } from "@prisma/client";

import { EventSection } from "@/app/components/matches/EventSection";
import {
  ExtendedMatchEvent,
  getExtendedMatchEvents,
} from "@/data/getExtendedMatchEvents";
import { matchEventTypesMap } from "@/lib/enum-mappings";


type MatchEventProps = {
  matchEvents: ExtendedMatchEvent[];
  homeClubId: number;
  awayClubId: number;
};
export const MatchEvents = async ({
  matchEvents: matchEvents,
  homeClubId: homeClubId,
  awayClubId: awayClubId,
}: MatchEventProps) => {
  if (matchEvents.length === 0) {
    return (
      <div className="flex flex-row justify-center font-light text-sm">
        Ingen kamphendelser er lagt inn.
      </div>
    );
  }

  const goals = matchEvents.filter(
    (match) => match.type === MatchEventType.GOAL,
  );
  const redCards = matchEvents.filter(
    (match) => match.type === MatchEventType.RED_CARD,
  );
  const yellowCards = matchEvents.filter(
    (match) => match.type === MatchEventType.YELLOW_CARD,
  );
  if (matchEvents.length === 0) {
    return (
      <div className="flex flex-row justify-center font-light text-sm">
        Ingen kamphendelser er lagt inn.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      {goals.length > 0 && (
        <EventSection
          events={goals}
          homeClubId={homeClubId}
          awayClubId={awayClubId}
          icon={matchEventTypesMap[MatchEventType.GOAL].icon}
        />
      )}
      {redCards.length > 0 && (
        <EventSection
          events={redCards}
          homeClubId={homeClubId}
          awayClubId={awayClubId}
          icon={matchEventTypesMap[MatchEventType.RED_CARD].icon}
        />
      )}
      {yellowCards.length > 0 && (
        <EventSection
          events={yellowCards}
          homeClubId={homeClubId}
          awayClubId={awayClubId}
          icon={matchEventTypesMap[MatchEventType.YELLOW_CARD].icon}
        />
      )}
    </div>
  );
};
