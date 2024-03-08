import { CompetitionTabs } from "@/app/components/Competition/CompetitionTabs";

type CompetitionLayoutProps = {
  children: React.ReactNode;

};

const CompetitionLayout = ({ children }: CompetitionLayoutProps) => {
  return (
    <div className="flex flex-row items-stretch justify-center flex-grow max-w-screen-2xl">
      <div className="flex flex-col w-2/3">
        <div className="flex items-center justify-center"><CompetitionTabs /></div>
        {children}
      </div>
      <div className="w-1/3 flex-col items-center justify-center hidden sm:flex">
        <div className="h-[500px]">AVDELING A TABELL</div>
        <div className="h-[500px]">AVDELING B TABELL</div>
      </div>
    </div>
  );
};

export default CompetitionLayout;
