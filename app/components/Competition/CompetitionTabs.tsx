"use client";
import { competitionMenuTabs } from "@/lib/menu-values";
import { cn } from "@/lib/utils";
import { Tab, Tabs } from "@nextui-org/tabs";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export const CompetitionTabs = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);
  const router = useRouter();

  const handleTabChange = (newTab: React.Key) => {
    setActiveTab(newTab.toString());
    router.push(newTab.toString());
  };

  return (
    <div>
      <Tabs
        className="h-[80px] space-x-4"
        selectedKey={activeTab}
        onSelectionChange={handleTabChange}
      >
        {competitionMenuTabs.map((tab) => {
          return (
            <Tab
              className={cn(
                "h-[80px] w-[120px]",
                tab.href === "/serie/tabeller" && "sm:hidden",
              )}
              key={tab.href}
              title={
                <div className="flex flex-col items-center justify-center">
                  <div className="text-[40px]">{tab.icon}</div>
                  <div>{tab.name}</div>
                </div>
              }
            />
          );
        })}
      </Tabs>
    </div>
  );
};
