import { MatchEventType } from "@prisma/client";
import {
  PlayerMatchEventStats,
  getMatchEventStats,
} from "@/data/getMatchEventStats";
import { StatsTable } from "@/app/components/stats/StatsTable";
import { matchEventTypesList } from "@/lib/enum-mappings";

// All stats
const StatsPage = async () => {

  const statsData = await Promise.all(
    matchEventTypesList.map(async ({ type }) => {
      const eventType = type as MatchEventType;
      const eventData = await getMatchEventStats(eventType);
      return { tableData: eventData, eventType: eventType };
    }),
  );

  return (
    <div className="flex flex-col px-4 sm:px-6 justify-center items-center space-y-4">
      {statsData.map(
        (
          {
            tableData,
            eventType,
          }: {
            tableData: PlayerMatchEventStats[];
            eventType: MatchEventType;
          },
          index: number,
        ) => (
          <StatsTable key={index} tableData={tableData} event={eventType} />
        ),
      )}
    </div>
  );
};

export default StatsPage;
