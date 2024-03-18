import { LogoutButton } from "@/app/components/auth/LogoutButton";
import { GoToAdmin } from "@/app/components/buttons/goto-admin";
import { EditOwnUserForm } from "@/app/components/EditUser/edit-own-user";
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const ProfilePage = async () => {
  const user = await currentUser();
  return (
    <div className="flex flex-col justify-center space-y-6 items-center">
      <div>Epost: {user?.email}</div>
      <EditOwnUserForm />
      <LogoutButton />
    </div>
  );
};

export default ProfilePage;
