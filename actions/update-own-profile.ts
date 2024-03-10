"use server";

import { update } from "@/auth";
import { getUserById, getUserByUsername } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UpdateOwnProfileSchema } from "@/schemas";
import * as z from "zod";

export const updateOwnProfile = async (
  values: z.infer<typeof UpdateOwnProfileSchema>,
) => {
  const validatedFields = UpdateOwnProfileSchema.safeParse(values);


  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  if (!user.id) {
    return { error: "Missing credentials" };
  }
  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (values.username) {
    const existingUser = await getUserByUsername(values.username);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "You are trying to update another user's credentials!" };
    }

    const updatedUser = await db.user.update({
      where: { id: dbUser.id },
      data: {
        ...values,
      },
    });

    update({
      user: {
        username: updatedUser.username,
        role: updatedUser.role,
      },
    });
  }
  return { success: "Brukerprofil oppdatert!" };
};
