import { db } from "@/lib/db";
import {
  Venue,
  Position,
  MatchEventType,
  CompetitionType,
} from "@prisma/client";
import { addDays, subDays } from "date-fns";

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

  console.log("Creating clubs ...");
  const club1 = await db.club.create({
    data: {
      name: "TIHLDE Pythons",
      instagram: "tihlde_pythons",
      coefficient: 100,
    },
  });

  const club2 = await db.club.create({
    data: {
      name: "Datakameratene FK",
      coefficient: 95,
    },
  });

  const club3 = await db.club.create({
    data: {
      name: "Pareto FK",
      coefficient: 85,
    },
  });
  const club4 = await db.club.create({
    data: {
      name: "Steindølene FK",
      coefficient: 90,
    },
  });

  console.log("Creating competitions ...");
  const competition1 = await db.competition.create({
    data: {
      type: CompetitionType.AVDELING_A,
      year: 2023,
    },
  });

  const competition2 = await db.competition.create({
    data: {
      type: CompetitionType.AVDELING_B,
      year: 2023,
    },
  });

  console.log("Creating competition participations ...");
  await db.competitionParticipation.create({
    data: {
      clubId: club1.id,
      competitionId: competition1.id,
    },
  });

  await db.competitionParticipation.create({
    data: {
      clubId: club2.id,
      competitionId: competition1.id,
    },
  });

  await db.competitionParticipation.create({
    data: {
      clubId: club3.id,
      competitionId: competition2.id,
    },
  });

  await db.competitionParticipation.create({
    data: {
      clubId: club4.id,
      competitionId: competition2.id,
    },
  });

  console.log("Creating competition rounds ...");
  const competitionRound1 = await db.competitionRound.create({
    data: {
      round: 1,
      competitionId: competition1.id,
    },
  });

  const competitionRound2 = await db.competitionRound.create({
    data: {
      round: 1,
      competitionId: competition2.id,
    },
  });

  console.log("Creating matches ...");
  const match1 = await db.match.create({
    data: {
      kickoffTime: addDays(new Date(), 1),
      competitionRoundId: competitionRound1.id,
      venue: Venue.TEMPE_KUNSTGRESS,
      homeClubId: club1.id,
      awayClubId: club2.id,
      responsibleRefereeClubId: club3.id,
    },
  });

  const match2 = await db.match.create({
    data: {
      kickoffTime: subDays(new Date(), 4),
      competitionRoundId: competitionRound2.id,
      venue: Venue.TEMPE_HOVEDBANE,
      homeClubId: club3.id,
      awayClubId: club4.id,
      homeGoals: 3,
      awayGoals: 0,
      isMatchEventsConfirmed: true,
      responsibleRefereeClubId: club2.id,
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
      clubId: club1.id,
    },
  });

  const player2 = await db.player.create({
    data: {
      firstName: "Nils",
      lastName: "Larsen",
      email: "nils@larsen.no",
      position: Position.STRIKER,
      clubId: club2.id,
    },
  });
  const player3 = await db.player.create({
    data: {
      firstName: "Per",
      lastName: "Knutsen",
      email: "per@knutsen.no",
      position: Position.BACK,
      clubId: club3.id,
    },
  });

  // Player without club
  const player4 = await db.player.create({
    data: {
      firstName: "Per",
      lastName: "Knutsen",
      email: "per@knutsen.no",
      position: Position.BACK,
      isActive: true,
    },
  });

  console.log("Creating Match events ...");
  await db.matchEvent.create({
    data: {
      type: MatchEventType.GOAL,
      matchId: match1.id,
      playerId: player1.id,
    },
  });
  await db.matchEvent.create({
    data: {
      type: MatchEventType.RED_CARD,
      matchId: match1.id,
      playerId: player2.id,
    },
  });
  await db.matchEvent.create({
    data: {
      type: MatchEventType.YELLOW_CARD,
      matchId: match2.id,
      playerId: player3.id,
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
