import { ExtendedMatch } from "@/data/getClubMatches";

import { Card, Divider } from "@nextui-org/react";
import { Button } from "@nextui-org/button";

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
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { EditMatchEventsModal } from "@/app/components/matches/EditMatchEventsModal";
import { getClubPlayers } from "@/data/getClubPlayers";

type MatchPageProps = {
  params: { id: string };
};

const MatchPage = async ({ params: params }: MatchPageProps) => {
  const matchId = Number(params.id);

  const user = await currentUser();

  const match: ExtendedMatch = await getExtendedMatch(matchId);

  const matchEvents = await getExtendedMatchEvents(matchId);

  const squads: ExtendedMatchSquad[] = await getExtendedMatchSquads(matchId);

  const homeSquad = squads.find((squad) => squad.clubId === match.homeClubId);
  const awaySquad = squads.find((squad) => squad.clubId === match.awayClubId);

  const homeClubPlayers = await getClubPlayers(match.homeClubId);
  const awayClubPlayers = await getClubPlayers(match.awayClubId);

  const canEditHome =
    user && (user.role === UserRole.ADMIN || user.club === match.homeClubId);
  const canEditAway =
    user && (user.role === UserRole.ADMIN || user.club === match.awayClubId);

  return (
    <Card className="flex flex-col justify-center space-y-4 w-full px-1 sm:px-6 py-4 max-w-3xl">
      <MatchMetadata match={match} />
      <Divider />
      <MatchResult match={match} />

      {match.kickoffTime &&
        !isFuture(match.kickoffTime) &&
        homeSquad &&
        awaySquad && (
          <div>
            <MatchEvents
              matchEvents={matchEvents}
              homeClubId={match.homeClubId}
              awayClubId={match.awayClubId}
            />
            {(canEditHome || canEditAway) && (
              <div className="flex flex-row justify-between space-x-4 pt-3">
                <div className={canEditHome ? "" : "hidden"}>
                  <EditMatchEventsModal squad={homeSquad}>
                    <>{match.homeTeam.name} - Ny hendelse</>
                  </EditMatchEventsModal>
                </div>
                <div className={canEditAway ? "" : "hidden"}>
                  <EditMatchEventsModal squad={awaySquad}>
                    <>{match.awayTeam.name} - Ny hendelse</>
                  </EditMatchEventsModal>
                </div>
              </div>
            )}
          </div>
        )}
      <Divider />
      {homeSquad && awaySquad && (
        <>
          <MatchSquads
            homeSquad={homeSquad}
            awaySquad={awaySquad}
            homeClubPlayers={homeClubPlayers}
            awayClubPlayers={awayClubPlayers}
            matchEvents={matchEvents}
            homeClubName={match.homeTeam.name}
            awayClubName={match.awayTeam.name}
          />
          <Divider />
        </>
      )}
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
