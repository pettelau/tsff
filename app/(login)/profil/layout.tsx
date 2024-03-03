import { NotLoggedIn } from "@/app/components/Defaults/not-logged-in";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

const ProfileLayout = async ({ children }: Props) => {
  const user = await currentUser();

  if (user) {
    return <>{children}</>;
  } else {
    return redirect("/auth/login");
  }
};

export default ProfileLayout;
