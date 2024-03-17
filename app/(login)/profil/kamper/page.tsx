import { ClubMatches } from "@/app/components/matches/ClubMatches";
import { FinishedMatch } from "@/app/components/matches/finished-match";
import { ServiceContactInfo } from "@/app/components/service/ServiceContactInfo";
import { ExtendedMatch, getClubMatches } from "@/data/getClubMatches";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

const PlayedGamesPage = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect("/auth/login");
  } else if (!user.club) {
    return redirect("/profil");
  }

  return (
    <div>
      <ClubMatches clubId={user.club} />
    </div>
  );
};

export default PlayedGamesPage;
