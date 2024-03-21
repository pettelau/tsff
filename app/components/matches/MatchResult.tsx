import { ExtendedMatch } from "@/data/getClubMatches";
import { StatusMatch } from "@/app/components/matches/StatusMatch";

type MatchResultProps = {
  match: ExtendedMatch;
};

export const MatchResult = ({ match: match }: MatchResultProps) => {
  return (
    <div className="flex flex-row w-full justify-center items-center">
      <div className="flex flex-col-reverse w-full sm:flex-row items-center justify-end sm:space-x-4">
        <div className="text-sm sm:text-lg mt-2 sm:mt-0">
          {match.homeTeam.name}
        </div>
        <div className="flex flex-row justify-center w-[60px] h-[60px] rounded-lg border-2 border-primary"></div>
      </div>
      <div className="flex flex-col w-[50px] sm:w-[150px] justify-center items-center">
        <StatusMatch match={match} isBig={true} />
      </div>
      <div className="flex flex-col w-full sm:flex-row items-center justify-start sm:space-x-4">
        <div className="flex flex-row justify-center w-[60px] h-[60px] rounded-lg border-2 border-primary"></div>
        <div className="text-sm sm:text-lg mt-2 sm:mt-0">
          {match.awayTeam.name}
        </div>
      </div>
    </div>
  );
};
