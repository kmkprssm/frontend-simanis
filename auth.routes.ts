/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */

export const authorizedRoutes: string[] = [
  "/dashboard",
  "/konteks",
  "/identifikasi-risiko",
  "/analisis-risiko",
  "/evaluasi-risiko",
  "/perlakuan-risiko",
  "/pengendalian-risiko",
  "/pencatatan-kejadian-risiko",
  "/analisis-residu-risiko",
  "/pemantauan-tinjauan",
  "/master-user",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes: string[] = ["/auth/login"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/dashboard";
