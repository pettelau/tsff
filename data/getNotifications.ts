import { User } from "@prisma/client";
import { minutesToSeconds } from "date-fns";
import { unstable_cache } from "next/cache";

export const NOTIFICATIONS_CACHE_TAG = "notifications";

export const getNotifications = unstable_cache(
  async (onlyUnread: boolean = false, userId?: User["id"]) => {},
  undefined,
  {
    revalidate: minutesToSeconds(120),
    tags: [NOTIFICATIONS_CACHE_TAG],
  },
);
