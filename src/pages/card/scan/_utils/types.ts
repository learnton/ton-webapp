// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from "react";
import type { DidKeys$Json } from "@zcloak/did/keys/types";
import type { VerifiablePresentation } from "@zcloak/vc/types";

import { VpWithTemplate } from "../../_components/QrcodePresentation";

export interface BaseInputProps<T> {
  defaultValue?: T;
  value?: T;
  disabled?: boolean;
  label?: React.ReactNode;
  error?: Error | null;
  autoFocus?: boolean;
  enterKeyHint?:
    | "enter"
    | "done"
    | "go"
    | "next"
    | "previous"
    | "search"
    | "send";
  placeholder?: string;
  withBorder?: boolean;
  type?: string;
  fullWidth?: boolean;
  size?: "medium" | "small";
  endAdornment?: React.ReactNode;
  startAdornment?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
  autoComplete?:
    | "on"
    | "off"
    | "name"
    | "email"
    | "username"
    | "current-password"
    | "new-password";
  tabIndex?: number;
  onChange?: (value: T) => void;
  onKeyDown?: React.KeyboardEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
  onKeyUp?: React.KeyboardEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement | HTMLInputElement>;
}

export type InputPasswordProps = BaseInputProps<string>;
export type InputURLProps = BaseInputProps<string> & {
  onScanSuccess?: (value: string) => void;
};
export type InputStringProps = BaseInputProps<string>;
export type InputBoolProps = BaseInputProps<boolean>;
export type InputNumberProps = BaseInputProps<number>;

export interface QrResult {
  raw: string;
  url: string;
  vp: VerifiablePresentation | VpWithTemplate;
  keys: DidKeys$Json;
  parts: string[];
}

export type QrResultTypes = keyof QrResult;

export interface QrHandleResult {
  (type: QrResultTypes, result: QrResult[QrResultTypes]): void;
}

export interface QrScannerProps {
  onClose: () => void;
  onResult: QrHandleResult;
}
