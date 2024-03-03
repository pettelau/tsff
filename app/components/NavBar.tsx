"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { AUTH_ROUTES } from "@/lib/routes";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const pathname = usePathname();

  const router = useRouter();

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  const user = useCurrentUser();

  const menuItems = [
    { display: "Seriespill 23/24", href: "/serie" },
    { display: "Historie", href: "/historie" },
    { display: "Lagene", href: "/lagene" },
    { display: "Lover", href: "/lover" },
    { display: "Lagledere", href: "/lagledere" },
    { display: "Om TSFF", href: "/omoss" },
  ];

  return (
    <>
      {!isAuthRoute && (
        <Navbar onMenuOpenChange={setIsMenuOpen}>
          <NavbarContent>
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="sm:hidden"
            />
            <NavbarBrand
              className="cursor-pointer"
              onClick={() => {
                router.push("/");
              }}
            >
              TSFF LOGO
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent className="hidden sm:flex gap-4" justify="start">
            {menuItems.map((item) => (
              <NavbarItem
                key={item.href}
                isActive={pathname.startsWith(item.href)}
              >
                <Link color="foreground" href={item.href}>
                  {item.display}
                </Link>
              </NavbarItem>
            ))}
          </NavbarContent>
          <NavbarContent justify="end">
            {user ? (
              <NavbarItem>
                <Button as={Link} color="primary" href="/profil" variant="flat">
                  {user.username}
                </Button>
              </NavbarItem>
            ) : (
              <NavbarItem>
                <Button
                  onClick={() => {
                    router.push("/auth/login");
                  }}
                >
                  Logg inn
                </Button>
              </NavbarItem>
            )}
          </NavbarContent>

          <NavbarItem></NavbarItem>
          <NavbarMenu className="">
            {menuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  color={"foreground"}
                  className="w-full"
                  href={item.href}
                  size="lg"
                >
                  {item.display}
                </Link>
              </NavbarMenuItem>
            ))}
          </NavbarMenu>
        </Navbar>
      )}
    </>
  );
}
