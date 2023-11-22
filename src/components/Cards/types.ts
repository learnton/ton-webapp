// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HexString } from '@zcloak/crypto/types';
import { DidUrl } from '@zcloak/did-resolver/types';
import { VerifiableCredential } from '@zcloak/vc/types';

export enum CARD_TYPE {
  Other = 0,
  Membership = 1,
  Identity = 2,
  POAP = 3,
  Social = 4,
  Achievement = 5,
  Ticket = 6,
  Finance = 7
}

export interface ApplicationProps {
  title: string;
  url: string;
}

export interface BaseTempProps {
  id?: number;
  ctypeHash?: HexString;
  creator?: DidUrl;
  desc: string;
  title: string;
  issuer: DidUrl;
  duration: number;
  background: string;
  logo: string;
  category: CARD_TYPE;
  public: number;
  color: string;
  applications: ApplicationProps[];
  createdTime: number;
}

export interface ZkIDCardProps {
  template?: BaseTempProps;
  id?: string;
  handleQr?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  vc?: VerifiableCredential<boolean> | null;
  onClick?: () => void;
}

export type CardMap = Record<CARD_TYPE, React.FC<ZkIDCardProps>>;
