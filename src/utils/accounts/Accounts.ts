/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import type { DidKeys$Json } from "@zcloak/did/keys/types";
import type { DidDocument } from "@zcloak/did-resolver/types";
import type { BaseStore } from "@zcloak/ui-store";
import type { AccountType } from "@/types";

import { base64Decode, base64Encode } from "@zcloak/crypto";
import { Did, helpers, keys } from "@zcloak/did";

import {
  APP_MNEMONIC_INDEX_KEY,
  APP_MNEMONIC_KEY,
  CURRENT_ACCOUNT_KEY,
  DID_PREFIX,
} from "@/constant";

import { AppKeyring } from "../keyring/AppKeyring";
import { mnemonicDecrypt, mnemonicEncrypt } from "../scrypt/mnemonic";
import { Account } from "./Account";
import { BaseAccounts } from "./BaseAccounts";

export class Accounts extends BaseAccounts {
  #store: BaseStore;

  #deriveIndex = 0;
  #encryptedMnemonic: string | null = null;

  public isReady: Promise<this>;

  constructor(store: BaseStore, keyring: AppKeyring) {
    super(keyring);
    this.#store = store;

    this.isReady = new Promise((resolve) => {
      this.once("ready", () => resolve(this));
    });

    void this.loadAll().then(() => this.emit("ready"));

    store.on("store_changed", (key: string, _, newVal) => {
      if (key.startsWith(DID_PREFIX as string)) {
        if (newVal) {
          const did = helpers.fromDidDocument(
            newVal as DidDocument,
            this.keyring
          );
          const account = new Account(did, this.#store);

          if (this.getAccount(account.id)) return;

          super.addAccount(account);
        } else {
          if (!this.getAccount(key)) return;

          void super.removeAccount(key);
        }
      } else if (key === CURRENT_ACCOUNT_KEY) {
        if (newVal) {
          if (this.current === newVal) return;

          super.setCurrent(newVal);
        } else {
          super.setCurrent(null);
        }
      } else if (key === APP_MNEMONIC_KEY) {
        if (newVal) {
          this.#encryptedMnemonic = newVal;
        } else {
          this.#encryptedMnemonic = null;
        }
      } else if (key === APP_MNEMONIC_INDEX_KEY) {
        if (newVal) {
          this.#deriveIndex = newVal;
        } else {
          this.#deriveIndex = 0;
        }
      }
    });
  }

  private loadAll(): Promise<void> {
    let current: string | null = null;
    const accounts: Account<AccountType>[] = [];

    return this.#store
      .each((key, value) => {
        if (key.startsWith(DID_PREFIX)) {
          const did = helpers.fromDidDocument(
            value as DidDocument,
            this.keyring
          );

          accounts.push(new Account(did, this.#store));
        } else if (key === CURRENT_ACCOUNT_KEY) {
          if (value) current = value as string;
        } else if (key === APP_MNEMONIC_KEY) {
          if (value) this.#encryptedMnemonic = value as string;
        } else if (key === APP_MNEMONIC_INDEX_KEY) {
          if (value) this.#deriveIndex = value as number;
        }
      })
      .then(() => Promise.all(accounts.map((account) => account.isReady)))
      .then((accounts) => {
        accounts.forEach((account) => super.addAccount(account));
      })
      .then(() => {
        current && this.getAccount(current) && super.setCurrent(current);
      });
  }

  public get deriveIndex(): number {
    return this.#deriveIndex;
  }

  public get encryptedMnemonic(): string | null {
    return this.#encryptedMnemonic;
  }

  public override setCurrent(id: string | null): void {
    super.setCurrent(id);
    void this.#store.set(CURRENT_ACCOUNT_KEY, id);
  }

  public override async addAccount(
    account: Account<AccountType>
  ): Promise<void> {
    super.addAccount(account);
    await account.store();
  }

  public async deriveAccount(alias?: string): Promise<Account<"zkid">> {
    if (!this.keyring.password) {
      throw new Error("Please unlock first");
    }

    if (!this.encryptedMnemonic) {
      throw new Error("Please init wallet and generate mnemonic");
    }

    const mnemonic = mnemonicDecrypt(
      base64Decode(this.encryptedMnemonic),
      this.keyring.password
    );
    const deriveIndex = this.deriveIndex;

    const did = keys.fromMnemonic(this.keyring, mnemonic, "ecdsa", deriveIndex);

    const account = new Account<"zkid">(did, this.#store);

    await account.storeMeta({
      import: false,
      deriveIndex,
      alias: alias || `Account ${deriveIndex + 1}`,
    });

    await this.addAccount(account);

    void this.#store.set(APP_MNEMONIC_INDEX_KEY, deriveIndex + 1);

    return account;
  }

  public async generate(
    mnemonic: string,
    alias?: string
  ): Promise<Account<"zkid">> {
    if (!this.keyring.password) {
      throw new Error("Please unlock first");
    }

    if (this.encryptedMnemonic) {
      throw new Error("Already generate mnemonic");
    }

    const encrypted = mnemonicEncrypt(mnemonic, this.keyring.password);

    await this.#store.set(APP_MNEMONIC_KEY, base64Encode(encrypted));
    await this.#store.set(APP_MNEMONIC_INDEX_KEY, 0);

    this.emit("generate");

    return this.deriveAccount(alias);
  }

  public async importDidFile(
    json: DidKeys$Json,
    password: string
  ): Promise<Account<"zkid">> {
    if (!this.keyring.password) {
      throw new Error("Please unlock first");
    }

    const did = keys.restore(this.keyring, json, password);

    const account = new Account<"zkid">(did, this.#store);

    await this.addAccount(account);

    return account;
  }

  public exportDidFile(id: string): DidKeys$Json {
    if (!this.keyring.password) {
      throw new Error("Please unlock first");
    }

    const account = this.getAccount(id);

    if (!account) {
      throw new Error(`Not find account with id: ${id}`);
    }

    if (account.type !== "zkid") {
      throw new Error(`Account: ${id} is not did account`);
    }

    const json = keys.backup(
      this.keyring,
      account.instance as Did,
      this.keyring.password
    );

    return json;
  }

  /**
   * @name resetMnemonic
   * @description
   * remove mnemonic and derive index, also remove the account derived by mnemonic
   */
  public async resetMnemonic(): Promise<void> {
    await this.#store.remove(APP_MNEMONIC_KEY);
    await this.#store.remove(APP_MNEMONIC_INDEX_KEY);

    for (const account of this.accounts) {
      if (account.meta.import) continue;
      await this.removeAccount(account.id);
    }
  }
}
