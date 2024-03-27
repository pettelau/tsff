"use client";

import { ExtendedMatch } from "@/data/getClubMatches";
import {
  formatDateVerbose,
  getExpectedMatchState,
  getMatchTime,
} from "@/lib/utils";
import { MatchState } from "@/types/types";
import { getHours, getMinutes } from "date-fns";
import { useRouter } from "next/navigation";

export type StatusMatchProps = {
  viewAsClubId?: number | null;
  match: ExtendedMatch;
  isBig?: boolean;
};

export const StatusMatch = ({
  viewAsClubId = null,
  match,
  isBig = false,
}: StatusMatchProps) => {
  const router = useRouter();
  const matchState = getExpectedMatchState(match.kickoffTime);

  const handleOnClick = () => {
    if (isBig) return;
    router.push(`/kamp/${match.id}`);
  };

  const getBgColor = () => {
    if (!viewAsClubId || match.homeGoals === null || match.awayGoals === null) {
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

  return (
    <div onClick={handleOnClick} className={`${isBig ? "" : "cursor-pointer"}`}>
      {matchState === MatchState.NOT_STARTED && (
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
                {String(getMinutes(new Date(match.kickoffTime))).padStart(
                  2,
                  "0",
                )}
              </div>
            </div>
          ) : (
            "Ukjent"
          )}
        </div>
      )}

      {matchState === MatchState.ONGOING && (
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
      )}

      {matchState === MatchState.FINISHED && (
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
      )}

      {[
        MatchState.NOT_STARTED,
        MatchState.ONGOING,
        MatchState.FINISHED,
      ].indexOf(matchState) === -1 && <div>Ukjent</div>}
    </div>
  );
};
