import { ExtendedMatch } from "@/data/getClubMatches";
import {
  formatDateVerbose,
  getExpectedMatchState,
  getMatchTime,
} from "@/lib/utils";
import { MatchState } from "@/types/types";
import { getHours, getMinutes } from "date-fns";

export type StatusMatchProps = {
  viewAsClubId?: number | null;
  match: ExtendedMatch;
  isBig?: boolean;
};
export const StatusMatch = ({
  viewAsClubId: viewAsClubId = null,
  match: match,
  isBig: isBig = false,
}: StatusMatchProps) => {
  const matchState = getExpectedMatchState(match.kickoffTime);

  const getBgColor = () => {
    if (!viewAsClubId) {
      return;
    }

    if (match.homeGoals === match.awayGoals) {
      return "bg-gray-700";
    }

    if (viewAsClubId === match.homeClubId) {
      if (match.homeGoals! > match.awayGoals!) {
        return "bg-green-400";
      } else {
        return "bg-red-400";
      }
    }

    if (viewAsClubId === match.awayClubId) {
      if (match.homeGoals! < match.awayGoals!) {
        return "bg-green-400";
      } else {
        return "bg-red-400";
      }
    }
    return "bg-gray-300";
  };

  if (matchState === MatchState.NOT_STARTED) {
    return (
      <div
        className={`flex ${
          isBig ? "w-[100px] text-lg" : "w-[50px]"
        } mx-4 px-2 py-1 justify-center font-light`}
      >
        {match.kickoffTime ? (
          <div className={isBig ? "flex flex-col items-center" : ""}>
            {isBig && <div>{formatDateVerbose(match.kickoffTime, true)}</div>}
            <div>
              {getHours(new Date(match.kickoffTime))}:
              {String(getMinutes(new Date(match.kickoffTime))).padStart(2, "0")}
            </div>
          </div>
        ) : (
          "Ukjent"
        )}
      </div>
    );
  } else if (matchState == MatchState.ONGOING) {
    return (
      <div className={isBig ? "flex flex-col items-center" : ""}>
        {isBig && (
          <div
            className={`flex ${
              isBig ? "w-[100px] text-lg" : "w-[50px]"
            } mx-4 px-2 py-1 rounded-lg justify-center`}
          >
            {match.homeGoals !== null ? match.homeGoals : "?"} -{" "}
            {match.awayGoals !== null ? match.awayGoals : "?"}
          </div>
        )}
        <div
          className={`flex flex-row justify-center items-center space-x-1 ${
            isBig ? "w-[100px] text-lg" : "w-[50px]"
          } mx-4`}
        >
          {getMatchTime(match.kickoffTime!) !== "Pause" && (
            <div className="pulsating-dot pb-1"></div>
          )}
          <div>{getMatchTime(match.kickoffTime!)}</div>
        </div>
      </div>
    );
  } else if (
    matchState === MatchState.FINISHED &&
    match.homeGoals !== null &&
    match.awayGoals !== null
  ) {
    return (
      <div className={isBig ? "flex flex-col items-center" : ""}>
        <div
          className={`flex ${
            isBig ? "w-[100px] text-lg" : "w-[50px]"
          } mx-4 px-2 py-1 rounded-lg justify-center ${getBgColor()}`}
        >
          {match.homeGoals} - {match.awayGoals}
        </div>
        {isBig && <div className="font-light text-sm">Ferdig</div>}
      </div>
    );
  } else {
    return <div>Ukjent</div>;
  }
};
