"use client";

import { NotLoggedIn } from "@/app/components/Defaults/not-logged-in";
import { ServiceMenu } from "@/app/components/service/service-menu";
import { serviceMenuRenderer } from "@/app/components/service/service-menu-renderer";
import { useCurrentUser } from "@/hooks/use-current-user";
import { currentUser } from "@/lib/auth";
import { serviceMenuTabs } from "@/lib/menu-values";
import { ServiceMenuT } from "@/types/types";
import { redirect } from "next/navigation";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
}

const ProfileLayout = ({ children }: Props) => {
  const user = useCurrentUser();

  const [selectedMenu, setSelectedMenu] = useState<ServiceMenuT["name"]>(
    serviceMenuTabs[0].name,
  );

  if (!user) {
    return redirect("/auth/login");
  } else {
    return (
      <>
        <div className="flex flex-col max-w-screen-xl space-y-4 mx-6 w-full">
          <div className="w-full bg-red-300 rounded-lg text-center py-4">
            TOP LEVEL INFO
          </div>

          <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-4 space-y-4 sm:space-y-0 w-full">
            <div className="w-full sm:w-1/4 xl:w-1/5 bg-blue-300 rounded-lg">
              <ServiceMenu setSelectedMenu={setSelectedMenu} />
            </div>

            <div className="w-full sm:w-3/4 xl:w-4/5 bg-green-300">
              {serviceMenuRenderer(selectedMenu)}
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default ProfileLayout;
