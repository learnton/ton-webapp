// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';

import MembershipCard from './MembershipCard';
import OtherCard from './OtherCard';
import { CARD_TYPE, CardMap, ZkIDCardProps } from './types';

const componentMap: CardMap = {
  [CARD_TYPE.Membership]: MembershipCard,
  [CARD_TYPE.Identity]: OtherCard,
  [CARD_TYPE.POAP]: OtherCard,
  [CARD_TYPE.Social]: OtherCard,
  [CARD_TYPE.Achievement]: OtherCard,
  [CARD_TYPE.Ticket]: OtherCard,
  [CARD_TYPE.Finance]: OtherCard,
  [CARD_TYPE.Other]: OtherCard
};

export function findCard(category: CARD_TYPE): React.FC<ZkIDCardProps> {
  return componentMap[category];
}
