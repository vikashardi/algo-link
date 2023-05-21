"use client";
import { WatchlistProvider } from "@/context/watchlistContext";
import { SessionProvider } from "next-auth/react";

const Provider = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      <WatchlistProvider>{children}</WatchlistProvider>
    </SessionProvider>
  );
};

export default Provider;
