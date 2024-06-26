import { MatchEventType } from "@prisma/client";

type EventSectionProps = {
  events: MatchEvent[];
  homeClubId: number;
  awayClubId: number;
  icon: JSX.Element;
};

type Player = {
  firstName: string;
  lastName: string | null;
};

type Squad = {
  clubId: number;
};

type MatchEvent = {
  id: number;
  type: MatchEventType;
  squadPlayerId: number;
  squadPlayer: {
    player: Player;
    squad: Squad;
    id: number;
    squadId: number;
    playerId: number;
  };
};

export const EventSection = ({
  events,
  homeClubId,
  awayClubId,
  icon,
}: EventSectionProps) => (
  <div className="flex flew-row w-full justify-center space-x-6">
    <div className="flex-1 text-right">
      {events
        .filter((event) => event.squadPlayer.squad.clubId === homeClubId)
        .map((event) => (
          <div key={event.id} className="font-light text-sm">
            {event.squadPlayer.player.firstName}{" "}
            {event.squadPlayer.player.lastName}
          </div>
        ))}
    </div>
    <div className="flex flex-col items-center pt-[3px]">
      <div className="w-full text-center">{icon}</div>
    </div>
    <div className="flex-1 text-left">
      {events
        .filter((event) => event.squadPlayer.squad.clubId === awayClubId)
        .map((event) => (
          <div key={event.id} className="font-light text-sm">
            {event.squadPlayer.player.firstName}{" "}
            {event.squadPlayer.player.lastName}
          </div>
        ))}
    </div>
  </div>
);
