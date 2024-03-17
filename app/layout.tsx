import "./globals.css";
import NavBar from "./components/NavBar";
import Providers from "./providers";
import { Space_Grotesk } from "next/font/google";
import { auth } from "@/auth";
import { Viewport } from "next";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "TSFF",
  description: "Nettiden til Trondheim Student-fotballforening (TSFF)",
};

const space_grotesk = Space_Grotesk({ subsets: ["latin"] });

interface Props {
  children: React.ReactNode;
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#001328",
};

export default async function RootLayout({ children }: Props) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={cn(space_grotesk.className, "bg-background")}>
        <Providers session={session}>
          <main>
            <div>
              <NavBar />
            </div>
            <div className="flex items-center justify-center sm:pt-5 pt-2 text-textPrimary">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
