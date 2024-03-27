"use client";

import {
  Button,
  Input,
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

import { Controller, useForm } from "react-hook-form";
import { MatchGoalsSchema } from "@/schemas";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { matchEventTypesList } from "@/lib/enum-mappings";

type EditMatchGoalsModalProps = {
  homeGoals: number | null;
  awayGoals: number | null;
  matchId: number;
};
export const EditMatchGoalsModal = ({
  homeGoals,
  awayGoals,
  matchId,
}: EditMatchGoalsModalProps) => {
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const { handleSubmit, control } = useForm<z.infer<typeof MatchGoalsSchema>>({
    resolver: zodResolver(MatchGoalsSchema),
    defaultValues: {
      homeGoals: homeGoals !== null ? homeGoals : 0,
      awayGoals: awayGoals !== null ? awayGoals : 0,
    },
  });

  const onSubmit = useCallback(
    async (formData: z.infer<typeof MatchGoalsSchema>) => {
      setError("");

      startTransition(async () => {
        await axios
          .post(`/api/match/${matchId}/result`, { data: formData })
          .then(() => {
            onClose();
            router.refresh();
          })
          .catch((err: Error | AxiosError) => {
            if (axios.isAxiosError(err)) {
              setError(err.message);
            } else {
              setError("Noe gikk galt under endring av kampresultat.");
            }
          });
      });
    },
    [matchId, onClose, router],
  );

  return (
    <>
      <Button
        onClick={onOpen}
        size="sm"
        color="primary"
        className="w-fit mx-auto"
        variant="bordered"
      >
        Endre kampresultat
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="pb-5 sm:min-w-[600px]"
        scrollBehavior="inside"
      >
        <ModalContent className="bg-background text-textPrimary">
          <ModalHeader className="pb-1">
            <h2 className="h2 text-textPrimary">Endre kampresultat</h2>
          </ModalHeader>
          <ModalBody>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-row space-x-2 "
            >
              <Controller
                control={control}
                name="homeGoals"
                render={({
                  field: { onChange, value },
                  fieldState,
                  formState,
                }) => (
                  <Input
                    isInvalid={!formState.isValid}
                    type="number"
                    value={value === null ? "" : value.toString()}
                    onChange={(e) =>
                      onChange(
                        e.target.value === "" ? null : Number(e.target.value),
                      )
                    }
                  />
                )}
              />
              <Controller
                control={control}
                name="awayGoals"
                render={({
                  field: { onChange, value },
                  fieldState,
                  formState,
                }) => (
                  <Input
                    isInvalid={!formState.isValid}
                    type="number"
                    value={value === null ? "" : value.toString()}
                    onChange={(e) =>
                      onChange(
                        e.target.value === "" ? null : Number(e.target.value),
                      )
                    }
                  />
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
                  Lagre
                </Button>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
