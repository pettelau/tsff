"use client";

import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema } from "@/schemas";
import { login } from "@/actions/login";

import { Input, Button } from "@nextui-org/react";
import { AuthCardWrapper } from "@/app/components/auth/AuthCardWrapper";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const { control, handleSubmit, reset } = useForm<z.infer<typeof LoginSchema>>(
    {
      resolver: zodResolver(LoginSchema),
      defaultValues: {
        email: "",
        password: "",
      },
    },
  );

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            reset();
            setError(data.error);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <AuthCardWrapper
      headerLabel="Logg inn på TSFF"
      backButtonLabel="Har du ikke en bruker?"
      backButtonHref="/auth/register"
    >
      {error && error}
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
            name="password"
            render={({ field, fieldState }) => (
              <Input
                className="text"
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
          <Button fullWidth disabled={isPending} type="submit">
            Logg inn
          </Button>
        </div>
      </form>
    </AuthCardWrapper>
  );
};
