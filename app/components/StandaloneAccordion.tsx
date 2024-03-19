"use client";

import { cn } from "@/lib/utils";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { ReactNode, useId } from "react";

export type StandaloneExpandProps = {
  primary: string;
  secondary?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export const StandaloneAccordion = ({
  primary,
  secondary,
  className,
  icon,
  children,
}: StandaloneExpandProps) => {
  const id = useId();

  return (
    <Accordion
      className={cn([`px-0 bg-primary`, className])}
      itemClasses={{
        trigger: "py-3",
        content: "pb-4",
        title: "text-base",
      }}
      variant="splitted"
    >
      <AccordionItem
        className="text-primary"
        key={id}
        startContent={icon}
        subtitle={secondary}
        title={primary}
      >
        {children}
      </AccordionItem>
    </Accordion>
  );
};
