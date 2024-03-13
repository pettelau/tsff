import { cn, getResultColor } from "@/lib/utils";

import { CompetitionTeam } from "@/types/types";
import { Tooltip } from "@nextui-org/tooltip";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { CompetitionTableProps } from "@/app/components/Competition/CompetitionTable-small";

export const CompetitionTableFullWidth = async ({
  tableData,
  name,
}: CompetitionTableProps) => {
  return (
    <div>
      <h2 className="mb-2">{name}</h2>
      <table className="table-auto w-full font-light text-sm small-table-spacing xl:table-spacing">
        <thead>
          <tr>
            <th>#</th>
            <th>Lag</th>
            <th>S</th>
            <th className="table-cell">V</th>
            <th className="table-cell">U</th>
            <th className="table-cell">T</th>
            <th className="table-cell">MF</th>
            <th>+/-</th>
            <th>P</th>
            <th className="table-cell">Form</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((team, index) => {
            return (
              <tr key={team.teamId}>
                <td className="font-normal">{index + 1}.</td>
                <td className="text-left truncate max-w-20 xs:max-w-none">
                  {team.team}
                </td>
                <td>{team.matchesPlayed}</td>
                <td className="table-cell">{team.win}</td>
                <td className="table-cell">{team.draw}</td>
                <td className="table-cell">{team.lose}</td>
                <td className="table-cell">
                  {team.goalsScored}:{team.goalsConceded}
                </td>
                <td>{team.goalsScored - team.goalsConceded}</td>
                <td>{team.points}</td>
                <td className="table-cell">
                  <div className="flex flex-row space-x-1 items-center justify-center">
                    {team.formMatches.reverse().map((fm, index) => {
                      return (
                        <Tooltip
                          delay={0}
                          closeDelay={0}
                          key={fm.matchId}
                          content={
                            <div className="flex flex-col text-xs items-center justify-center ">
                              <div>
                                {fm.homeClubName} {fm.result} {fm.awayClubName}
                              </div>
                              {fm.kickoffTime !== null ? (
                                <div className="font-light">
                                  {format(
                                    new Date(fm.kickoffTime),
                                    "EE dd. MMM' 'HH:mm",
                                    {
                                      locale: nb,
                                    },
                                  )}
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          }
                        >
                          <div
                            className={`${
                              index > 2 && "hidden xs:block"
                            } w-3 h-3 rounded-sm ${
                              fm.outcome === "W"
                                ? "bg-green-400"
                                : fm.outcome === "D"
                                ? "bg-gray-400"
                                : "bg-red-400"
                            }`}
                          ></div>
                        </Tooltip>
                      );
                    })}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
