import { serviceMenuTabs } from "@/lib/menu-values";
import { Dispatch, SetStateAction } from "react";

type ServiceMenuProps = {
  setSelectedMenu: Dispatch<SetStateAction<string>>;
};
export const ServiceMenu = ({ setSelectedMenu }: ServiceMenuProps) => {
  return (
    <div className="sm:flex sm:flex-col">
      <div className="grid grid-cols-2 sm:grid-cols-1">
        {serviceMenuTabs.map((menuItem) => {
          return (
            <div
              onClick={() => setSelectedMenu(menuItem.name)}
              key={menuItem.name}
              className="flex flex-row items-center space-x-2 px-4 py-2 sm:p-3 cursor-pointer hover:bg-gray-300 hover:rounded-lg"
            >
              <div>{menuItem.icon}</div>
              <div>{menuItem.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
