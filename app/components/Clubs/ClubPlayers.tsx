"use client";

import React from "react";
import {
  Listbox,
  ListboxItem,
  Chip,
  ScrollShadow,
  Avatar,
  Selection,
} from "@nextui-org/react";
import { ListboxWrapper } from "./ListboxWrapper";
import { Player } from "@prisma/client";

export type ClubPlayerProps = {
  data: Player[];
  name: string;
};

export const ClubPlayers = async ({ data: data, name: name }: ClubPlayerProps) => {
  return (
    <ListboxWrapper>
      <Listbox
        topContent={name}
        classNames={{
          base: "max-w-xs",
          list: "max-h-[300px] overflow-scroll",
        }}
        variant="flat"
      >
        {data.map((item) => (
          <ListboxItem
            key={item.id}
            textValue={item.firstName + " " + item.lastName}
          >
            <div className="flex gap-2 items-center">
              <Avatar
                alt={item.firstName}
                className="flex-shrink-0"
                size="sm"
                showFallback
                src="et bilde fra databasen?"
              />
              <div className="flex flex-col">
                <span className="text-small">{item.firstName + " " + item.lastName}</span>
                <span className="text-tiny text-default-400">{item.email}</span>
              </div>
            </div>
          </ListboxItem>
        ))}
      </Listbox>
    </ListboxWrapper>
  );
};
