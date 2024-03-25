"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import axios, { AxiosError } from "axios";

import { ExtendedMatchSquad } from "@/data/getExtendedMatchSquads";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Controller, useForm } from "react-hook-form";
import { NewMatchEventSchema } from "@/schemas";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MatchEventType } from "@prisma/client";
import { matchEventTypesList } from "@/lib/enum-mappings";

type EditMatchEventsModalProps = {
  squad: ExtendedMatchSquad;
  children: JSX.Element;
};
export const EditMatchEventsModal = ({
  squad,
  children,
}: EditMatchEventsModalProps) => {
  const router = useRouter();

  const user = useCurrentUser();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const { handleSubmit, control, reset } = useForm<
    z.infer<typeof NewMatchEventSchema>
  >({
    resolver: zodResolver(NewMatchEventSchema),
    defaultValues: {
      eventType: MatchEventType.GOAL,
    },
  });

  const onSubmit = useCallback(
    async (formData: z.infer<typeof NewMatchEventSchema>) => {
      setError("");

      startTransition(async () => {
        const data = {
          eventType: formData.eventType,
          squadPlayerId: Number(formData.squadPlayerId),
        };

        await axios
          .post(`/api/matchevent`, { data: data })
          .then(() => {
            reset();
            onClose();
            router.refresh();
          })
          .catch((err: Error | AxiosError) => {
            if (axios.isAxiosError(err)) {
              setError(err.message);
            } else {
              setError("Noe gikk galt under opprettelsen av kamphendelse.");
            }
          });
      });
    },
    [reset, onClose, router],
  );

  return (
    <>
      <Button onClick={onOpen} size="sm" color="primary" variant="bordered">
        {children}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="pb-5 sm:min-w-[600px]"
        scrollBehavior="inside"
      >
        <ModalContent className="bg-background text-textPrimary">
          <ModalHeader className="pb-1">
            <h2 className="h2 text-textPrimary">Legg til kamphendelse</h2>
          </ModalHeader>
          <ModalBody>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col space-y-4 "
            >
              <Controller
                control={control}
                name="eventType"
                render={({ field: { onChange, value }, fieldState }) => (
                  <Select
                    isRequired
                    isDisabled={isPending}
                    onChange={(e) => onChange(e.target.value)}
                    selectedKeys={new Set(value ? [value] : [])}
                    errorMessage={fieldState.error?.message}
                    items={matchEventTypesList}
                    label="Hendelse"
                    placeholder="Hendelse"
                  >
                    {(event) => (
                      <SelectItem
                        key={event.type}
                        value={event.type}
                        textValue={`${event.label}`}
                      >
                        <div className="flex flex-row items-center">
                          <div className="flex w-[20px] justify-center items-center">
                            {event.icon}
                          </div>
                          <div>{event.label}</div>
                        </div>
                      </SelectItem>
                    )}
                  </Select>
                )}
              />
              <Controller
                control={control}
                name="squadPlayerId"
                render={({ field: { onChange, value }, fieldState }) => (
                  <Select
                    isRequired
                    isDisabled={isPending}
                    onChange={(e) => onChange(e.target.value)}
                    selectedKeys={new Set(value ? [value] : [])}
                    errorMessage={fieldState.error?.message}
                    items={[...squad.players]}
                    label="Spiller"
                    placeholder="Spiller"
                  >
                    {(player) => (
                      <SelectItem
                        key={player.id}
                        value={player.id}
                        textValue={`${player.player.firstName} ${player.player.lastName}`}
                      >
                        {player.player.firstName} {player.player.lastName}
                      </SelectItem>
                    )}
                  </Select>
                )}
              />
              <div className="flex flex-row justify-between">
                <Button
                  color="danger"
                  onPress={onClose}
                  isDisabled={isPending}
                  variant="flat"
                >
                  Avbryt
                </Button>
                <Button
                  className="ml-2"
                  color="primary"
                  isDisabled={isPending}
                  type="submit"
                >
                  Opprett
                </Button>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
