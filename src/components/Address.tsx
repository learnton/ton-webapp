// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from "react";

function Address({
  showFull,
  value,
}: {
  value?: string | null;
  showFull?: boolean;
}) {
  if (!value) {
    return null;
  }

  return <>{showFull ? value : `${value.slice(0, 15)}...${value.slice(-8)}`}</>;
}

export default React.memo(Address);
