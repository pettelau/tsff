import { UserRole } from "@prisma/client";


// Mapping of Enums to usable TS types:

// User roles mapping
export const userRolesMap = {
  [UserRole.ADMIN]: { label: "Administrator" },
  [UserRole.USER]: { label: "Bruker" },
};

export const userRolesList = Object.entries(userRolesMap).map(
  ([type, { label }]) => ({
    type,
    label,
  }),
) satisfies { type: string; label: string }[];
