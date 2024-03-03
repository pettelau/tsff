"use client";

import { UpdateOwnProfileSchema } from "@/schemas";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";

import { z } from "zod";
import { useCurrentUser } from "@/hooks/use-current-user";
import { $Enums, UserRole } from "@prisma/client";
import { userRolesList } from "@/lib/utils";
import { updateOwnProfile } from "@/actions/update-own-profile";
import { useRouter } from "next/navigation";
type EditProfileProps = z.infer<typeof UpdateOwnProfileSchema>;

export const EditOwnUserForm = () => {
  const user = useCurrentUser();
  const { update } = useSession();
  const router = useRouter();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const { control, handleSubmit, reset } = useForm<
    z.infer<typeof UpdateOwnProfileSchema>
  >({
    resolver: zodResolver(UpdateOwnProfileSchema),
    defaultValues: {
      username: user?.username,
      role: user?.role,
    },
  });

  const onSubmit = (values: z.infer<typeof UpdateOwnProfileSchema>) => {
    setError("");

    startTransition(() => {
      updateOwnProfile(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            update();
            setSuccess(data.success);
            router.refresh();
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-6 w-full">
          <Controller
            control={control}
            name="username"
            render={({ field, fieldState }) => (
              <Input
                variant="bordered"
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
            name="role"
            render={({ field: { onChange, value }, fieldState }) => (
              <Select
                isDisabled={isPending}
                onChange={(e) => onChange(e.target.value)}
                selectedKeys={new Set(value ? [value] : [])}
                errorMessage={fieldState.error?.message}
                items={userRolesList}
                label="Brukerrole"
                placeholder="Rolle"
              >
                {(role) => (
                  <SelectItem key={role.type} value={role.type}>
                    {role.label}
                  </SelectItem>
                )}
              </Select>
            )}
          />
          <Button fullWidth isDisabled={isPending} type="submit">
            Oppdater profil
          </Button>
        </div>
      </form>
    </>
  );
};
