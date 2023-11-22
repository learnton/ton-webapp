// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from "react";

import { useCtype, useShort } from "@/hooks";

const CTypeName: React.FC<{ cTypeHash?: string | null }> = ({ cTypeHash }) => {
  const ctype = useCtype(cTypeHash);
  const { shortHash } = useShort();

  return <>{ctype?.title || (cTypeHash ? shortHash(cTypeHash) : "")}</>;
};

export default React.memo(CTypeName);
