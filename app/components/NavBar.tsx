"use client";
import React, { useState } from "react";
import Image from "next/image";
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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { AUTH_ROUTES } from "@/lib/routes";
import { useCurrentUser } from "@/hooks/use-current-user";

import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IoMdPerson } from "react-icons/io";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [openMenuItem, setOpenMenuItem] = useState<string | null>(null);

  const pathname = usePathname();

  const router = useRouter();

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  const user = useCurrentUser();

  const menuItems = [
    {
      display: "Seriespill 23/24",
      href: "/serie",
      subItems: [
        { display: "Avdeling A", href: "/serie/avdeling-a" },
        { display: "Avdeling B", href: "/serie/avdeling-b" },
        { display: "Spillerstatistikk", href: "/serie/spillerstatistikk" },
      ],
    },
    { display: "Historie", href: "/historie" },
    { display: "Lagene", href: "/lagene" },
    { display: "Lover", href: "/lover" },
    { display: "Lagledere", href: "/lagledere" },
    {
      display: "Om TSFF",
      href: "/omoss",
      subItems: [
        { display: "Sponsor", href: "/omoss/sponsor" },
        { display: "Kontakt", href: "/omoss/kontakt" },
      ],
    },
  ];

  return (
    <>
      {!isAuthRoute && (
        <Navbar
          // className="border-b-2 border-primary bg-primary"
          onMenuOpenChange={setIsMenuOpen}
          classNames={{
            item: [
              "text-sm",
              "flex",
              "relative",
              "h-[48px]",
              "items-center",
              "data-[active=true]:after:content-['']",
              "data-[active=true]:after:absolute",
              "data-[active=true]:after:bottom-0",
              "data-[active=true]:after:left-0",
              "data-[active=true]:after:right-0",
              "data-[active=true]:after:h-[2px]",
              "data-[active=true]:after:rounded-[2px]",
              "data-[active=true]:after:bg-primary",
            ],
          }}
        >
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
              <Image
                src="/tsff_logo.png"
                alt="TSFF Logo"
                width={35}
                height={30}
              />
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent
            aria-label="Nav-content"
            className="hidden sm:flex gap-4"
            justify="start"
          >
            {menuItems.map((item) =>
              !item.subItems ? (
                <NavbarItem
                  aria-label={item.display}
                  key={item.href}
                  isActive={pathname.startsWith(item.href)}
                >
                  <Link color="foreground" href={item.href} className="text-sm">
                    {item.display}
                  </Link>
                </NavbarItem>
              ) : (
                <div
                  aria-label={item.display}
                  key={item.href}
                  onMouseLeave={() => {
                    setOpenMenuItem(null);
                  }}
                >
                  <Dropdown
                    isOpen={openMenuItem === item.href}
                    className="w-[200px] hover:opacity-100"
                  >
                    <NavbarItem
                      aria-label={item.display}
                      isActive={pathname.startsWith(item.href)}
                    >
                      <DropdownTrigger className="">
                        <Link
                          className="text-sm cursor-pointer"
                          color="foreground"
                          onClick={() => {
                            setOpenMenuItem(null);
                            router.push(item.href);
                          }}
                          onMouseEnter={() => {
                            setOpenMenuItem(item.href);
                          }}
                        >
                          {item.display}{" "}
                          <MdOutlineKeyboardArrowDown
                            className={`transition-transform duration-100 ${
                              openMenuItem === item.href
                                ? "rotate-180"
                                : "rotate-0"
                            }`}
                          />
                        </Link>
                      </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu
                      aria-label={item.display}
                      closeOnSelect
                      className="w-[200px] mt-[-10px] pt-[14px]"
                      itemClasses={{
                        base: "gap-4",
                      }}
                    >
                      {item.subItems.map((subItem) => (
                        <DropdownItem
                          aria-label={subItem.display}
                          className="text-xs"
                          key={subItem.href}
                          onClick={() => {
                            router.push(subItem.href);
                          }}
                        >
                          {subItem.display}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              ),
            )}
          </NavbarContent>
          <NavbarContent justify="end">
            {user ? (
              <NavbarItem>
                <Button
                  className="border-white"
                  startContent={<IoMdPerson />}
                  as={Link}
                  href="/profil"
                  variant="bordered"
                  size="sm"
                >
                  {user.username}
                </Button>
              </NavbarItem>
            ) : (
              <NavbarItem>
                <Button
                  className="border-white"
                  variant="bordered"
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
