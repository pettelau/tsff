import { FaTableList } from "react-icons/fa6";
import { MdOutlineScoreboard } from "react-icons/md";
import { LuTrophy } from "react-icons/lu";
import { GoGoal } from "react-icons/go";
import { IoNotifications } from "react-icons/io5";
import { FaHistory } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
import { MdContactPhone } from "react-icons/md";
import { ServiceMenuT } from "@/types/types";

export const competitionMenuTabs = [
  { name: "Kamper", href: "/serie", icon: <MdOutlineScoreboard /> },
  { name: "Tabeller", href: "/serie/tabeller", icon: <FaTableList /> },
  { name: "Stats", href: "/serie/stats", icon: <GoGoal /> },
  { name: "Sluttspill", href: "/serie/sluttspill", icon: <LuTrophy /> },
];

export const serviceMenuTabs: ServiceMenuT[] = [
  {
    name: "Kontaktinfo",
    href: "/profil",
    icon: <MdContactPhone />,
    hideIfNoClub: false,
  },
  {
    name: "Spillertropp",
    href: "/profil/spillertropp",
    icon: <HiUserGroup />,
    hideIfNoClub: true,
  },
  {
    name: "Kamper",
    href: "/profil/kamper",
    icon: <MdOutlineScoreboard />,
    hideIfNoClub: true,
  },
  {
    name: "Beskjeder",
    href: "/profil/beskjeder",
    icon: <IoNotifications />,
    hideIfNoClub: false,
  },
];
