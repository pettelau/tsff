import { CompetitionTable } from "@/app/components/Competition/CompetitionTable";
import { CompetitionTabs } from "@/app/components/Competition/CompetitionTabs";
import { getActiveCompetitions } from "@/data/getActiveCompetitions";

type CompetitionLayoutProps = {
  children: React.ReactNode;
};

const CompetitionLayout = async ({ children }: CompetitionLayoutProps) => {
  const activeCompetitions = await getActiveCompetitions();
  return (
    <div className="flex flex-row items-stretch justify-center flex-grow max-w-screen-2xl mx-6">
      <div className="flex flex-col w-2/3">
        <div className="flex items-center justify-center">
          <CompetitionTabs />
        </div>
        {children}
      </div>
      <div className="w-1/3 flex-col items-center justify-center hidden sm:flex space-y-2">
        {activeCompetitions.map((comp) => {
          return (
            <div
              key={comp.id}
              className="w-full bg-primary rounded-xl text-center p-3 text-white"
            >
              <CompetitionTable competitionId={comp.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompetitionLayout;
