import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

const AdminLayout = async ({ children }: Props) => {
  const user = await currentUser();

  if (user?.role === UserRole.ADMIN) {
    return <>{children}</>;
  } else if (user) {
    return redirect("/profil");
  } else {
    return redirect("/auth/login");
  }
};

export default AdminLayout;
