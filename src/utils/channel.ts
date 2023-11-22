// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const channel = new MessageChannel();
export const port1 = channel.port1;
export const port2 = channel.port2;
port1.start();
port2.start();
