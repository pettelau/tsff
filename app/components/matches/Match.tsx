import { ExtendedMatch } from "@/data/getClubMatches";
import { competitionTypesMap } from "@/lib/enum-mappings";
import { formatDateVerbose } from "@/lib/utils";
import { Card } from "@nextui-org/react";
import { StatusMatch } from "./StatusMatch";


export type MatchProps = {
  match: ExtendedMatch;
  showServiceFunctionality?: boolean;
  viewAsClubId?: number;
  includeMetadata?: boolean
};

export const Match = ({
  match: match,
  viewAsClubId,
  showServiceFunctionality,
  includeMetadata = false
}: MatchProps) => {


  return (
    <div
      key={match.id}
      className="flex flex-col w-full items-center justify-between py-3"
    >
      {includeMetadata && <div className="flex flex-row w-full px-6 justify-between text-xs font-light">
        <div>
          {match.kickoffTime
            ? formatDateVerbose(match.kickoffTime)
            : "KO ikke satt"}
        </div>
        <div>
          {competitionTypesMap[match.competitionRound.competition.type].label}
        </div>
      </div>}
      <div className="flex flex-row w-full items-center text-xs sm:text-sm">
        <div className="text-right flex-1">{match.homeTeam.name}</div>

        <StatusMatch viewAsClubId={viewAsClubId ? viewAsClubId : null} match={match} />

        <div className="text-left flex-1">{match.awayTeam.name}</div>
      </div>
    </div>
  );
};
