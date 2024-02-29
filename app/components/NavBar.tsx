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
import Image from "next/image";
import { AUTH_ROUTES } from "@/lib/routes";
// import { SignInButton, SignOutButton } from "./authButtons";
// import AuthCheck from "./AuthCheck";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const pathname = usePathname();

  const router = useRouter();

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

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
            <NavbarItem>
              {/* <AuthCheck>
            <Button as={Link} color="primary" href="/profil" variant="flat">
              Profile
            </Button>
          </AuthCheck> */}
            </NavbarItem>
            {/* <AuthCheck>
          <NavbarItem>
            <SignOutButton />
          </NavbarItem>
        </AuthCheck> */}
          </NavbarContent>
          <NavbarItem></NavbarItem>
          <NavbarMenu className="mt-5">
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
