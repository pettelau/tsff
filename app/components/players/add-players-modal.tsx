"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  useDisclosure,
} from "@nextui-org/react";
import { Player } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import { ConfirmModal } from "../ConfirmModal";
import { ClubName } from "@/data/getClubNames";

type AddPlayersModalProps = {
  clubId: number;
  clubs: ClubName[];
};
export const AddPlayersModal = ({ clubId, clubs }: AddPlayersModalProps) => {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [moreAvailable, setMoreAvailable] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [fetchedPlayers, setFetchedPlayers] = useState<Player[]>([]);
  const [existingPlayers, setExistingPlayers] = useState<Player[]>([]);


  const [showOnlyFree, setShowOnlyFree] = useState<boolean>(false);

  const [isPending, startTransition] = useTransition();
  const [currentUpdatingId, setCurrentUpdatingId] = useState<number | null>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchExistingPlayers = async () => {
    const response = await fetch(`/api/club/${clubId}/players`);
    const existingPlayers = await response.json();
    setExistingPlayers(existingPlayers);
  };

  const fetchPlayers = async (searchQuery: string, page: number) => {

    const response = await fetch(
      `/api/players/search?search=${searchQuery}&page=${page}&onlyfree=${
        showOnlyFree ? "true" : "false"
      }`,
    );
    const { players, moreAvailable } = await response.json();
    setMoreAvailable(moreAvailable);
    if (page > 0) {
      setFetchedPlayers((prev) => {
        const allPlayers = [...prev, ...players];
        const uniquePlayers = Array.from(
          new Map(allPlayers.map((player) => [player.id, player])).values(),
        );
        return uniquePlayers;
      });
    } else {
      setFetchedPlayers(players);
    }
  };

  const handlePlayerChange = async (
    playerId: number,
    remove: boolean = false,
  ) => {
    setCurrentUpdatingId(playerId);
    startTransition(() => {
      const resp = axios.put(`/api/player/${playerId}/changeclub/${clubId}`, {
        data: { remove: remove },
      });
      resp.then(() => {
        fetchExistingPlayers();
        fetchPlayers(search, page);
        router.refresh();
      });
      setCurrentUpdatingId(null);
    });
  };

  const debouncedSearch = useCallback(
    debounce((query, currentPage) => {
      fetchPlayers(query, currentPage);
    }, 500),
    [showOnlyFree],
  );

  useEffect(() => {
    fetchExistingPlayers();
    if (search) {
      debouncedSearch(search, 0);
    } else {
      setFetchedPlayers([]);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch, search, showOnlyFree]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPlayers(search, nextPage);
  };

  return (
    <>
      <Button onClick={onOpen} className="bg-highlight">
        Legg til spillere
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="pb-5 sm:min-w-[600px]"
        scrollBehavior="inside"
      >
        <ModalContent className="bg-background text-textPrimary">
          <ModalHeader className="pb-1">
            <h2 className="h2 text-textPrimary">Legg til spillere</h2>
          </ModalHeader>
          <ModalBody>
            <Switch isSelected={showOnlyFree} onValueChange={setShowOnlyFree} >
              <span className="text-textPrimary">
              Vis bare spillere uten klubb
              </span>
            </Switch>
            <Input
              isClearable
              placeholder="Søk etter spiller ..."
              size="sm"
              value={search}
              onClear={() => setSearch("")}
              onChange={(e) => {
                setSearch(e.currentTarget.value);
                setPage(0);
                setMoreAvailable(true);
              }}
            />
            {fetchedPlayers.map((player, index) => (
              <div
                key={index}
                className="border-b-2 flex flex-row justify-between items-center pb-1"
              >
                <div>
                  {player.firstName} {player.lastName}
                </div>
                <div>
                  {existingPlayers.some(
                    (existing) => existing.id === player.id,
                  ) ? (
                    <Button
                      isDisabled={isPending && player.id === currentUpdatingId}
                      variant="bordered"
                      color="danger"
                      size="sm"
                      onClick={() => {
                        handlePlayerChange(player.id, true);
                      }}
                    >
                      Fjern
                    </Button>
                  ) : player.clubId === null ? (
                    <Button
                      isDisabled={isPending && player.id === currentUpdatingId}
                      variant="bordered"
                      color={"success"}
                      size="sm"
                      onClick={() => {
                        handlePlayerChange(player.id);
                      }}
                    >
                      Legg til
                    </Button>
                  ) : (
                    <ConfirmModal
                      variant="bordered"
                      color="warning"
                      size="sm"
                      description={`${player.firstName} ${
                        player.lastName
                      } er allerede tilknyttet ${
                        clubs.find((club) => club.id === player.clubId)?.name
                      }. Er du sikker på at du allikevel vil legge spilleren til i din klubb? Dersom du mener det har skjedd en feil her, kan du kontakte TSFF for å finne ut av det.`}
                      onConfirm={() => handlePlayerChange(player.id)}
                      title="Spiller allerede tilknyttet en annen klubb"
                      isDisabled={isPending && player.id === currentUpdatingId}
                    >
                      Legg til
                    </ConfirmModal>
                  )}
                </div>
              </div>
            ))}
          </ModalBody>
          <ModalFooter className="flex justify-center py-1 ">
            {moreAvailable && search !== "" && fetchedPlayers.length > 0 && (
              <Button onClick={handleLoadMore} className="mt-2">
                Last flere
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
