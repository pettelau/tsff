import { NotLoggedIn } from "@/app/components/Defaults/not-logged-in";
import { ServiceClubInfo } from "@/app/components/service/ServiceClubInfo";
import { ServiceMenu } from "@/app/components/service/service-menu";
import { serviceMenuRenderer } from "@/app/components/service/service-menu-renderer";
import { useCurrentUser } from "@/hooks/use-current-user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { serviceMenuTabs } from "@/lib/menu-values";
import { ServiceMenuT } from "@/types/types";
import { redirect } from "next/navigation";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
}

const ProfileLayout = async ({ children }: Props) => {
  const user = await currentUser();

  const numUnreadNotifications = await db.userNotification.count({
    where: {
      userId: user?.id,
      isRead: false,
    },
  });

  if (!user) {
    return redirect("/auth/login");
  } else {
    return (
      <>
        <div className="flex flex-col max-w-screen-xl space-y-4 mx-1 sm:mx-6 w-full">
          <div className="w-full bg-purple-400 rounded-lg text-center py-4">
            <ServiceClubInfo clubId={user.club} />
          </div>

          <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-4 space-y-4 sm:space-y-0 w-full">
            <div className="h-fit w-full sm:w-1/4 xl:w-1/5 bg-primary rounded-lg">
              <ServiceMenu numUnreadNotifications={numUnreadNotifications} />
            </div>

            <div className="w-full sm:w-3/4 xl:w-4/5 ">{children}</div>
          </div>
        </div>
      </>
    );
  }
};

export default ProfileLayout;
