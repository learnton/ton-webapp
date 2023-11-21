// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Message, MessageType } from '@zcloak/message/types';

export interface MessageMeta extends Message<MessageType> {
  isRead: boolean;
  templateId?: number;
}
