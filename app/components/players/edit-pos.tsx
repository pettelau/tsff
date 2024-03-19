"use client";

import { positionsList, positionsMap } from "@/lib/enum-mappings";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { Player, Position } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type EditPlayerPosProps = {
  playerId: number;
  currentPos: Position | null;
};

type FormDataProps = {
  position: Position | null;
};

export const EditPlayerPos = ({
  playerId: playerId,
  currentPos: currentPos,
}: EditPlayerPosProps) => {
  const [editOpen, setEditOpen] = useState<boolean>(false);

  const router = useRouter();

  const { handleSubmit, control } = useForm<FormDataProps>({
    defaultValues: {
      position: currentPos,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormDataProps) => {
      if (formData.position !== null) {
        const data: {
          position: Player["position"];
        } = {
          ...formData,
          position: formData.position,
        };
        await axios.put(`/api/player/${playerId}`, { data: data });
        setEditOpen(false);
        router.refresh();
      }
    },
    [playerId, router],
  );

  return (
    <div className="flex flex-row items-center space-x-2">
      <div>
        {editOpen ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-row items-center justify-center space-x-2"
          >
            <Controller
              control={control}
              name="position"
              render={({ field: { onChange, value } }) => (
                <Select
                  aria-label="Select position"
                  size="sm"
                  className="w-[150px]"
                  label="Posisjon"
                  items={positionsList}
                  onChange={(e) => onChange(e.target.value)}
                  selectedKeys={new Set(value ? [value] : [])}
                  variant="faded"
                >
                  {(pos) => (
                    <SelectItem key={pos.type} value={pos.type}>
                      {pos.label}
                    </SelectItem>
                  )}
                </Select>
              )}
            />
            <Button
              onClick={() => setEditOpen(false)}
              color="warning"
            >
              Avbryt
            </Button>
            <Button type="submit" color="success">
              Lagre
            </Button>
          </form>
        ) : currentPos ? (
          positionsMap[currentPos].label
        ) : (
          "Ikke satt"
        )}
      </div>
      <div>
        {!editOpen && (
          <Button
            onClick={() => setEditOpen(true)}
            size="sm"
            className="h-[24px]"
          >
            Endre
          </Button>
        )}
      </div>
    </div>
  );
};
