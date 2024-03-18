import { ExtendedMatch } from "@/data/getClubMatches";
import { Match } from "@prisma/client";

type FinishedMatchProps = {
  match: ExtendedMatch;
};

export const FinishedMatch = ({ match: match }: FinishedMatchProps) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row space-x-2">
        <div>{match.homeTeam.name}</div>
        <div>
          {match.homeGoals} - {match.awayGoals}
        </div>
        <div>{match.awayTeam.name}</div>
      </div>
    </div>
  );
};
