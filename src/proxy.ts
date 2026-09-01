// proxy.ts (atau middleware.ts)
import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
} from "@/auth.routes";
import CONST from "./lib/constants";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;

  const APP_BASE_PATH = CONST.APP_BASE_PATH;

  // BENTENG 1: Ambil & bersihkan pathname dari APP_BASE_PATH terlebih dahulu
  let cleanPathname = nextUrl.pathname;
  if (APP_BASE_PATH && cleanPathname.startsWith(APP_BASE_PATH)) {
    cleanPathname = cleanPathname.replace(APP_BASE_PATH, "");
  }

  // Pastikan selalu diawali dengan '/' demi konsistensi kecocokan rute
  if (!cleanPathname.startsWith("/")) {
    cleanPathname = "/" + cleanPathname;
  }

  // Gunakan cleanPathname untuk pengecekan rute internal middleware
  const isApiAuthRoute = cleanPathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(cleanPathname);

  // 1. Jika rute API auth (Next-Auth API endpoints)
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // 2. Jika rute Auth halaman login/register
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(
        new URL(`${APP_BASE_PATH}${DEFAULT_LOGIN_REDIRECT}`, nextUrl.origin),
      );
    }
    return NextResponse.next();
  }

  // 3. Jika user mencoba mengakses rute terproteksi namun belum login
  if (!isLoggedIn) {
    const targetDashboard = `${APP_BASE_PATH}${DEFAULT_LOGIN_REDIRECT}`;

    const loginUrl = new URL(`${APP_BASE_PATH}/auth/login`, nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", targetDashboard);
    loginUrl.searchParams.set("reason", "expired");

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

// import { NextResponse } from "next/server";
// import { auth } from "@/server/auth";
// import {
//   DEFAULT_LOGIN_REDIRECT,
//   apiAuthPrefix,
//   authRoutes,
// } from "@/auth.routes";

// export default auth((req) => {
//   const { nextUrl } = req;
//   const isLoggedIn = !!req.auth?.user;
//   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
//   const isAuthRoute = authRoutes.includes(nextUrl.pathname);

//   if (isApiAuthRoute) {
//     return NextResponse.next();
//   }

//   if (isAuthRoute) {
//     if (isLoggedIn) {
//       return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
//     }
//     return NextResponse.next();
//   }

//   if (nextUrl.pathname === "/") {
//     if (isLoggedIn) {
//       // Jika sudah login, lempar langsung ke halaman dashboard utama
//       return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
//     } else {
//       // Jika belum login, lempar ke halaman auth/login
//       return NextResponse.redirect(new URL("/auth/login", nextUrl));
//     }
//   }

//   if (!isLoggedIn) {
//     const callbackUrl = nextUrl.pathname + nextUrl.search;

//     const loginUrl = new URL("/auth/login", nextUrl);
//     loginUrl.searchParams.set("callbackUrl", callbackUrl);
//     loginUrl.searchParams.set("reason", "expired");

//     return NextResponse.redirect(loginUrl);
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };

// import { NextResponse } from "next/server";
// import { auth } from "@/server/auth";
// import {
//   DEFAULT_LOGIN_REDIRECT,
//   apiAuthPrefix,
//   authRoutes,
// } from "@/auth.routes";

// export default auth((req) => {
//   const { nextUrl } = req;
//   const isLoggedIn = !!req.auth?.user;
//   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
//   const isAuthRoute = authRoutes.includes(nextUrl.pathname);

//   // 1. Jika rute API auth, biarkan lewat
//   if (isApiAuthRoute) {
//     return NextResponse.next();
//   }

//   // 2. Jika rute Auth (halaman login/register)
//   if (isAuthRoute) {
//     if (isLoggedIn) {
//       return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
//     }
//     return NextResponse.next();
//   }

//   // 3. HAPUS LOGIKA "if (nextUrl.pathname === '/')" DARI SINI!
//   // Biarkan halaman root dihandle langsung oleh app/page.tsx utama Anda.

//   // 4. Proteksi rute selain halaman Auth
//   if (!isLoggedIn) {
//     const callbackUrl = nextUrl.pathname + nextUrl.search;

//     const loginUrl = new URL("/auth/login", nextUrl);
//     loginUrl.searchParams.set("callbackUrl", callbackUrl);
//     loginUrl.searchParams.set("reason", "expired");

//     return NextResponse.redirect(loginUrl);
//   }

//   return NextResponse.next();
// });

// export const config = {
//   // Tambahkan root "/" secara eksplisit agar dilewati dengan benar oleh matcher jika dibutuhkan
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };
