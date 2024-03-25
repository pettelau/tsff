import { ExtendedMatchEvent } from "@/data/getExtendedMatchEvents";
import { ExtendedMatchSquad } from "@/data/getExtendedMatchSquads";
import { matchEventTypesMap } from "@/lib/enum-mappings";
import { Player, UserRole } from "@prisma/client";
import { EditMatchSquadModal } from "./EditMatchSquadModal";
import { currentUser } from "@/lib/auth";

type MatchSquadsProps = {
  homeSquad: ExtendedMatchSquad;
  awaySquad: ExtendedMatchSquad;
  homeClubPlayers: Player[];
  awayClubPlayers: Player[];
  matchEvents: ExtendedMatchEvent[];

  homeClubName: string;
  awayClubName: string;
};

export const MatchSquads = async ({
  homeSquad: homeSquad,
  awaySquad: awaySquad,
  homeClubPlayers: homeClubPlayers,
  awayClubPlayers: awayClubPlayers,
  matchEvents: matchEvents,
  homeClubName: homeClubName,
  awayClubName: awayClubName,
}: MatchSquadsProps) => {
  const user = await currentUser();

  const canEditHome =
    user && (user.role === UserRole.ADMIN || user.club === homeSquad.clubId);
  const canEditAway =
    user && (user.role === UserRole.ADMIN || user.club === awaySquad.clubId);

  return (
    <div className="flex flex-row space-x-6 sm:space-x-14 w-full px-4 sm:px-2">
      <div className="flex-1">
        <h4 className="h4 mb-2">{homeClubName}</h4>
        <div className="flex flex-col space-y-2 text-xs sm:text-sm font-light">
          {canEditHome && (
            <EditMatchSquadModal
              allClubPlayers={homeClubPlayers}
              squad={homeSquad}
            >
              <>Endre hjemmetropp</>
            </EditMatchSquadModal>
          )}
          {homeSquad && homeSquad.players.length > 0 ? (
            homeSquad.players.map((player) => (
              <div key={player.id} className="flex flex-row items-center">
                <span className="mr-2">
                  {player.player.firstName} {player.player.lastName}
                </span>
                {matchEvents
                  .filter((event) => event.squadPlayerId === player.id)
                  .map((event) => (
                    <div key={event.id}>
                      {matchEventTypesMap[event.type].icon}
                    </div>
                  ))}
              </div>
            ))
          ) : (
            <div className="text-xs">Ingen kamptropp registrert.</div>
          )}
        </div>
      </div>
      <div className="flex-1 text-right">
        <h4 className="h4 mb-2">{awayClubName}</h4>
        <div className="flex flex-col space-y-2 text-xs sm:text-sm font-light">
          {canEditAway && (
            <EditMatchSquadModal
              allClubPlayers={homeClubPlayers}
              squad={awaySquad}
            >
              <>Endre bortetropp</>
            </EditMatchSquadModal>
          )}
          {awaySquad && awaySquad.players.length > 0 ? (
            awaySquad.players.map((player) => (
              <div
                key={player.id}
                className="flex flex-row items-center justify-end"
              >
                {matchEvents
                  .filter((event) => event.squadPlayerId === player.id)
                  .map((event) => (
                    <div key={event.id} className="pb-[1px]">
                      {matchEventTypesMap[event.type].icon}
                    </div>
                  ))}
                <span className="ml-2">
                  {player.player.firstName} {player.player.lastName}
                </span>
              </div>
            ))
          ) : (
            <div className="text-xs">Ingen kamptropp registrert.</div>
          )}
        </div>
      </div>
    </div>
  );
};
