"use client";

import {
  Button,
  Checkbox,
  CheckboxGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import axios from "axios";

import { ExtendedMatchSquad } from "@/data/getExtendedMatchSquads";
import { Controller, useForm } from "react-hook-form";
import { SquadSchema } from "@/schemas";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Player } from "@prisma/client";

type EditMatchSquadModalProps = {
  allClubPlayers: Player[];
  squad: ExtendedMatchSquad;
  children: JSX.Element;
};
export const EditMatchSquadModal = ({
  allClubPlayers,
  squad,
  children,
}: EditMatchSquadModalProps) => {
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const [shouldRefreshOnClose, setShouldRefreshOnClose] = useState(false);

  const { control } = useForm<z.infer<typeof SquadSchema>>({
    resolver: zodResolver(SquadSchema),
    defaultValues: {
      playerIds: squad.players.map((player) => player.player.id.toString()),
    },
  });

  const onUpdate = () => setShouldRefreshOnClose(true);

  const handleClose = () => {
    if (shouldRefreshOnClose) {
      router.refresh();
    }
    onClose();
    setShouldRefreshOnClose(false);
  };

  const updateSquadMember = useCallback(
    async (playerId: string, add: boolean) => {
      setError("");

      startTransition(async () => {
        const data = {
          playerId: Number(playerId),
          add: add,
        };

        try {
          await axios
            .post(`/api/squad/${squad.id}`, { data: data })
            .then(onUpdate);
        } catch (err) {
          if (axios.isAxiosError(err)) {
            setError(err.message);
          } else {
            setError("Noe gikk galt under oppdateringen av kamptropp.");
          }
        }
      });
    },
    [squad.id],
  );

  return (
    <>
      <Button onClick={onOpen} size="sm" color="primary" variant="bordered">
        {children}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        className="pb-5 sm:min-w-[600px]"
        scrollBehavior="inside"
      >
        <ModalContent className="bg-background text-textPrimary">
          <ModalHeader className="pb-1">
            <h2 className="h2 text-textPrimary">Endre kamptropp</h2>
          </ModalHeader>
          <ModalBody>
            <Controller
              control={control}
              name="playerIds"
              render={({ field: { onChange, value } }) => (
                <CheckboxGroup
                  // isDisabled={isPending}
                  value={value}
                  onValueChange={(newValue) => {
                    const added = newValue.filter((x) => !value.includes(x));
                    const removed = value.filter((x) => !newValue.includes(x));

                    if (added.length > 0) {
                      updateSquadMember(added[0], true);
                    }
                    if (removed.length > 0) {
                      updateSquadMember(removed[0], false);
                    }

                    onChange(newValue);
                  }}
                >
                  {allClubPlayers.map((clubPlayer) => (
                    <Checkbox
                      key={clubPlayer.id}
                      value={clubPlayer.id.toString()}
                    >
                      <div className="text-white">
                        {clubPlayer.firstName} {clubPlayer.lastName}
                      </div>
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              )}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
