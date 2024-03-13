"use client";
import { serviceMenuTabs } from "@/lib/menu-values";
import { usePathname, useRouter } from "next/navigation";

import Link from "next/link";

export const ServiceMenu = () => {
  const pathname = usePathname();
  return (
    <div className="sm:flex sm:flex-col">
      <div className="grid grid-cols-2 sm:grid-cols-1">
        {serviceMenuTabs.map((menuItem) => {
          return (
            <Link
              href={menuItem.href}
              key={menuItem.name}
              className={`flex flex-row items-center space-x-2 px-4 py-2 sm:p-3 cursor-pointer hover:bg-gray-300 ${
                pathname === menuItem.href && "bg-gray-400 rounded-lg"
              } hover:rounded-lg`}
            >
              <div>{menuItem.icon}</div>
              <div>{menuItem.name}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
