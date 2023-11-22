// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountType } from "@/types";

import Events from "eventemitter3";

import { Did, keys } from "@zcloak/did";

import { AppKeyring } from "../keyring/AppKeyring";
import { Account } from "./Account";

type EventTypes = "ready" | "add" | "remove" | "current_changed" | "generate";

export abstract class BaseAccounts extends Events<EventTypes> {
  #accounts: Map<string, Account<AccountType>> = new Map();
  protected keyring: AppKeyring;
  public current: Account<AccountType> | null = null;

  constructor(keyring: AppKeyring) {
    super();

    this.keyring = keyring;
  }

  public get accounts(): Account<AccountType>[] {
    const _accounts = Array.from(this.#accounts.values());

    const imported: Account<AccountType>[] = [];
    const derived: Account<AccountType>[] = [];

    _accounts.forEach((account) => {
      if (account.meta.import) {
        imported.push(account);
      } else {
        derived.push(account);
      }
    });

    derived.sort(
      (l, r) => (l.meta.deriveIndex || 0) - (r.meta.deriveIndex || 0)
    );

    return derived.concat(imported);
  }

  public setCurrent(id: string | null): void {
    if (!id) {
      this.current = null;
    } else {
      const account = this.#accounts.get(id);

      if (!account) throw new Error(`Not find account with id: ${id}`);

      this.current = account;
    }

    this.emit("current_changed", id, this.current);
  }

  public addAccount(account: Account<AccountType>): void {
    this.#accounts.set(account.id, account);
    this.emit("add", account);
  }

  public async removeAccount(id: string): Promise<void> {
    const account = this.getAccount(id);

    if (account) {
      // remove pair
      if (account.instance instanceof Did) {
        const identifierPair = keys.getEcdsaIdentifierPair(
          this.keyring,
          account.instance
        );

        if (identifierPair) {
          this.keyring.removePair(identifierPair.publicKey);
        }

        Array.from(account.instance.keyRelationship.values()).forEach(
          ({ publicKey }) => {
            this.keyring.removePair(publicKey);
          }
        );
      }

      this.#accounts.delete(id);
      await account.remove();
      this.emit("remove", id);
    }
  }

  public getAccount(id: string): Account<AccountType> | undefined | null {
    return this.#accounts.get(id);
  }
}
