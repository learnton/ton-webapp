import type { BaseStore } from "@zcloak/ui-store";
import type { CardBgInterface } from "@/types";

import Events from "eventemitter3";

import { CARD_BG_KEY } from "@/constant";

export class CredentialCard extends Events<"ready" | "store_changed"> {
  #store: BaseStore;
  #value: Map<string, CardBgInterface> = new Map();
  public isReady: Promise<this>;

  constructor(store: BaseStore) {
    super();

    this.#store = store;

    this.isReady = new Promise((resolve) => {
      this.once("ready", () => resolve(this));
    });

    void this.load().then(() => this.emit("ready"));
  }

  private async load() {
    let value = (await this.#store.get(
      CARD_BG_KEY as string
    )) as CardBgInterface[];

    if (value) {
      // replace png to webp background image
       
      value = value.map((item) => ({
        ...item,
         
        bg: /\.png$/.test(item.bg)
          ?  
            item.bg.replace(/\.png$/, ".webp")
          :  
            item.bg,
      }));
      await this.#store.set(CARD_BG_KEY as string, value);

      value.forEach((v) => {
        v?.rootHash && this.#value.set(v.rootHash, v);
      });
    }
  }

  public get(id: string): CardBgInterface | undefined {
    return this.#value.get(id);
  }

  public async store(value: CardBgInterface): Promise<void> {
    this.#value.set(value.rootHash, value);

    await this.#store.set(CARD_BG_KEY, Array.from(this.#value.values()));

    this.emit("store_changed", this.#value);
  }

  public async delete(id: string): Promise<void> {
    this.#value.delete(id);

    await this.#store.set(CARD_BG_KEY, Array.from(this.#value.values()));

    this.emit("store_changed", this.#value);
  }
}
