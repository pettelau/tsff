import { currentUser } from "@/lib/auth";
import { getClubInfo } from "@/data/getClubInfo";
import { getClubPlayers } from "@/data/getClubPlayers";
import { UserRole, Club, Player } from "@prisma/client";
import { Card, Divider } from "@nextui-org/react";
import { getClubCompetitions } from "@/data/getClubCompetitions";
import { getCompetitionMatchesWithResults } from "@/data/getCompetitionMatchesWithResults";
import { getCompetitionClubs } from "@/data/getCompetitionClubs";
import { generateTable } from "@/services/generate-table-data";
import { competitionTypesMap } from "@/lib/enum-mappings";
import { getCurrentSeason } from "@/lib/utils";
import { ClubCompetitionTableSmall } from "@/app/components/Clubs/ClubCompetitionTable-small";



type ClubPageProps = {
    params: { id: string };
};

const ClubPage = async ({ params: params }: ClubPageProps) => {
    const clubId = Number(params.id);

    const user = await currentUser();

    const clubData = await getClubInfo(clubId);
    const clubPlayers = await getClubPlayers(clubId);
    const clubComp = await getClubCompetitions(clubId);
    // const compMatches = await getCompetitionMatchesWithResults(clubData.competitionParticipation);
    // const compClubs = await getCompetitionClubs(clubData.competitionParticipation);
    // const tableData = generateTable(compMatches, compClubs);
    // const name = competitionTypesMap[clubData.type].label + " " + getCurrentSeason();

  
    return (
        <div className="flex flex-row items-stretch justify-center flex-grow max-w-screen-2xl sm:mx-6">
            <Card className="flex flex-col w-full sm:w-2/3">
                Card content <br />
                {clubData?.name} <br/>
                <ul>
        {clubPlayers.map(( player ) => (
            <li key={player.id}>{player.firstName} {player.lastName}</li>
        ))}
    </ul>

            </Card>
            <Card className="w-1/3 flex-col items-center hidden sm:flex space-y-2">
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
              <ClubCompetitionTableSmall tableData={tableData} name={name} currentClubId={clubId} />
            </div>
          );
        })}
            </Card>
        </div>
    );
};

export default ClubPage;