"use client";

import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterSchema } from "@/schemas";
import { login } from "@/actions/login";

import { Input, Button } from "@nextui-org/react";
import { AuthCardWrapper } from "@/app/components/auth/AuthCardWrapper";
import { register } from "@/actions/register";

export const RegisterForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const { control, handleSubmit, reset } = useForm<
    z.infer<typeof RegisterSchema>
  >({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <AuthCardWrapper
      headerLabel="Registrer bruker"
      backButtonLabel="Har du allerede en bruker?"
      backButtonHref="/auth/login"
      showSocial
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="m-auto flex flex-col w-full gap-2 pt-2 md:grid-cols-2"
      >
        <div className="space-y-6">
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Input
                variant="bordered"
                fullWidth
                isDisabled={isPending}
                errorMessage={fieldState.error?.message}
                label="E-post"
                placeholder="E-post"
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name="username"
            render={({ field, fieldState }) => (
              <Input
                variant="bordered"
                fullWidth
                isDisabled={isPending}
                errorMessage={fieldState.error?.message}
                label="Brukernavn"
                placeholder="Brukernavn"
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <Input
                fullWidth
                variant="bordered"
                isDisabled={isPending}
                errorMessage={fieldState.error?.message}
                label="Passord"
                placeholder="******"
                {...field}
                type="password"
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <Input
                fullWidth
                variant="bordered"
                isDisabled={isPending}
                errorMessage={fieldState.error?.message}
                label="Gjenta Passord"
                placeholder="******"
                {...field}
                type="password"
              />
            )}
          />
          <Button fullWidth disabled={isPending} type="submit">
            Opprett bruker
          </Button>
        </div>
      </form>
    </AuthCardWrapper>
  );
};
