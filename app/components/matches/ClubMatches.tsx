"use client";
import { useClubMatches } from "@/hooks/useQuery";
import { competitionTypesMap } from "@/lib/enum-mappings";
import { formatDateVerbose } from "@/lib/utils";
import { Button, Card, Divider } from "@nextui-org/react";
import axios from "axios";
import { Match } from "@/app/components/matches/Match";

import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useState } from "react";

export type ClubMatchesProps = {
  clubId: number;
};

export const ClubMatches = ({ clubId }: ClubMatchesProps) => {
  const [page, setPage] = useState<number>(0);
  const { data, isLoading, error } = useClubMatches(clubId, page);

  // Destructure the response to get matches and pagination flags
  const matches = data?.matches || [];
  const hasMorePrevious = data?.hasMorePrevious || false;
  const hasMoreNext = data?.hasMoreNext || false;

  if (error instanceof Error)
    return <div>An error occurred: {error.message}</div>;

  return (
    <Card className="pt-3 flex flex-col">
      <div className="flex flex-row justify-between items-center pb-3 px-8">
        <div>
          <button
            className={`flex items-center ${!hasMorePrevious && "hidden"}`}
            onClick={() => setPage((prev) => prev - 1)}
          >
            <IoIosArrowBack />
          </button>
        </div>
        <div>Kamper</div>
        <div>
          <button
            className={`flex items-center ${!hasMoreNext && "hidden"}`}
            onClick={() => setPage((prev) => prev + 1)}
          >
            <IoIosArrowForward />
          </button>
        </div>
      </div>
      <div>
        <Divider />
        {isLoading ? (
          <div className="p-6 flex justify-center">Laster inn ...</div>
        ) : (
          matches.map((match, i) => {
            return (
              <div key={match.id} className="flex flex-col">
                <div>
                  <Match
                    match={match}
                    viewAsClubId={clubId}
                    showServiceFunctionality={true}
                    includeMetadata={true}
                  />
                </div>
                {i < matches.length - 1 && (
                  <div className="flex justify-center mx-4">
                    <Divider />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
