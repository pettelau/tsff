import "./globals.css";
import NavBar from "./components/NavBar";
import Providers from "./providers";
import { Inter } from "next/font/google";
import { auth } from "@/auth";

export const metadata = {
  title: "TSFF",
  description: "Nettiden til Trondheim Student-fotballforening (TSFF)",
};

const inter = Inter({ subsets: ["latin"] });

interface Props {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: Props) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers session={session}>
          <main className="">
            <div className="sm:mb-5 mb-2">
              <NavBar />
            </div>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
