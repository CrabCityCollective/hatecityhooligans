import type { RecruitmentLocation, RecruitmentLocationId } from "./types";

export const RECRUITMENT_LOCATIONS: Record<RecruitmentLocationId, RecruitmentLocation> = {
  sportschool: {
    id: "sportschool",
    name: "Sportschool",
    description: "Hoge kans op een kandidaat die aan kickboksen of karate doet.",
  },
  rave: {
    id: "rave",
    name: "Rave",
    description: "Hoge kans op een kandidaat met een xtc-voorkeur die houdt van raven.",
  },
  schoolplein: {
    id: "schoolplein",
    name: "Schoolplein",
    description: "Hoge kans op een kandidaat met een gezin-trait.",
  },
};

export const RECRUITMENT_LOCATION_LIST: RecruitmentLocation[] = Object.values(
  RECRUITMENT_LOCATIONS,
);
