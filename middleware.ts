
export { auth as middleware } from "@/auth";

// TODO: Add middleware logic when Authjs 5 - Prisma bug is fixed

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
