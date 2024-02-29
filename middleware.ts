import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  API_AUTH_PREFIX,
  AUTH_ROUTES,
  ADMIN_ROUTES,
  USER_ROUTES,
} from "@/lib/routes";

const { auth } = NextAuth(authConfig);

// @ts-ignore
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;


  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX);
  const isAdminRoute = ADMIN_ROUTES.includes(nextUrl.pathname);
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);
  const isUserRoute = USER_ROUTES.includes(nextUrl.pathname);

  const isPublicRoute =
    !isApiAuthRoute && !isAdminRoute && !isAuthRoute && !isUserRoute;

  if (isApiAuthRoute) {
    return null;
  }

  // Redirect already logged in users to a different route
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  // if user is not logged in and tried to access a route that requires log in, redirect to login page
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }


  // TODO check if user has required privileges to access the requested page, e.g. admin pages

  return null;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
