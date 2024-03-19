"use client";
import { serviceMenuTabs } from "@/lib/menu-values";
import { usePathname, useRouter } from "next/navigation";

import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useEffect, useState } from "react";

type ServiceMenuProps = {
  numUnreadNotifications: number;
};

export const ServiceMenu = ({
  numUnreadNotifications: numUnreadNotifications,
}: ServiceMenuProps) => {
  const [numUnread, setNumUnread] = useState<number>(numUnreadNotifications);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/profil/beskjeder") {
      setNumUnread(0);
    }
  }, [pathname]);

  const user = useCurrentUser();
  return (
    <div className="sm:flex sm:flex-col">
      <div className="grid grid-cols-2 sm:grid-cols-1">
        {serviceMenuTabs.map((menuItem) => {
          if (user && typeof user.club !== "number" && menuItem.hideIfNoClub) {
            return;
          }
          return (
            <Link
              href={menuItem.href}
              key={menuItem.name}
              className={`flex flex-row items-center space-x-2 px-4 py-2 sm:p-3 cursor-pointer hover:bg-gray-300 ${
                pathname === menuItem.href && "bg-gray-400 rounded-lg"
              } hover:rounded-lg`}
            >
              <div>{menuItem.icon}</div>
              <div
                className={
                  numUnread > 0 && menuItem.name === "Beskjeder"
                    ? "font-bold"
                    : ""
                }
              >
                {menuItem.name}{" "}
                {numUnread > 0 &&
                  menuItem.name === "Beskjeder" &&
                  ` (${numUnreadNotifications})`}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
