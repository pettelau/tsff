import { cn, getResultColor } from "@/lib/utils";

import { PlayerYellow } from "@/types/types";

export type YellowTableProps = {
  tableData: PlayerYellow[];
  name: string;
};
export const YellowTable = async ({
    tableData,
    name,
  }: YellowTableProps) => {
    return (
      <div>
        <h2 className="mb-2">{name}</h2>
        <table className="table-auto w-full font-light text-sm small-table-spacing xl:table-spacing">
          <thead>
            <tr>
              <th>Navn</th>
              <th>Lag</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((player, index) => {
              return (
                <tr key={player.id}>
                  <td>{player.firstName + ' ' + player.lastName}</td>
                  <td className="hidden xmd:table-cell">{player.clubName}</td>
                  <td className="hidden xmd:table-cell">{player.yellows}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };
  