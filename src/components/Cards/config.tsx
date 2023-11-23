// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import IconCard from "@/assets//wallet/icon_card.svg?react";
import IconCard1 from "@/assets//wallet/icon_card1.svg";
import IconCard2 from "@/assets//wallet/icon_card2.svg";
import IconCard3 from "@/assets//wallet/icon_card3.svg";
import IconCard4 from "@/assets//wallet/icon_card4.svg";

import cardBg1 from "./assets/pic_card1.webp";
import cardBg2 from "./assets/pic_card2.webp";
import cardBg3 from "./assets/pic_card3.webp";
import cardBg4 from "./assets/pic_card4.webp";

export interface CardBgConfig {
  bgId: string;
  bg: string;
  component: unknown;
  show: boolean;
  default: boolean;
}

export const cardBgConfig: CardBgConfig[] = [
  {
    bgId: "1",
    bg: cardBg1,
    component: IconCard,
    show: true,
    default: false,
  },
  {
    bgId: "2",
    bg: cardBg1,
    component: IconCard1,
    show: false,
    default: true,
  },
  {
    bgId: "3",
    bg: cardBg2,
    component: IconCard2,
    show: false,
    default: false,
  },
  {
    bgId: "4",
    bg: cardBg3,
    component: IconCard3,
    show: false,
    default: false,
  },
  {
    bgId: "5",
    bg: cardBg4,
    component: IconCard4,
    show: false,
    default: false,
  },
];
