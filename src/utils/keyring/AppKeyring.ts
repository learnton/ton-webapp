/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from "@zcloak/crypto/types";
import type { KeyringPair, KeyringPair$Json } from "@zcloak/keyring/types";
import type { BaseStore } from "@zcloak/ui-store";

import { u8aEq, u8aToHex, u8aToU8a } from "@polkadot/util";

import { APP_KEYRING_STATE, PAIR_PREFIX } from "@/constant";

import { BaseKeyring } from "./BaseKeyring";

export class AppKeyring extends BaseKeyring {
  #store: BaseStore;
  #session: BaseStore;

  public isReady: Promise<this>;

  constructor(store: BaseStore, session: BaseStore) {
    super();
    this.#store = store;
    this.#session = session;

    this.isReady = new Promise((resolve) => {
      this.once("ready", () => resolve(this));
    });

    void this.loadAll().then(() => this.emit("ready"));

    session.on("store_changed", (key: string, _, newVal) => {
      if (key === APP_KEYRING_STATE) {
        if (newVal) {
          if (
            this.password === newVal.password &&
            this.expired === newVal.expired
          )
            return;
          super.unlock(newVal.password, newVal.expired);
        } else {
          if (!this.state) return;
          super.lock();
        }
      }
    });

    store.on("store_changed", (key: string, oldVal, newVal) => {
      if (key.startsWith(PAIR_PREFIX)) {
        if (newVal) {
          const pair = this.createFromJson(newVal as KeyringPair$Json);

          if (
            this.getPublicKeys().find((publicKey) =>
              u8aEq(publicKey, pair.publicKey)
            )
          )
            return;

          super.addPair(pair);
        } else {
          if (oldVal) {
            const pair = this.createFromJson(oldVal as KeyringPair$Json);

            if (!this.getPublicKeys().find((pbk) => u8aEq(pbk, pair.publicKey)))
              return;

            super.removePair(pair.publicKey);
          }
        }
      }
    });
  }

  private async loadAll(): Promise<void> {
    return this.loadPairs().then(() => this.loadState());
  }

  private loadPairs(): Promise<void> {
    return this.#store.each((key, val) => {
      if (key.startsWith(PAIR_PREFIX)) {
        const pair = this.createFromJson(val as KeyringPair$Json);

        super.addPair(pair);
      }
    });
  }

  private loadState(): Promise<void> {
    return this.#session.get(APP_KEYRING_STATE).then((value) => {
      if (value) {
        this.state = value as { password: string; expired: number };
      } else {
        this.state = null;
      }
    });
  }

  public override addPair(pair: KeyringPair): KeyringPair {
    if (!this.password) throw new Error("Please unlock wallet first");
    const _pair = super.addPair(pair);

    const json = _pair.toJson(this.password);

    void this.#store.set(`${PAIR_PREFIX}${u8aToHex(_pair.publicKey)}`, json);

    return _pair;
  }

  public override removePair(publicKey: Uint8Array | HexString): void {
    super.removePair(publicKey);
    void this.#store.remove(`${PAIR_PREFIX}${u8aToHex(u8aToU8a(publicKey))}`);
  }

  public override lock(): void {
    super.lock();
    void this.#session.remove(APP_KEYRING_STATE);
  }

  public override unlock(password: string, expired: number): void {
    super.unlock(password, expired);
    void this.#session.set(APP_KEYRING_STATE, { password, expired });
  }

  public override updateExpired(expired: number): void {
    if (!this.password) {
      throw new Error("Please unlock before update expired");
    }

    super.updateExpired(expired);
    void this.#session.set(APP_KEYRING_STATE, {
      password: this.password,
      expired,
    });
  }
}
