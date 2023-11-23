// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HexString } from "@zcloak/crypto/types";
import { DidUrl } from "@zcloak/did-resolver/types";

import { ApplicationProps, CARD_TYPE } from "@/components";

export interface CacheTemplate {
  id: number;
  _id: string;
  desc: string;
  title: string;
  issuer: DidUrl;
  public: number;
  duration: number;
  background: string;
  logo: string;
  ctypeHash: HexString;
  creator: DidUrl;
  category: CARD_TYPE;
  color: string;
  applications: ApplicationProps[];
  trending: number;
  createdTime: number;
}
