import { db } from "@/lib/db";
import {
  Venue,
  Position,
  MatchEventType,
  CompetitionType,
  SemesterType,
  Match,
  Club,
  Squad,
} from "@prisma/client";
import { addDays, subDays } from "date-fns";

async function resetIdSequences() {
  const tables = [
    "MatchEvent",
    "Match",
    "Player",
    "Club",
    "Competition",
    "CompetitionRound",
  ];
  await Promise.all(
    tables.map((table) =>
      db.$executeRawUnsafe(`ALTER SEQUENCE "${table}_id_seq" RESTART WITH 1;`),
    ),
  );
}

async function seed() {
  console.log("🌱 Seeding ...");

  // Clean up the database (excluding User and PasswordResetToken models)
  console.log("Cleaning DB ...");
  await db.matchEvent.deleteMany();
  await db.match.deleteMany();
  await db.player.deleteMany();
  await db.club.deleteMany();
  await db.competition.deleteMany();
  await db.competitionParticipation.deleteMany();
  await db.competitionRound.deleteMany();
  await db.notification.deleteMany();
  await db.userNotification.deleteMany();
  await db.squadPlayer.deleteMany();
  await db.squad.deleteMany();
  await resetIdSequences();

  console.log("Creating competitions ...");
  const competition1 = await db.competition.create({
    data: {
      type: CompetitionType.AVDELING_A,
      year: 2023,
      semester: SemesterType.AUTUMN,
    },
  });

  const competition2 = await db.competition.create({
    data: {
      type: CompetitionType.AVDELING_B,
      year: 2023,
      semester: SemesterType.AUTUMN,
    },
  });
  const competition3 = await db.competition.create({
    data: {
      type: CompetitionType.A_SLUTTSPILL,
      year: 2024,
      semester: SemesterType.SPRING,
    },
  });

  const teamNamesCompetition1 = [
    "TIHLDE Pythons",
    "Datakameratene FK",
    "Salt IF",
    "NTNUI Samba",
    "Knekken",
    "Erudio",
    "CAF",
    "HSK",
    "Omega Løkka",
    "Hybrida",
  ];
  const teamNamesCompetition2 = [
    "Pareto FK",
    "Steindølene FK 2",
    "Omega FK",
    "Janus FK",
    "Chemie FK",
    "Marin FK",
    "Smøreguttene",
    "Energi",
    "Hattfjelldal United",
    "Tim&Shænko",
    "Realkameratene",
  ];

  const teamNamesCompetition3 = [
    "Pareto FK",
    "Steindølene FK 2",
    "Omega FK",
    "TIHLDE Pythons",
    "Datakameratene FK",
    "Salt IF",
  ];

  // Function to add days to a date
  function addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  const getRandomGoals = () => Math.floor(Math.random() * 5);

  console.log("Creating clubs and competition participations...");

  // Create clubs and competition participations in parallel for efficiency
  const createdClubs: Club[] = [];
  const createdMatches: Match[] = [];
  const createdSquads: Squad[] = [];

  for (const name of teamNamesCompetition1.concat(teamNamesCompetition2)) {
    const club = await db.club.create({
      data: { name, coefficient: Math.floor(Math.random() * 15) + 85 },
    });
    createdClubs.push(club);
  }

  await Promise.all(
    teamNamesCompetition1.map((_, index) =>
      db.competitionParticipation.create({
        data: {
          clubId: createdClubs[index].id,
          competitionId: competition1.id,
        },
      }),
    ),
  );

  await Promise.all(
    teamNamesCompetition2.map((_, index) =>
      db.competitionParticipation.create({
        data: {
          clubId: createdClubs[index + teamNamesCompetition1.length].id,
          competitionId: competition2.id,
        },
      }),
    ),
  );

  await Promise.all(
    teamNamesCompetition3.map((_, index) =>
      db.competitionParticipation.create({
        data: {
          clubId:
            createdClubs &&
            // @ts-ignore
            createdClubs.find(
              (club) => club.name === teamNamesCompetition3[index],
            ).id,
          competitionId: competition3.id,
        },
      }),
    ),
  );

  // Assuming the IDs for the competitions are known or fetched
  const competitionIds = [competition1.id, competition2.id];

  console.log("Creating competition rounds and matches...");

  // Algorithm logic taken from: https://github.com/tournament-js/roundrobin

  await Promise.all(
    competitionIds.map(async (competitionId) => {
      const teamsInCompetition = await db.competitionParticipation.findMany({
        where: { competitionId },
        select: { clubId: true },
      });
      if (teamsInCompetition.length === 0) {
        return;
      }

      teamsInCompetition.sort((a, b) => a.clubId - b.clubId);

      let numTeams = teamsInCompetition.length;

      const hasDummy = numTeams % 2 !== 0;
      if (hasDummy) {
        teamsInCompetition.push({ clubId: -1 });
        numTeams += 1;
      }

      const totalRounds = numTeams - 1;

      const matchesPerRound = numTeams / 2;

      for (let round = 0; round < totalRounds; round++) {
        const compRound = await db.competitionRound.create({
          data: { round: round + 1, competitionId },
        });

        for (let match = 0; match < matchesPerRound; match++) {
          const homeTeamIndex = numTeams - 1 - match;

          let homeTeamId = teamsInCompetition[homeTeamIndex].clubId;
          let awayTeamId = teamsInCompetition[match].clubId;

          if (homeTeamId !== -1 && awayTeamId !== -1) {
            const isHome = match === 0 && round % 2 === 1;
            if (!isHome) {
              [homeTeamId, awayTeamId] = [awayTeamId, homeTeamId];
            }

            const createdMatch = await db.match.create({
              data: {
                competitionRoundId: compRound.id,
                kickoffTime: addDays(
                  new Date(`2023-09-02T${10 + match * 2}:00:00`),
                  round * 7,
                ),
                venue: [Venue.TEMPE_KUNSTGRESS, Venue.TEMPE_HOVEDBANE][
                  Math.floor(Math.random() * 2)
                ],
                homeClubId: homeTeamId,
                awayClubId: awayTeamId,
                homeGoals: getRandomGoals(),
                awayGoals: getRandomGoals(),
                responsibleRefereeClubId: teamsInCompetition.filter(
                  (team) =>
                    team.clubId !== homeTeamId &&
                    team.clubId !== awayTeamId &&
                    team.clubId !== -1,
                )[Math.floor(Math.random() * (teamsInCompetition.length - 3))]
                  .clubId,
              },
            });

            const homeSquad = await db.squad.create({
              data: {
                matchId: createdMatch.id,
                clubId: homeTeamId,
              },
            });
            const awaySquad = await db.squad.create({
              data: {
                matchId: createdMatch.id,
                clubId: awayTeamId,
              },
            });
            createdSquads.push(homeSquad, awaySquad);
            createdMatches.push(createdMatch);
          }
        }
        const lastTeam = teamsInCompetition.pop();
        if (lastTeam) teamsInCompetition.splice(1, 0, lastTeam);
      }
    }),
  );

  console.log("Creating play off games ...");

  const compRound = await db.competitionRound.create({
    data: { round: 1, competitionId: competition3.id },
  });

  await db.match.create({
    data: {
      competitionRoundId: compRound.id,
      kickoffTime: new Date(
        Math.round(addDays(new Date(), 7).getTime() / (1000 * 60 * 60)) *
          (1000 * 60 * 60),
      ),
      venue: [Venue.TEMPE_KUNSTGRESS, Venue.TEMPE_HOVEDBANE][
        Math.floor(Math.random() * 2)
      ],
      homeClubId: 1,
      awayClubId: 2,
      responsibleRefereeClubId: 3,
    },
  });

  await db.match.create({
    data: {
      competitionRoundId: compRound.id,
      kickoffTime: new Date(
        Math.round(addDays(new Date(), 18).getTime() / (1000 * 60 * 60)) *
          (1000 * 60 * 60),
      ),
      venue: [Venue.TEMPE_KUNSTGRESS, Venue.TEMPE_HOVEDBANE][
        Math.floor(Math.random() * 2)
      ],
      homeClubId: 3,
      awayClubId: 1,
      responsibleRefereeClubId: 7,
    },
  });

  console.log("Creating players ...");
  const player1 = await db.player.create({
    data: {
      firstName: "Ola",
      lastName: "Nordmann",
      email: "ola@nordmann.no",
      position: Position.MIDTFIELDER,
      isActive: true,
      clubId: createdClubs[0].id,
    },
  });

  const player2 = await db.player.create({
    data: {
      firstName: "Nils",
      lastName: "Larsen",
      email: "nils@larsen.no",
      position: Position.STRIKER,
      clubId: createdClubs[1].id,
    },
  });
  const player3 = await db.player.create({
    data: {
      firstName: "Per",
      lastName: "Knutsen",
      email: "per@knutsen.no",
      position: Position.BACK,
      clubId: createdClubs[2].id,
    },
  });

  // Player without club
  const player4 = await db.player.create({
    data: {
      firstName: "Olav",
      lastName: "Jensen",
      email: "per@knutsen.no",
      position: Position.BACK,
      isActive: true,
    },
  });

  const sqPlayer1 = await db.squadPlayer.create({
    data: {
      playerId: player1.id,
      squadId: createdSquads[0].id,
    },
  });

  const sqPlayer2 = await db.squadPlayer.create({
    data: {
      playerId: player2.id,
      squadId: createdSquads[1].id,
    },
  });

  const sqPlayer3 = await db.squadPlayer.create({
    data: {
      playerId: player3.id,
      squadId: createdSquads[1].id,
    },
  });

  console.log("Creating Match events ...");
  await db.matchEvent.create({
    data: {
      type: MatchEventType.GOAL,
      squadPlayerId: sqPlayer1.id,
    },
  });
  await db.matchEvent.create({
    data: {
      type: MatchEventType.RED_CARD,
      squadPlayerId: sqPlayer2.id,
    },
  });
  await db.matchEvent.create({
    data: {
      type: MatchEventType.YELLOW_CARD,
      squadPlayerId: sqPlayer2.id,
    },
  });
  await db.matchEvent.create({
    data: {
      type: MatchEventType.YELLOW_CARD,
      squadPlayerId: sqPlayer3.id,
    },
  });

  console.log(`🌱 Database has been seeded`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
