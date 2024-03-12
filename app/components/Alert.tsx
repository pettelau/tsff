"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { useState } from "react";

import { CgDanger } from "react-icons/cg";
import { CgCheckO } from "react-icons/cg";
import { CgInfo } from "react-icons/cg";
import { IoWarningOutline } from "react-icons/io5";
import { MdClose } from "react-icons/md";

export type AlertProps = {
  variant: "success" | "info" | "danger" | "warning";
  children: JSX.Element;
  title?: string;
};

type MapperProps = Record<
  AlertProps["variant"],
  { icon: JSX.Element; color: string }
>;
const AlertMapper: MapperProps = {
  danger: { icon: <CgDanger />, color: "red-400" },
  success: { icon: <CgCheckO />, color: "green-400" },
  info: { icon: <CgInfo />, color: "blue-400" },
  warning: { icon: <IoWarningOutline />, color: "orange-400" },
};

export const Alert = ({ variant, title, children }: AlertProps) => {
  const [open, setOpen] = useState(true);
  return (
    <div
      className={`${
        open ? "flex" : "hidden"
      } flex flex-row space-x-4 rounded-lg bg-${
        AlertMapper[variant].color
      } p-4 items-center justify-center`}
    >
      <div className="flex items-center justify-center text-[24px] w-6">
        {AlertMapper[variant].icon}
      </div>
      <div className="text-sm flex-grow">{children}</div>
      <div className="flex flex-col w-4 mt-0 mr-0 text-gray-600">
        <MdClose
          className="hover:cursor-pointer"
          onClick={() => {
            setOpen(false);
          }}
        />
      </div>
    </div>
  );
};
