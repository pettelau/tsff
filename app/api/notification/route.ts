import { NOTIFICATIONS_CACHE_TAG } from "@/data/getNotifications";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NewNotificationSchema } from "@/schemas";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const { data } = await request.json();

  const user = await currentUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notification = await db.$transaction(async (prisma) => {
    const notification = await prisma.notification.create({
      data: {
        title: data.title,
        infoText: data.infoText,
        creatorId: data.creator,
      },
    });

    const userNotifications = await Promise.all(
      data.recipientIds.map((userId: string) =>
        prisma.userNotification.create({
          data: {
            userId,
            notificationId: notification.id,
          },
        }),
      ),
    );

    return { notification, userNotifications };
  });

  revalidateTag(NOTIFICATIONS_CACHE_TAG);
  return Response.json(notification);
};
