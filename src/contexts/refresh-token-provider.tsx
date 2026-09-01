// Komponen Client global / wrapper
"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export function RefreshTokenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user.error === "RefreshAccessTokenError") {
      // const currentPath = window.location.pathname + window.location.search;

      signOut({ callbackUrl: "/simanis/auth/login" });
    }
  }, [session]);

  return <>{children}</>;
}
