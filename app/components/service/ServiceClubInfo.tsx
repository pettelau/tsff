import { getClubInfo } from "@/data/getClubInfo";
import { useCurrentUser } from "@/hooks/use-current-user";

type ServiceClubInfoProps = {
  clubId: number | null;
};
export const ServiceClubInfo = async ({
  clubId: clubId,
}: ServiceClubInfoProps) => {
  if (clubId === null) {
    return "Ingen klubb er tilknyttet denne servicebrukeren.";
  }

  const club = await getClubInfo(clubId)

  return (
    <div>
      <h1 className="h1">{club?.name}</h1>
    </div>
  )
};
