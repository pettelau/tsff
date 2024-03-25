import { GoalTable } from "@/app/components/stats/goalTable";
import { YellowTable } from "@/app/components/stats/yellowTable";
import { RedTable } from "@/app/components/stats/redTable";
import { getGoalStats } from "@/data/getGoalStats";
import { getYellowStats } from "@/data/getYellowStats";
import { getRedStats } from "@/data/getRedStats";
import { getPlayersWithClubs } from "@/data/getPlayersWithClubs";

const StatsPage = async () => {
  // Henter spillernavn og klubbinformasjon
  const playersWithClubs = await getPlayersWithClubs();
  // Henter målstatistikk
  const playerStats = await getGoalStats();

  const goalStats = playersWithClubs
    .map((playerWithClub) => {
      const clubInfo = playerWithClub.club
        ? playerWithClub.club
        : { id: 0, name: "-" };
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
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 10);

  // Henter gule kort
  const yellowStats = await getYellowStats();

  const yellowsStats = playersWithClubs
    .map((playerWithClub) => {
      const clubInfo = playerWithClub.club
        ? playerWithClub.club
        : { id: 0, name: "-" };
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
    .sort((a, b) => b.yellows - a.yellows) 
    .slice(0, 10);

  // Henter røde kort
  const redStats = await getRedStats();

  const redsStats = playersWithClubs
    .map((playerWithClub) => {
      const clubInfo = playerWithClub.club
        ? playerWithClub.club
        : { id: 0, name: "-" };
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
    .sort((a, b) => b.reds - a.reds)
    .slice(0, 10);

  return (
    <div className="flex flex-col items-center my-20">
      <div className="bg-primary rounded-xl text-center p-3 text-white mb-4">
        <GoalTable tableData={goalStats} name="Toppscorer" />
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

export default StatsPage;
