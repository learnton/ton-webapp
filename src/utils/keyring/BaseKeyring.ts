// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { KeyringPair } from '@zcloak/keyring/types';

import Events from 'eventemitter3';

import { Keyring } from '@zcloak/keyring';

import { WalletKeyringPair } from './WalletKeyringPair';

type EventTypes = 'ready' | 'unlock' | 'update' | 'lock' | 'add_pair' | 'remove_pair';

type KeyringState = {
  password: string;
  expired: number;
};

export abstract class BaseKeyring extends Keyring {
  protected state: KeyringState | null = null;

  #events = new Events<EventTypes>();
  #timer?: any;

  public get password(): string | null {
    return this.state ? this.state.password : null;
  }

  public get expired(): number | null {
    return this.state ? this.state.expired : null;
  }

  public override addPair(pair: KeyringPair): KeyringPair {
    const _pair = super.addPair(new WalletKeyringPair(pair, () => this.password));

    this.emit('add_pair');

    return _pair;
  }

  public override removePair(publicKey: Uint8Array | HexString): void {
    super.removePair(publicKey);
    this.emit('remove_pair');
  }

  public lock(): void {
    this.state = null;
    this.getPairs().forEach((pair) => pair.lock());
    this.emit('lock');
    clearTimeout(this.#timer);
  }

  public unlock(password: string, expired: number): void {
    this.state = {
      password,
      expired
    };
    this.getPairs().forEach((pair) => pair.unlock(password));
    this.emit('unlock');
  }

  public updateExpired(expired: number): void {
    if (!this.state?.password) {
      throw new Error('Please unlock before update expired');
    }

    this.state.expired = expired;
    this.emit('update');
  }

  /** events */
  public emit(event: EventTypes, ...args: unknown[]): void {
    this.#events.emit(event, ...args);
  }

  public on(event: EventTypes, fn: (...args: unknown[]) => void): void {
    this.#events.on(event, fn);
  }

  public once(event: EventTypes, fn: (...args: unknown[]) => void): void {
    this.#events.once(event, fn);
  }

  public off(event: EventTypes, fn: (...args: unknown[]) => void): void {
    this.#events.off(event, fn);
  }
}
