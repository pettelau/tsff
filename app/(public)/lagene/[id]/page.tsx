import { currentUser } from "@/lib/auth";
import { getClubInfo } from "@/data/getClubInfo";
import { getClubPlayers } from "@/data/getClubPlayers";
import { UserRole, Club, Player } from "@prisma/client";
import { Card } from "@nextui-org/react";
import { getClubCompetitions } from "@/data/getClubCompetitions";
import { getCompetitionMatchesWithResults } from "@/data/getCompetitionMatchesWithResults";
import { getCompetitionClubs } from "@/data/getCompetitionClubs";
import { generateTable } from "@/services/generate-table-data";
import { competitionTypesMap } from "@/lib/enum-mappings";
import { getCurrentSeason } from "@/lib/utils";
import { ClubCompetitionTableSmall } from "@/app/components/Clubs/ClubCompetitionTable-small";
import { ClubPlayers } from "@/app/components/Clubs/ClubPlayers";
import { SocialIcon } from "react-social-icons";
import { getFutureMatches, getPastMatches } from "@/data/getFutureMatches";

type ClubPageProps = {
  params: { id: string };
};

const ClubPage = async ({ params }: ClubPageProps) => {
  const clubId = Number(params.id);

  const user = await currentUser();

  const clubData = await getClubInfo(clubId);
  const clubPlayers = await getClubPlayers(clubId);
  const clubComp = await getClubCompetitions(clubId);

  const futureMatches = await getFutureMatches(clubId);
  const pastMatches = await getPastMatches(clubId);
  const matchesToShow = futureMatches.slice(0, 5);
  const pastMatchesToShow = pastMatches.slice(0, 5);

  const instagram = clubData?.instagram;

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24-hour format
    timeZone: "Europe/Oslo", // Set the appropriate timezone
  };

  return (
    <div className="flex flex-row items-stretch justify-center flex-grow max-w-screen-2xl sm:mx-6">
      <Card className="flex flex-row w-full sm:w-2/3 p-4 dark justify-center">
        <div className="w-1/3 flex flex-col items-center justify-start flex-grow dark">
          <div className="flex flex-col items-center">
            {clubData?.name}
            {instagram && <SocialIcon url={instagram} style={{ height: 30, width: 30 }} className="" />} <br />
            <ClubPlayers data={clubPlayers} name="Registered Players" />
          </div>
        </div>
        <div className="w-2/3 flex flex-row justify-around dark space-x-4">
          <div className="flex flex-col items-center justify-start space-y-2">
            <h2>Upcoming Matches</h2>
            {matchesToShow.length > 0 ? (
              matchesToShow.map((match) => (
                <div key={match.id} className="match-item">
                  <p className="match-teams">{`${match.homeTeam.name} vs ${match.awayTeam.name}`}</p>
                  <p className="match-time">{match.kickoffTime ? new Date(match.kickoffTime).toLocaleString('en-GB', dateOptions) : "Kickoff time not set"}</p>
                </div>
              ))
            ) : (
              <p>No upcoming matches</p>
            )}
            {Array.from({ length: 5 - matchesToShow.length }).map((_, index) => (
              <div key={`empty-${index}`} className="match-item empty-space">
                &nbsp;
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-start space-y-2">
            <h2>Last 5 Matches</h2>
            {pastMatchesToShow.length > 0 ? (
              pastMatchesToShow.map((match) => {
                let resultColor = "gray";
                if (typeof match.homeGoals === "number" && typeof match.awayGoals === "number") {
                  if ((match.homeClubId === clubId && match.homeGoals > match.awayGoals) ||
                      (match.awayClubId === clubId && match.awayGoals > match.homeGoals)) {
                    resultColor = "green"; // Win
                  } else if (match.homeGoals === match.awayGoals) {
                    resultColor = "yellow"; // Draw
                  } else {
                    resultColor = "red"; // Loss
                  }
                }

                return (
                  <div key={match.id} className="match-item">
                    <p className="match-teams">{`${match.homeTeam.name} vs ${match.awayTeam.name}`}</p>
                    <p className="match-time">
                      {match.kickoffTime ? new Date(match.kickoffTime).toLocaleString('en-GB', dateOptions) : "Match time not set"}
                    </p>
                    <p className="match-result">
                      {typeof match.homeGoals === 'number' && typeof match.awayGoals === 'number' ? (
                        `${match.homeGoals} - ${match.awayGoals}` 
                      ) : (
                        "Result not available"
                      )}
                    </p>
                    <div className={`result-indicator ${resultColor}`} />
                  </div>
                );
              })
            ) : (
              <p>No past matches</p>
            )}
            {Array.from({ length: 5 - pastMatchesToShow.length }).map((_, index) => (
              <div key={`empty-${index}`} className="match-item empty-space">
                &nbsp;
              </div>
            ))}
          </div>
        </div>
      </Card>
      <Card className="w-1/3 flex-col items-center hidden sm:flex space-y-2 dark">
        {clubComp.map(async (comp) => {
          const compMatches = await getCompetitionMatchesWithResults(comp.id);
          const compClubs = await getCompetitionClubs(comp.id);
          const tableData = generateTable(compMatches, compClubs);
          const name =
            competitionTypesMap[comp.type].label + " " + getCurrentSeason();
          return (
            <div
              key={comp.id}
              className="w-full bg-primary rounded-xl text-center p-3 text-white"
            >
              <ClubCompetitionTableSmall
                tableData={tableData}
                name={name}
                currentClubId={clubId}
              />
            </div>
          );
        })}
      </Card>
    </div>
  );
};

export default ClubPage;
