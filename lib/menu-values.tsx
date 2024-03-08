import { IoIosFootball } from "react-icons/io";
import { FaTableList } from "react-icons/fa6";
import { MdOutlineScoreboard } from "react-icons/md";
import { LuTrophy } from "react-icons/lu";
import { GoGoal } from "react-icons/go";

export const competitionMenuTabs = [
  { name: "Kamper", href: "/serie", icon: <MdOutlineScoreboard /> },
  { name: "Tabeller", href: "/serie/tables", icon: <FaTableList /> },
  { name: "Stats", href: "/serie/stats", icon: <GoGoal /> },
  { name: "Sluttspill", href: "/serie/sluttspill", icon: <LuTrophy /> },
];
