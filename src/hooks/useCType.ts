// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CType } from "@zcloak/ctype/types";

import { useState } from "react";

import { HexString } from "@zcloak/crypto/types";

import { getCtype } from "@/api/card";

export function useCType(id: HexString) {
  const [ctype, setData] = useState<CType | undefined>();
  void getCtype({ id }).then((res) => {
    console.log("useCType=", res);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    setData(res.data?.rawData ? (res.data?.rawData as CType) : undefined);
  });

  return { ctype };
}
