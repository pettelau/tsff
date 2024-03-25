import { GoalTable } from "@/app/components/stats/goalTable";
import { YellowTable } from "@/app/components/stats/yellowTable";
import { RedTable } from "@/app/components/stats/redTable";
import { getPlayerStats } from "@/data/getPlayerStats";
import { getYellowStats } from "@/data/getYellowStats";
import { getRedStats } from "@/data/getRedStats";
import { getPlayersWithClubs } from "@/data/getPlayersWithClubs";

const DivisionPage = async () => {
  // Hent spillernavn og klubbinformasjon
  const playersWithClubs = await getPlayersWithClubs();
  // Hent målstatistikk
  const playerStats = await getPlayerStats();

  // Kombiner spillernavn, klubbinformasjon og målstatistikk
  const combinedStats = playersWithClubs
    .map((playerWithClub) => {
      const clubInfo = playerWithClub.club
        ? playerWithClub.club
        : { id: 0, name: "-" }; // Sjekk om klubbinformasjonen er tilgjengelig
      const goals =
        playerStats.find((stat) => stat.player.id === playerWithClub.id)
          ?.goals ?? 0;
      return {
        id: playerWithClub.id,
        firstName: playerWithClub.firstName,
        lastName: playerWithClub.lastName ?? "",
        clubName: clubInfo.name ?? "",
        goals,
      };
    })
    .sort((a, b) => b.goals - a.goals) // Sorter spillere etter antall gule kort i synkende rekkefølge
    .slice(0, 10); // Begrens listen til maksimalt 10 spillere;

  // Hent gule kort
  const yellowStats = await getYellowStats();

  // Kombiner spillernavn, klubbinformasjon og målstatistikk
  const yellowsStats = playersWithClubs
    .map((playerWithClub) => {
      const clubInfo = playerWithClub.club
        ? playerWithClub.club
        : { id: 0, name: "-" }; // Sjekk om klubbinformasjonen er tilgjengelig
      const yellows =
        yellowStats.find((stat) => stat.player.id === playerWithClub.id)
          ?.yellows ?? 0;
      return {
        id: playerWithClub.id,
        firstName: playerWithClub.firstName,
        lastName: playerWithClub.lastName ?? "",
        clubName: clubInfo.name ?? "",
        yellows,
      };
    })
    .sort((a, b) => b.yellows - a.yellows) // Sorter spillere etter antall gule kort i synkende rekkefølge
    .slice(0, 10); // Begrens listen til maksimalt 10 spillere

      // Hent gule kort
  const redStats = await getRedStats();

  // Kombiner spillernavn, klubbinformasjon og målstatistikk
  const redsStats = playersWithClubs
    .map((playerWithClub) => {
      const clubInfo = playerWithClub.club
        ? playerWithClub.club
        : { id: 0, name: "-" }; // Sjekk om klubbinformasjonen er tilgjengelig
      const reds =
        redStats.find((stat) => stat.player.id === playerWithClub.id)
          ?.reds ?? 0;
      return {
        id: playerWithClub.id,
        firstName: playerWithClub.firstName,
        lastName: playerWithClub.lastName ?? "",
        clubName: clubInfo.name ?? "",
        reds,
      };
    })
    .sort((a, b) => b.reds - a.reds) // Sorter spillere etter antall gule kort i synkende rekkefølge
    .slice(0, 10); // Begrens listen til maksimalt 10 spillere

  return (
    <div className="flex flex-col items-center my-20">
      <div className="bg-primary rounded-xl text-center p-3 text-white mb-4">
        <GoalTable tableData={combinedStats} name="Toppscorer" />
      </div>
      <div className="bg-primary rounded-xl text-center p-3 text-white mb-4">
        <YellowTable tableData={yellowsStats} name="Gule Kort" />
      </div>
      <div className="bg-primary rounded-xl text-center p-3 text-white mb-4">
        <RedTable tableData={redsStats} name="Røde Kort" />
      </div>
    </div>
  );
};

export default DivisionPage;
