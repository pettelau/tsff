import { currentUser } from "@/lib/auth";

export default async function Home() {
  const user = await currentUser();
  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="h2">Velkommen til Trondheim Student-fotballforening!</h2>
    </div>
  );
}
