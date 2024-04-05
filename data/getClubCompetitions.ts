import 'server-only';

import { Club, Competition, CompetitionParticipation } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { minutesToSeconds } from "date-fns";
import { CLUB_CACHE_TAG } from './getClubInfo';

export const getClubCompetitions = unstable_cache(
    async (clubId: number): Promise<Competition[]> => {
            const club = await db.club.findUnique({
                where: { id: clubId },
                include: {
                    competitionParticipation: {
                        include: {
                            competition: true,
                        },
                    },
                },
            });

            if (!club) {
                throw new Error("Club not found");
            }

            const competitions = club.competitionParticipation.map(
                (participation) => participation.competition
            );

            return competitions;
    },
    undefined,
    {
        revalidate: minutesToSeconds(120),
        tags: [CLUB_CACHE_TAG],
    },
);
