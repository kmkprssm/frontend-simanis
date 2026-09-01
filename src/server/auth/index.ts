import NextAuth from "next-auth";

import authConfig from "./auth.config";
import CONST from "@/lib/constants";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async session({ token, session }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.role = token.role as string;
      session.user.name = token.name as string;
      session.user.token = token.accessToken as string;

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.name = user.name;

        token.backendExpiresAt = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
        token.error = "RefreshAccessTokenError";
        return token;
      }

      const bufferTime = 30 * 60; // 30 menit dalam detik
      const nowInSeconds = Math.floor(Date.now() / 1000);

      if (nowInSeconds + bufferTime > (token.backendExpiresAt as number)) {
        try {
          console.log("Menyegarkan token backend yang hampir kadaluarsa...");

          const response = await fetch(
            `${CONST.API_BASE_URL}/auth/refresh-token`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
                "Content-Type": "application/json",
              },
            },
          );

          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error("Gagal refresh token di backend");
          }

          // Update token backend baru ke dalam session Next-Auth
          token.accessToken = data.accessToken;
          token.backendExpiresAt = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // Reset 24 jam lagi
        } catch (error) {
          console.error("Error refreshing backend token:", error);
          // Berikan flag error agar frontend tahu kalau session terganggu
          token.error = "RefreshAccessTokenError";
        }
      }

      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },

  jwt: {
    maxAge: 24 * 60 * 60,
  },
  secret: CONST.AUTH_SECRET,
  ...authConfig,
});
