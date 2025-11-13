"use client";

import { CACHE } from "@/constants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ErrorBoundaryProvider } from "./error-boundary";
import { UserType } from "@/types/user";

export default function ReactQueryProvider({
  children,
  user,
}: {
  user: UserType | null;
  children: ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: CACHE.CACHE_DURATION.VERY_SHORT_1M * 1000,
            refetchOnWindowFocus: false,
            retry: 2,
            throwOnError: true,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundaryProvider user={user}>{children}</ErrorBoundaryProvider>
    </QueryClientProvider>
  );
}
