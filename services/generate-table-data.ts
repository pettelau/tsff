import { CompetitionTeam, MatchWithTeams } from "@/types/types";
import { Club } from "@prisma/client";

export const generateTable = (matches: MatchWithTeams[], clubs: Club[]) => {
  const teams: CompetitionTeam[] = [];

  matches
    .sort((a, b) => {
      const timeA =
        a.kickoffTime !== null
          ? new Date(a.kickoffTime).getTime()
          : Number.MAX_SAFE_INTEGER;
      const timeB =
        b.kickoffTime !== null
          ? new Date(b.kickoffTime).getTime()
          : Number.MAX_SAFE_INTEGER;
      return timeA - timeB;
    })
    .forEach((match) => {
      const updateTeamStats = (
        teamId: number,
        name: string,
        goalsFor: number,
        goalsAgainst: number,
        isHomeTeam: boolean,
      ) => {
        let team = teams.find((t) => t.teamId === teamId);

        const won = goalsFor > goalsAgainst;
        const lost = goalsFor < goalsAgainst;
        const drawn = goalsFor === goalsAgainst;
        const outcome = won ? "W" : lost ? "L" : "D";

        if (!team) {
          team = {
            team: clubs.find((c) => c.id == teamId)?.name ?? `Team ${teamId}`,
            teamId,
            matchesPlayed: 0,
            points: 0,
            win: 0,
            draw: 0,
            lose: 0,
            goalsScored: 0,
            goalsConceded: 0,
            formMatches: [],
          };
          teams.push(team);
        }

        team.matchesPlayed += 1;
        team.goalsScored += goalsFor;
        team.goalsConceded += goalsAgainst;
        if (won) {
          team.win += 1;
          team.points += 3;
        }
        if (lost) team.lose += 1;
        if (drawn) {
          team.draw += 1;
          team.points += 1;
        }

        team.formMatches.push({
          matchId: match.id,
          homeClubId: match.homeClubId,
          awayClubId: match.awayClubId,
          homeClubName:
            clubs.find((c) => c.id == match.homeClubId)?.name ??
            `Club ${match.awayClubId}`,
          awayClubName:
            clubs.find((c) => c.id == match.awayClubId)?.name ??
            `Club ${match.awayClubId}`,
          outcome,
          result: `${isHomeTeam ? goalsFor : goalsAgainst} - ${
            isHomeTeam ? goalsAgainst : goalsFor
          }`,
          kickoffTime: match.kickoffTime,
        });
        if (team.formMatches.length > 5) team.formMatches.shift();
      };

      updateTeamStats(
        match.homeTeam.id,
        match.homeTeam.name,
        match.homeGoals ?? 0,
        match.awayGoals ?? 0,
        true,
      );
      updateTeamStats(
        match.awayTeam.id,
        match.awayTeam.name,
        match.awayGoals ?? 0,
        match.homeGoals ?? 0,
        false,
      );
    });

  const sortedTeams = teams.sort((a, b) => {
    if (a.points !== b.points) {
      return b.points - a.points;
    }

    const goalDiffA = a.goalsScored - a.goalsConceded;
    const goalDiffB = b.goalsScored - b.goalsConceded;
    if (goalDiffA !== goalDiffB) {
      return goalDiffB - goalDiffA;
    }

    if (a.goalsScored !== b.goalsScored) {
      return b.goalsScored - a.goalsScored;
    }
    return 0;
  });

  return sortedTeams;
};
