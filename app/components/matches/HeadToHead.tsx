import { getHeadToHeadMatches } from "@/data/getHeadToHeadMatches";
import { Match } from "@/app/components/matches/Match";
import { Card, Link } from "@nextui-org/react";

type HeadToHeadProps = {
  clubId1: number;
  clubId2: number;
  excludeMatchId?: number;
};
export const HeadToHead = async ({
  clubId1: clubId1,
  clubId2: clubId2,
  excludeMatchId: excludeMatchId,
}: HeadToHeadProps) => {
  let matches = await getHeadToHeadMatches(clubId1, clubId2);

  if (excludeMatchId) {
    matches = matches.filter((match) => match.id !== excludeMatchId);
  }

  return (
    <div className="flex flex-col items-center">
      <h4 className="h4 mb-2">Head To Head</h4>
      {matches.length > 0 ? (
        matches.map((match) => (
          <Card key={match.id} className="max-w-lg w-full py-2">
            <Link href={`/kamp/${match.id}`}>
              <Match match={match} includeMetadata includeFullDate />
            </Link>
          </Card>
        ))
      ) : (
        <div className="text-sm font-light">
          Ingen andre oppgjør mellom lagene finnes
        </div>
      )}
    </div>
  );
};
