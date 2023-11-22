/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { WALLET_URL } from "@/api/axiosInstance";

import { CARD_TYPE } from "./types";

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
  [CARD_TYPE.Other]: "/static/card/img_card_3.png",
  [CARD_TYPE.Membership]: "/static/card/img_card_1.png",
  [CARD_TYPE.Identity]: "/static/card/img_card_3.png",
  [CARD_TYPE.POAP]: "/static/card/img_card_3.png",
  [CARD_TYPE.Social]: "/static/card/img_card_3.png",
  [CARD_TYPE.Achievement]: "/static/card/img_card_3.png",
  [CARD_TYPE.Ticket]: "/static/card/img_card_3.png",
  [CARD_TYPE.Finance]: "/static/card/img_card_3.png",
};

export const cardServerImage: Record<CARD_TYPE | number, string> = {
  [CARD_TYPE.Other]: `${WALLET_URL}/static/card/img_card_3.png`,
  [CARD_TYPE.Membership]: `${WALLET_URL}/static/card/img_card_1.png`,
  [CARD_TYPE.Identity]: `${WALLET_URL}/static/card/img_card_3.png`,
  [CARD_TYPE.POAP]: `${WALLET_URL}/static/card/img_card_3.png`,
  [CARD_TYPE.Social]: `${WALLET_URL}/static/card/img_card_3.png`,
  [CARD_TYPE.Achievement]: `${WALLET_URL}/static/card/img_card_3.png`,
  [CARD_TYPE.Ticket]: `${WALLET_URL}/static/card/img_card_3.png`,
  [CARD_TYPE.Finance]: `${WALLET_URL}/static/card/img_card_3.png`,
  1000: `${WALLET_URL}/static/card/img_card_2.png`,
};

export function isCategory(input: any): input is CARD_TYPE {
  return Object.values(CARD_TYPE).includes(input);
}
