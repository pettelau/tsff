"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { recipientGroupList } from "@/lib/enum-mappings";
import { filterUserIdsByRecipientGroup } from "@/lib/utils";
import { NewNotificationSchema } from "@/schemas";
import { RecipientGroup } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { User, UserRole } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Alert } from "../Alert";

type FormDataProps = {
  title: string;
  infoText: string;
  recipientIds: Set<string>;
};

export const CreateNotificationModal = ({
  userId: userId,
  users: users,
}: {
  userId: string;
  users: User[];
}) => {
  const user = useCurrentUser();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const [recipientGroup, setRecipientGroup] = useState<string>(
    recipientGroupList[0].type,
  );

  const { handleSubmit, control, reset } = useForm<
    z.infer<typeof NewNotificationSchema>
  >({
    resolver: zodResolver(NewNotificationSchema),
    defaultValues: {
      title: "",
      infoText: "",
      recipientIds: [],
    },
  });

  const onSubmit = useCallback(
    async (formData: z.infer<typeof NewNotificationSchema>) => {
      setError("");

      startTransition(async () => {
        const data = {
          title: formData.title,
          infoText: formData.infoText,
          recipientIds:
            recipientGroup === RecipientGroup.CUSTOM
              ? Array.from(formData.recipientIds)
              : filterUserIdsByRecipientGroup(recipientGroup, users),
          creator: userId,
        };

        await axios
          .post(`/api/notification`, { data: data })
          .then(() => {
            setSuccess("Beskjeden ble opprettet!");
            reset();
            router.refresh();
          })
          .catch((err: Error | AxiosError) => {
            if (axios.isAxiosError(err)) {
              setError(err.message);
            } else {
              setError("Noe gikk galt under opprettelsen av beskjed.");
            }
          });
      });
    },
    [recipientGroup, reset, router, userId, users],
  );

  return (
    <>
      <Button onClick={onOpen} className="bg-highlight">
        Opprett ny beskjed
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="pb-5 sm:min-w-[600px]"
        scrollBehavior="inside"
      >
        <ModalContent className="">
          <ModalHeader className="pb-1">
            <h2 className="h2 ">Opprett beskjed</h2>
          </ModalHeader>
          <ModalBody>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col space-y-4 "
            >
              <Controller
                control={control}
                name="title"
                render={({ field, fieldState }) => (
                  <Input
                    isDisabled={isPending}
                    fullWidth
                    errorMessage={fieldState.error?.message}
                    aria-label="notification-title"
                    label="Tittel"
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name="infoText"
                render={({ field, fieldState }) => (
                  <Textarea
                    isDisabled={isPending}
                    fullWidth
                    errorMessage={fieldState.error?.message}
                    aria-label="notification-text"
                    label="Tekst"
                    {...field}
                  />
                )}
              />
              <h3 className="h3 ">Mottakere</h3>
              <RadioGroup
                isDisabled={isPending}
                size="sm"
                orientation="horizontal"
                className="text-textPrimary"
                value={recipientGroup}
                onValueChange={setRecipientGroup}
              >
                {recipientGroupList.map((rg) => {
                  return (
                    <Radio key={rg.type} value={rg.type}>
                      {rg.label}
                    </Radio>
                  );
                })}
              </RadioGroup>
              {recipientGroup === RecipientGroup.CUSTOM && (
                <Controller
                  control={control}
                  name="recipientIds"
                  render={({ field: { onChange, value }, fieldState }) => {
                    return (
                      <Select
                        isDisabled={isPending}
                        items={[...users]}
                        fullWidth
                        errorMessage={fieldState.error?.message}
                        label="Mottakere av beskjed"
                        onSelectionChange={onChange}
                        selectionMode="multiple"
                        selectedKeys={value}
                      >
                        {(user) => (
                          <SelectItem
                            key={user.id}
                            value={user.id}
                            textValue={user.username}
                          >
                            {user.username} (
                            {user.role === UserRole.ADMIN
                              ? "Admin"
                              : user.clubId
                              ? user.clubId
                              : "Servicebruker uten klubb"}
                            )
                          </SelectItem>
                        )}
                      </Select>
                    );
                  }}
                />
              )}
              {error ? (
                <Alert
                  variant="danger"
                  title="Kunne ikke oppdatere spillerdatabasen"
                >
                  <>{error}</>
                </Alert>
              ) : (
                success && (
                  <Alert variant="success">
                    <>
                      Beskjeden ble opprettet!
                    </>
                  </Alert>
                )
              )}
              <Button type="submit" color="primary" isDisabled={isPending}>
                Opprett beskjed
              </Button>
            </form>
          </ModalBody>
          <ModalFooter className="flex justify-center py-1 "></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
