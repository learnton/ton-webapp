// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { KeypairType, KeyringPair, KeyringPair$Json } from '@zcloak/keyring/types';

export class WalletKeyringPair implements KeyringPair {
  #pair: KeyringPair;
  #getPassword: () => string | null;

  constructor(pair: KeyringPair, getPassword: () => string | null) {
    this.#pair = pair;
    this.#getPassword = getPassword;
  }

  private unlockRequired(): void {
    if (this.isLocked) {
      const password = this.#getPassword();

      if (password) {
        this.unlock(password);
      } else {
        throw new Error('Unlock wallet before sign encrypt decrypt');
      }
    }
  }

  public get isLocked(): boolean {
    return this.#pair.isLocked;
  }

  public get publicKey(): Uint8Array {
    return this.#pair.publicKey;
  }

  public get type(): KeypairType {
    return this.#pair.type;
  }

  public lock(): void {
    return this.#pair.lock();
  }

  public sign(message: Uint8Array | HexString): Uint8Array {
    this.unlockRequired();

    return this.#pair.sign(message);
  }

  toJson(passphrase?: string | undefined): KeyringPair$Json {
    this.unlockRequired();

    return this.#pair.toJson(passphrase);
  }

  unlock(passphrase?: string | undefined): void {
    this.#pair.unlock(passphrase);
  }

  encrypt(
    message: Uint8Array | HexString,
    recipientPublicKey: Uint8Array | HexString,
    nonce?: Uint8Array | HexString | undefined
  ): Uint8Array {
    this.unlockRequired();

    return this.#pair.encrypt(message, recipientPublicKey, nonce);
  }

  decrypt(encryptedMessageWithNonce: Uint8Array | HexString, senderPublicKey: Uint8Array | HexString): Uint8Array {
    this.unlockRequired();

    return this.#pair.decrypt(encryptedMessageWithNonce, senderPublicKey);
  }
}
