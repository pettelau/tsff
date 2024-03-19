"use server";

import { NOTIFICATIONS_CACHE_TAG } from "@/data/getNotifications";
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";

export const readUserNotifications = async (userId: string) => {
  await db.userNotification.updateMany({
    where: {
      userId: userId,
    },
    data: {
      isRead: true,
    },
  });
  revalidateTag(NOTIFICATIONS_CACHE_TAG);
};
