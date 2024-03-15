import { AddPlayersModal } from "@/app/components/players/add-players-modal";
import { PlayersAccordion } from "@/app/components/players/players-accordion";
import { getClubNames } from "@/data/getClubNames";
import { getClubPlayers } from "@/data/getClubPlayers";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

const ClubSquadPage = async () => {
  const user = await currentUser();
  if (!user) {
    return redirect("/auth/login");
  } else if (!user.club) {
    return redirect("/profil");
  }
  const players = await getClubPlayers(user.club);

  const clubs = await getClubNames()

  return (
    <>
      <div className="flex flex-row justify-between items-center mb-4">
        <div>
          <h2 className="h2 m-0">Spillertropp</h2>
        </div>
        <div>
          <AddPlayersModal clubId={user.club} clubs={clubs}/>
        </div>
      </div>
      <div>
        <PlayersAccordion players={players} />
      </div>
    </>
  );
};

export default ClubSquadPage;
