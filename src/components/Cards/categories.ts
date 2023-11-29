/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { CARD_TYPE } from "./types";

// import ImgCard from "@/components/Cards/assets/card/img_card.webp"
import ImgCard1 from "@/components/Cards/assets/card/img_card_1.png";
import ImgCard2 from "@/components/Cards/assets/card/img_card_2.png";
import ImgCard3 from "@/components/Cards/assets/card/img_card_3.png";

export const categoryMap: Record<CARD_TYPE, string> = {
  [CARD_TYPE.Other]: "Other",
  [CARD_TYPE.Membership]: "Membership",
  [CARD_TYPE.Identity]: "Identity",
  [CARD_TYPE.POAP]: "POAP",
  [CARD_TYPE.Social]: "Social",
  [CARD_TYPE.Achievement]: "Achievement",
  [CARD_TYPE.Ticket]: "Ticket",
  [CARD_TYPE.Finance]: "Finance",
};

export const cardImage: Record<CARD_TYPE, string> = {
  [CARD_TYPE.Other]: ImgCard3,
  [CARD_TYPE.Membership]: ImgCard1,
  [CARD_TYPE.Identity]: ImgCard3,
  [CARD_TYPE.POAP]: ImgCard3,
  [CARD_TYPE.Social]: ImgCard3,
  [CARD_TYPE.Achievement]: ImgCard3,
  [CARD_TYPE.Ticket]: ImgCard3,
  [CARD_TYPE.Finance]: ImgCard3,
};

export const cardServerImage: Record<CARD_TYPE | number, string> = {
  [CARD_TYPE.Other]: ImgCard3,
  [CARD_TYPE.Membership]: ImgCard1,
  [CARD_TYPE.Identity]: ImgCard3,
  [CARD_TYPE.POAP]: ImgCard3,
  [CARD_TYPE.Social]: ImgCard3,
  [CARD_TYPE.Achievement]: ImgCard3,
  [CARD_TYPE.Ticket]: ImgCard3,
  [CARD_TYPE.Finance]: ImgCard3,
  1000: ImgCard2,
};

export function isCategory(input: any): input is CARD_TYPE {
  return Object.values(CARD_TYPE).includes(input);
}
