// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from "@zcloak/crypto/types";

import React, { useMemo } from "react";

import {
  CredentialSubject,
  NativeType,
  NativeTypeWithOutNull,
} from "@zcloak/vc/types";

import { national } from "@/utils";

import { useCtype } from "../hooks";
import AccountName from "./AccountName";

export const ClaimContent = ({
  contents,
  ctype,
}: {
  ctype: HexString;
  contents: CredentialSubject;
}) => {
  const local = useCtype(ctype);

  const keyLength = useMemo(() => {
    return Object.keys(contents).length;
  }, [contents]);

  return (
    <>
      {Object.entries(contents).map(([k, v], idx) => {
        return (
          <div className="font-rubik" key={k}>
            <ContentItem
              format={local?.properties?.[k]?.format}
              label={k}
              val={v}
            />
            <DividerItem keyLength={keyLength} now={idx} />
          </div>
        );
      })}
    </>
  );
};

const DividerItem = ({
  keyLength,
  now,
}: {
  keyLength: number;
  now: number;
}) => {
  return (
    <>
      {keyLength > 0 && now !== keyLength - 1 ? (
        <div className="border-t border-white h-[0px]"></div>
      ) : (
        <></>
      )}
    </>
  );
};

const ContentItem = ({
  format,
  label,
  val,
}: {
  label: string;
  val: NativeType | NativeTypeWithOutNull[];
  format?: string; // 'date' | 'time' | 'date-time' | 'url' | 'email' | 'hostname' | 'ipv4' | 'ipv6' | 'int32' | 'int64' | 'uint32' | 'uint64' | 'float' | 'double' | 'bytes' | 'hex' | 'did' | 'timestamp' | 'national-code'
}) => {
  const el = useMemo(() => {
    if (val && React.isValidElement(val)) {
      return val;
    }

    const type = typeof val;

    if (["string", "number", "undefined"].includes(type)) {
      if (format === "timestamp") {
        return <>{new Date(Number(val)).toLocaleString()}</>;
      } else if (format === "did") {
        return <AccountName showVid value={val as string} />;
      } else if (format === "national-code") {
        const finded = national[val?.toString() || ""];

        return <>{finded ? finded.name : JSON.stringify(val)}</>;
      }

      return <>{val}</>;
    } else if (typeof val === "boolean") {
      return (
        <div className="rounded flex items-center justify-center">
          {val ? "True" : "False"}
        </div>
      );
    } else {
      return <>{JSON.stringify(val)}</>;
    }
  }, [format, val]);

  return (
    <div className="flex p-2 items-center justify-between">
      <div className="text-sm text-text2">{label}</div>
      <div className="font-semibold text-right">{el}</div>
    </div>
  );
};

export default ClaimContent;
