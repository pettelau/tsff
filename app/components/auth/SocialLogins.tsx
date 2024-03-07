"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useSearchParams } from "next/navigation";

import { Button } from "@nextui-org/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onSocialLoginClick = (provider: "google") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
      startContent={<FcGoogle className="h-5 w-5" />}
        size="lg"
        className="w-full text-primary-900"
        variant="bordered"
        onClick={() => onSocialLoginClick("google")}
      >
        Logg inn med Google-kontoen din
      </Button>
    </div>
  );
};
