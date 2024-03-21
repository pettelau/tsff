import { ExtendedMatch } from "@/data/getClubMatches";

import { Card, Divider } from "@nextui-org/react";

import { MatchEvents } from "@/app/components/matches/MatchEvents";
import { MatchMetadata } from "@/app/components/matches/MatchMetadata";
import { MatchResult } from "@/app/components/matches/MatchResult";
import { getExtendedMatch } from "@/data/getExtendedMatch";
import {
  ExtendedMatchSquad,
  getExtendedMatchSquads,
} from "@/data/getExtendedMatchSquads";
import { getExtendedMatchEvents } from "@/data/getExtendedMatchEvents";
import { MatchSquads } from "@/app/components/matches/MatchSquads";
import { Match } from "@/app/components/matches/Match";
import { HeadToHead } from "@/app/components/matches/HeadToHead";
import { isFuture } from "date-fns";

type MatchPageProps = {
  params: { id: string };
};
const MatchPage = async ({ params: params }: MatchPageProps) => {
  const matchId = Number(params.id);

  const match: ExtendedMatch = await getExtendedMatch(matchId);

  const matchEvents = await getExtendedMatchEvents(matchId);

  const squads: ExtendedMatchSquad[] = await getExtendedMatchSquads(matchId);

  return (
    <Card className="flex flex-col justify-center space-y-4 w-full px-1 sm:px-6 py-4 max-w-3xl">
      <MatchMetadata match={match} />
      <Divider />
      <MatchResult match={match} />

      {match.kickoffTime && !isFuture(match.kickoffTime) && (
        <div>
          <MatchEvents
            matchEvents={matchEvents}
            homeClubId={match.homeClubId}
            awayClubId={match.awayClubId}
          />
        </div>
      )}
      <Divider />
      <MatchSquads
        squads={squads}
        matchEvents={matchEvents}
        homeClubId={match.homeClubId}
        awayClubId={match.awayClubId}
        homeClubName={match.homeTeam.name}
        awayClubName={match.awayTeam.name}
      />
      <Divider />
      <div>
        <HeadToHead
          clubId1={match.homeClubId}
          clubId2={match.awayClubId}
          excludeMatchId={match.id}
        />
      </div>
    </Card>
  );
};

export default MatchPage;
