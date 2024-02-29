
// all routes are public by default

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password"
];

/**
 * An array of routes that are accessible to the all logged in users
 * These routes only requires the user to have a USER role
 * @type {string[]}
 */

export const USER_ROUTES = [
    "/profile"
  ];

/**
 * An array of routes that are accessible to admin users
 * These routes requires the user to have an ADMIN role
 * @type {string[]}
 */

export const ADMIN_ROUTES = [
    "/admin"
  ];
  
  /**
   * The prefix for API authentication routes
   * Routes that start with this prefix are used for API authentication purposes
   * @type {string}
   */
  export const API_AUTH_PREFIX = "/api/auth";
  
  /**
   * The default redirect path after logging in
   * @type {string}
   */
  export const DEFAULT_LOGIN_REDIRECT = "/";