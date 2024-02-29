"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h2>Velkommen til nye TSFF!</h2>
      <p>Trondeim Student-Fotball-Forening</p>
      <p>Under konstruksjon...</p>
      <button
        onClick={() => {
          router.push("/auth/login");
        }}
      >
        Logg inn
      </button>
    </div>
  );
}
