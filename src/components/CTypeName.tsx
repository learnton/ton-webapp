// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCtype, useShort } from "@/hooks";

const CTypeName = ({ cTypeHash }: { cTypeHash?: string | null }) => {
  const ctype = useCtype(cTypeHash);
  const { shortHash } = useShort();

  return <>{ctype?.title || (cTypeHash ? shortHash(cTypeHash) : "")}</>;
};

export default CTypeName;
