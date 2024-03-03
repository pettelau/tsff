"use client";

import {
  Card,
  Button,
  CardHeader,
  CardBody,
  CardFooter,
} from "@nextui-org/react";
import { Social } from "./SocialLogins";
import { useRouter } from "next/navigation";

interface CustomCardWrapperProps {
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
  children: React.ReactNode;
}

export const AuthCardWrapper: React.FC<CustomCardWrapperProps> = ({
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial = false,
  children,
}) => {
  const router = useRouter();
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader className="flex flex-row justify-center pt-8">
        <h2 className="h2">{headerLabel}</h2>
      </CardHeader>
      <CardBody>{children}</CardBody>
      <CardFooter>
        <div className="flex flex-col w-full space-y-3">
          {showSocial && <Social />}
          <Button
            variant="light"
            onClick={() => {
              router.push(backButtonHref);
            }}
          >
            {backButtonLabel}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
