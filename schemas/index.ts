import * as z from "zod";
import { UserRole } from "@prisma/client";

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
    { message: "Passordene samvarer ikke", path: ["confirmPassword"] }
  );
