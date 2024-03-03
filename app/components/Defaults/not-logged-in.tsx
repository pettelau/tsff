"use client";

import { GoToLogin } from "../buttons/goto-login";

export const NotLoggedIn = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <p>Du er ikke logget inn og har ikke tilgang til denne siden</p>
      <GoToLogin />
    </div>
  );
};
