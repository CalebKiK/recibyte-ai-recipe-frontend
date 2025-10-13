"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function ReactQueryProvider({ children }) {
  // You could also persist QueryClient across hot reloads in development.
  const queryClient = React.useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          cacheTime: 30 * 60 * 1000, // 30 minutes
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    })
  ).current;

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}