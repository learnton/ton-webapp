// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from "react";

import { isDidUrl } from "@zcloak/did";
import { parseDid } from "@zcloak/did-resolver/parseDid";
import { DidUrl } from "@zcloak/did-resolver/types";

import { useAccountMeta } from "@/hooks";
import { useVid } from "../hooks/useVid";
import Address from "./Address";

interface Props {
  value?: string | undefined | null;
  showFull?: boolean;
  withMeta?: boolean;
  showVid?: boolean;
}

function AccountName({ showFull, showVid = false, value, withMeta }: Props) {
  const { vid } = useVid(showVid ? (value as DidUrl) : null);
  const [prefix, content] = useMemo(() => {
    if (isDidUrl(value)) {
      return ["did:zk:", parseDid(value).identifier];
    } else {
      return [null, value || ""];
    }
  }, [value]);
  const meta = useAccountMeta(value);

  return withMeta && meta?.alias ? (
    <>{meta.alias}</>
  ) : (
    <>
      {vid || (
        <>
          {prefix}
          <Address showFull={showFull} value={content} />
        </>
      )}
    </>
  );
}

export function AccountVid({
  value,
}: Omit<Props, "showFull" | "withMeta" | "showVid">) {
  const { vid } = useVid(value as DidUrl);

  return <>{vid}</>;
}

export default React.memo(AccountName);
