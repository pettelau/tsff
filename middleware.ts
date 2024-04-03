import { auth } from "@/auth";

// TODO: Add middleware logic when Authjs 5 - Prisma bug is fixed

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  console.log(nextUrl);
  console.log(isLoggedIn);
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
