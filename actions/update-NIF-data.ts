"use server";
import { db } from "@/lib/db";
import { NIFSchema } from "@/schemas";
import { parse } from "csv-parse";
import formidable, { errors as formidableErrors } from "formidable";

import { z } from "zod";
import { revalidateTag } from "next/cache";

export const updateNIFData = async (data: z.infer<typeof NIFSchema>[]) => {
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
