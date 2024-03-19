import * as z from "zod";
import { GenderType, UserRole } from "@prisma/client";
import { translateGender } from "@/lib/utils";

export const LoginSchema = z.object({
  email: z.string().min(1, { message: "E-post my fylles ut" }).email({
    message: "Ugyldig e-postadresse",
  }),
  password: z.string().min(1, {
    message: "Passord kreves",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z
  .object({
    email: z.string().min(1, { message: "E-post må fylles ut" }).email({
      message: "Ugyldig e-postadresse",
    }),
    password: z.string().min(6, {
      message: "Minimum 6 tegn",
    }),
    confirmPassword: z.string().min(6, {
      message: "Minimum 6 tegn",
    }),
    username: z.string().min(1, {
      message: "Brukernavn kreves",
    }),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    { message: "Passordene samvarer ikke", path: ["confirmPassword"] },
  );

export const UpdateOwnProfileSchema = z.object({
  username: z.string().min(3, "Et brukernavn på minst tre tegn er påkrevd"),
  role: z.enum([UserRole.ADMIN, UserRole.USER], {
    errorMap: () => ({ message: "Ugyldig brukerrolle" }),
  }),
});

export const NIFSchema = z.object({
  PersonId: z.string().transform(Number),
  Fornavn: z.string(),
  Etternavn: z.string(),
  Fødselsdato: z.string().transform((dateStr) => {
    // Assuming the date format is "DD.MM.YYYY"
    const [day, month, year] = dateStr.split(".");
    return new Date(`${year}-${month}-${day}`);
  }),
  Kjønn: z.string().transform(translateGender),
  // Epost: z.string().email(),
  // kontigent: z.string().transform((value) => value === "true" || value === "True"),
});

const recipientIdsSchema = z.preprocess((arg) => {
  if (arg instanceof Set) {
    return Array.from(arg);
  }
  return [];
}, z.array(z.string()));

export const NewNotificationSchema = z.object({
  title: z.string().min(1, { message: "Beskjeden må ha en tittel" }),
  infoText: z.string().min(1, { message: "Beskjeden må ha en tekst" }),
  recipientIds: recipientIdsSchema,
});
