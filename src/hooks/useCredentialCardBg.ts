// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CardBgInterface } from "@/types";

import { useContext, useEffect, useState } from "react";

import { cardBgConfig } from "@/components";
import { AppContext } from "@/context/AppProvider";

export function useCredentialCardBg(
  rootHashOrId?: string
): CardBgInterface | undefined {
  const { credentialCard } = useContext(AppContext);
  const [cardBg, setCardBg] = useState<CardBgInterface>();

  useEffect(() => {
    rootHashOrId && setCardBg(credentialCard.get(rootHashOrId));
  }, [rootHashOrId, credentialCard]);

  useEffect(() => {
    const onChange = () => {
      rootHashOrId && setCardBg(credentialCard.get(rootHashOrId));
    };

    credentialCard.on("store_changed", onChange);

    return () => {
      credentialCard.off("store_changed", onChange);
    };
  }, [credentialCard, rootHashOrId]);

  return (
    cardBg || {
      rootHash: rootHashOrId || "",
      bg: cardBgConfig[0].bg,
    }
  );
}
