import { readUserNotifications } from "@/actions/readUserNotifications";
import { StandaloneAccordion } from "@/app/components/StandaloneAccordion";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { IoNotifications } from "react-icons/io5";

const NotificationsPage = async () => {
  const user = await currentUser();
  if (!user) {
    return redirect("/auth/login");
  } else if (!user.club || !user.id) {
    return redirect("/profil");
  }

  const notifications = await db.userNotification.findMany({
    where: {
      userId: user.id,
    },
    include: {
      notification: {
        include: {
          creator: {
            select: {
              username: true,
              role: true,
            },
          },
        },
      },
    },
    orderBy: {
      notification: {
        createdAt: "desc",
      },
    },
  });

  readUserNotifications(user.id);

  return (
    <div className="flex flex-col space-y-4">
      {notifications.map((notification) => (
        <StandaloneAccordion
          primary={notification.notification.title}
          secondary={`Fra: ${notification.notification.creator.username} ${
            notification.notification.creator.role === UserRole.ADMIN &&
            " (TSFF Admin)"
          }`}
          icon={<IoNotifications />}
        >
          <>{notification.notification.infoText}</>
        </StandaloneAccordion>
      ))}
    </div>
  );
};

export default NotificationsPage;
