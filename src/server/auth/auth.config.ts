import type { NextAuthConfig } from "next-auth";

import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas/auth-schema";
import CONST from "@/lib/constants";
import { TUserData } from "@/types/user-type";

const isProduction = process.env.NODE_ENV === "production";
const APP_BASE_PATH = CONST.APP_BASE_PATH || "/simanis";

export default {
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const response = await fetch(`${CONST.API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email, password }),
          });

          const result = (await response.json()) as TUserData;

          if (!result.success) {
            return null;
          }

          return {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
            accessToken: result.accessToken,
          };
        }

        return null;
      },
    }),
  ],
  cookies: {
    sessionToken: {
      name: `__mainrisk.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: APP_BASE_PATH,
        secure: isProduction,
      },
    },
    callbackUrl: {
      name: `__mainrisk.callback-url`,
      options: {
        sameSite: "lax",
        path: APP_BASE_PATH,
        secure: isProduction,
      },
    },
    csrfToken: {
      name: `__mainrisk.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: APP_BASE_PATH,
        secure: isProduction,
      },
    },
  },
} satisfies NextAuthConfig;
