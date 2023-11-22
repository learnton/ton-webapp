import type { DidDocument } from "@zcloak/did-resolver/types";
import type { BaseStore } from "@zcloak/ui-store";
import type { AccountInstance, AccountMeta, AccountType } from "@/types";

import Events from "eventemitter3";

import { Did } from "@zcloak/did";

import { ACCOUNT_META_PREFIX } from "@/constant";

export class Account<
  T extends AccountType,
  Instance extends AccountInstance<T> = AccountInstance<T>
> extends Events<"meta_changed" | "stored" | "unstored"> {
  #store: BaseStore;
  #meta: AccountMeta = {
    import: true,
  };

  public instance: Instance;
  public isReady: Promise<this>;

  constructor(instance: Instance, store: BaseStore) {
    super();

    this.#store = store;
    this.instance = instance;

    this.isReady = new Promise((resolve) => {
      void this.#store
        .get(this.metaKey)
        .then((value) => {
          if (value) {
            this.#meta = value as AccountMeta;
          }
        })
        .then(() => resolve(this));
    });
  }

  private get metaKey(): string {
    return `${ACCOUNT_META_PREFIX}${this.id}`;
  }

  private get storeKey(): string {
    return this.id;
  }

  private get stored(): Promise<boolean> {
    return this.#store.get(this.storeKey).then((value) => {
      return !!value;
    });
  }

  private get storeValue(): DidDocument | null {
    if (this.instance instanceof Did) {
      return this.instance.getDocument();
    } else {
      return null;
    }
  }

  public get id(): string {
    if (this.instance instanceof Did) {
      return this.instance.id;
    } else {
      // TODO support nostr
      return "nostr:key:null";
    }
  }

  public get type(): T {
    if (this.instance instanceof Did) {
      return "zkid" as T;
    } else {
      return "nostr" as T;
    }
  }

  public get meta(): AccountMeta {
    return this.#meta;
  }

  public async store(): Promise<void> {
    if (!(await this.stored)) {
      await this.#store.set(this.storeKey, this.storeValue);

      this.emit("stored");
    }
  }

  public async remove(): Promise<void> {
    await this.#store.remove(this.storeKey);
    await this.#store.remove(this.metaKey);

    this.emit("unstored");
  }

  public async storeMeta(meta: AccountMeta): Promise<void> {
    this.#meta = meta;

    await this.#store.set(this.metaKey, meta);

    this.emit("meta_changed", meta);
  }
}
