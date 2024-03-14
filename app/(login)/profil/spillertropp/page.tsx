import { PlayersAccordion } from "@/app/components/players/players-accordion";
import { getClubPlayers } from "@/data/getClubPlayers";
import { currentUser } from "@/lib/auth";
import { Card } from "@nextui-org/card";
import { redirect } from "next/navigation";

const ClubSquadPage = async () => {
  const user = await currentUser();
  if (!user) {
    return redirect("/auth/login");
  } else if (!user.club) {
    return redirect("/profil");
  }
  const players = await getClubPlayers(user.club);

  return (
    <div className="space-y-2">
      <PlayersAccordion players={players} />
    </div>
  );
};

export default ClubSquadPage;
