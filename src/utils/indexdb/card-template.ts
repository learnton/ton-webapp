// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HexString } from '@zcloak/crypto/types';

export interface CardTemplateRelation {
  id: HexString;
  templateId: number;
  template_id: string;
  category: number;
}
