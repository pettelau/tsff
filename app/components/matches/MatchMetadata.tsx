import { ExtendedMatch } from "@/data/getClubMatches";
import { competitionTypesMap, venuesMap } from "@/lib/enum-mappings";
import { formatDateVerbose, getCurrentSeason } from "@/lib/utils";
import { getHours, getMinutes } from "date-fns";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdStadium } from "react-icons/md";

type MatchMetadataProps = {
  match: ExtendedMatch;
};

export const MatchMetadata = ({ match: match }: MatchMetadataProps) => {
  const competitionName =
    competitionTypesMap[match.competitionRound.competition.type].label +
    " " +
    getCurrentSeason();

  return (
    <div className="flex flex-col items-center text-sm space-y-2">
      <div className="font-light">
        {competitionName}
        {" - "}
        Runde {match.competitionRound.round}
      </div>
      <div className="flex flex-col w-full sm:flex-row space-y-2 sm:space-y-0 font-light items-center justify-center">
        <div className="flex flex-row w-full items-center justify-center sm:justify-end space-x-2">
          <div>
            <FaRegCalendarAlt />
          </div>
          <div>
            {match.kickoffTime ? (
              <>
                {formatDateVerbose(match.kickoffTime)}{" "}
                {getHours(new Date(match.kickoffTime))}:
                {String(getMinutes(new Date(match.kickoffTime))).padStart(
                  2,
                  "0",
                )}
              </>
            ) : (
              "KO ikke satt"
            )}
          </div>
        </div>

        <div className="hidden sm:flex flex-row justify-center text-center mx-4">
          |
        </div>
        <div className="flex flex-row w-full justify-center sm:justify-start items-center space-x-2">
          <div>
            <MdStadium />
          </div>
          <div>{match.venue ? venuesMap[match.venue].label : "Ukjent"}</div>
        </div>
      </div>
    </div>
  );
};
