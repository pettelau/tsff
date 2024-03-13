"use client";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { GenderType, Player } from "@prisma/client";
import { format, formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";

import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { FaOrcid } from "react-icons/fa6";
import { IoMdMale } from "react-icons/io";
import { IoMdFemale } from "react-icons/io";
import { MdMoneyOffCsred } from "react-icons/md";
import { MdOutlineAttachMoney } from "react-icons/md";
import { TbRefresh } from "react-icons/tb";

import { genderTypesMap } from "@/lib/enum-mappings";

type PlayersAccordionProps = {
  players: Player[];
};

export const PlayersAccordion = ({
  players: players,
}: PlayersAccordionProps) => {
  return (
    <Accordion isCompact variant="bordered">
      {players.map((player) => {
        return (
          <AccordionItem
            textValue={`${player.firstName} ${player.lastName}`}
            key={player.id}
            title={
              <>
                {player.firstName} {player.lastName}
              </>
            }
          >
            <div className="flex flex-col space-y-2">
              {player.gender && (
                <div className="flex flex-row items-center space-x-2">
                  <div>
                    {player.gender === GenderType.MAN ? (
                      <IoMdMale />
                    ) : (
                      <IoMdFemale />
                    )}
                  </div>
                  <div>{genderTypesMap[player.gender].label}</div>
                </div>
              )}
              <div className="flex flex-row items-center space-x-2">
                <div>
                  <LiaBirthdayCakeSolid />
                </div>
                <div>
                  {player.dateOfBirth ? (
                    <>
                      {format(new Date(player.dateOfBirth), "dd. MMMM yyyy", {
                        locale: nb,
                      })}{" "}
                      (
                      {((new Date().getTime() -
                        new Date(player.dateOfBirth).getTime()) /
                        (365.25 * 24 * 60 * 60 * 1000)) |
                        0}{" "}
                      år)
                    </>
                  ) : (
                    "Ingen data"
                  )}
                </div>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <div>
                  <FaOrcid />
                </div>
                <div>NIF-id: {player.nifId}</div>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <div>
                  {player.hasPaidMembershipFee ? (
                    <MdOutlineAttachMoney />
                  ) : (
                    <MdMoneyOffCsred />
                  )}
                </div>
                <div>
                  Har {!player.hasPaidMembershipFee && "ikke"} betalt avgift
                </div>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <div>
                  <TbRefresh />
                </div>
                <div>
                  NIF-data sist oppdatert for{" "}
                  {formatDistanceToNow(player.updatedAt, {
                    addSuffix: true,
                    locale: nb,
                  })}
                </div>
              </div>
            </div>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
