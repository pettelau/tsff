"use client";

import { logout } from "@/actions/logout";
import { Button } from "@nextui-org/react";

export const LogoutButton = () => {
  const onClick = () => {
    logout();
  };

  return <Button variant="bordered" onClick={onClick}>Logg ut</Button>;
};
