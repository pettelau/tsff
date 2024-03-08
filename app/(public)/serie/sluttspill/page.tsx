import { getCurrentSeason, getCurrentSemesterType } from "@/lib/utils";
import { SemesterType } from "@prisma/client";

const PlayOffs = () => {
  return (
    <div className="flex justify-center items-center my-20">
      Sluttspill {getCurrentSeason()}{" "}
      {getCurrentSemesterType() === SemesterType.AUTUMN && `- "As it Stands"`}
    </div>
  );
};

export default PlayOffs;
