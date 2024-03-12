"use server";
import { db } from "@/lib/db";
import { NIFSchema } from "@/schemas";

import { z } from "zod";
import { revalidateTag } from "next/cache";
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const updateNIFData = async (data: z.infer<typeof NIFSchema>[]) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Du er ikke logget inn" };
  } else if (user.role !== UserRole.ADMIN) {
    return { error: "Du er ikke administrator" };
  }

  let rowsAdded = 0;
  let rowsUpdated = 0;
  try {
    for (const person of data) {
      const result = await db.player.upsert({
        where: {
          nifId: person.personId,
        },
        create: {
          nifId: person.personId,
          firstName: person.fornavn,
          lastName: person.etternavn,
          hasPaidMembershipFee: person.kontigent,
        },
        update: {
          firstName: person.fornavn,
          lastName: person.etternavn,
          hasPaidMembershipFee: person.kontigent,
        },
      });
      if (result.createdAt.getTime() === result.updatedAt.getTime()) {
        rowsAdded++;
      } else {
        rowsUpdated++;
      }
    }
  } catch (error) {
    return {
      error: `Noe gikk galt: ${error}`,
    };
  } finally {
    // Revalidate player tag when this exists in future
    // revalidateTag("collection");
  }
  return {
    success: "Spillerdatabasen ble oppdatert!",
    rowsAdded: rowsAdded,
    rowsUpdated: rowsUpdated,
  };
};
