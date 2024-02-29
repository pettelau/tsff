import AuthCheck from "../components/AuthCheck";
import { SignOutButton } from "../components/authButtons";

export default function ProfilePage() {
  return (
    <>
      <AuthCheck>
        <h2>Profilside</h2>
        <SignOutButton />
      </AuthCheck>
    </>
  );
}
