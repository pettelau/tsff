import { PlayerMatchEventStats } from "@/data/getMatchEventStats";
import { matchEventTypesMap } from "@/lib/enum-mappings";
import { PlayerStats } from "@/types/types";
import { MatchEventType } from "@prisma/client";

export type StatsTableProps = {
  tableData: PlayerMatchEventStats[];
  event: MatchEventType;
};

export const StatsTable = async ({ tableData, event }: StatsTableProps) => {
  return (
    <div className="max-w-md w-full bg-primary rounded-xl text-center p-3 text-white">
      <h2 className="mb-2">{matchEventTypesMap[event].statLabel}</h2>
      <table className="table-fixed w-full font-light text-sm small-table-spacing xl:table-spacing">
        <thead>
          <tr>
            <th className="w-1/12">#</th>
            <th className="text-left w-5/12">Spiller</th>
            <th className="text-left w-5/12">Lag</th>
            <th className="w-1/12">
              <div className="flex justify-center items-center">{matchEventTypesMap[event].icon}</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((playerData, index) => {
            return (
              <tr key={playerData.player.id}>
                <td>{index + 1}.</td>
                <td className="text-left w-5/12 truncate">
                  {playerData.player.firstName +
                    " " +
                    playerData.player.lastName}
                </td>
                <td className="text-left w-1/2 truncate">
                  {playerData.player.club?.name}
                </td>
                <td>{playerData.count}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
