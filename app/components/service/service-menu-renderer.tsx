import { ServiceMenuT } from "@/types/types";
import { ServiceContactInfo } from "@/app/components/service/ServiceContactInfo";
import { ServiceTeamSquad } from "@/app/components/service/ServiceTeamSquad";

export const serviceMenuRenderer = (menu: ServiceMenuT["name"]) => {
  switch (menu) {
    case "Kontaktinfo":
      return <ServiceContactInfo />;
    case "Spillertropp":
      return <ServiceTeamSquad />;
  }
};
