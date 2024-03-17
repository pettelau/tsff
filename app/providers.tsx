"use client";

import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";
import { Session } from "next-auth";
import {
  DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";

export type Props = {
  session: Session | null;
  dehydratedState: DehydratedState;
  children: React.ReactNode;
};

export default function Providers({
  session,
  dehydratedState,
  children,
}: Props) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <NextUIProvider>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={dehydratedState}>
            {children}
          </HydrationBoundary>
        </QueryClientProvider>
      </SessionProvider>
    </NextUIProvider>
  );
}
