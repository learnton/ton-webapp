// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface AuthorizeSite {
  id?: number;
  website: string;
  isAuth?: boolean;
  organization?: string;
  favoriteIcon?: string;
  createTime: number;
  updateTime: number;
}
