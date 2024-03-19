import { NIFUpload } from "@/app/components/admin/NIFUpload";
import { LogoutButton } from "@/app/components/auth/LogoutButton";
import { GoToAdmin } from "@/app/components/buttons/goto-admin";
import { EditOwnUserForm } from "@/app/components/EditUser/edit-own-user";
import { CreateNotificationModal } from "@/app/components/notifications/CreateNotificationModal";
import { getUsers } from "@/data/getUsers";
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const AdminPage = async () => {
  const user = await currentUser();
  const users = await getUsers();

  if (user?.id && user?.role === UserRole.ADMIN) {
    return (
      <div className="flex flex-col justify-center space-y-6 items-center">
        <h2 className="h2">Adminside</h2>
        <NIFUpload />
        <CreateNotificationModal userId={user.id} users={users} />
      </div>
    );
  }
};

export default AdminPage;
