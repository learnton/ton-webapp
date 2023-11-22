// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RpcEvents } from '@zcloak/login-rpc';

import EventEmitter from 'eventemitter3';

interface AppEvents extends RpcEvents {
  APP_INSTALLED: null;
  APP_UPDATED: null;
}

class EventHandler {
  #eventemitter: EventEmitter;

  constructor() {
    this.#eventemitter = new EventEmitter();
  }

  public emit<T extends keyof AppEvents>(type: T, params: AppEvents[T]): boolean {
    return this.#eventemitter.emit(type, params);
  }

  public on<T extends keyof AppEvents>(type: T, handler: (params: AppEvents[T]) => any): this {
    this.#eventemitter.on(type, handler);

    return this;
  }

  public off<T extends keyof AppEvents>(type: T, handler: (params: AppEvents[T]) => any): this {
    this.#eventemitter.removeListener(type, handler);

    return this;
  }

  public once<T extends keyof AppEvents>(type: T, handler: (params: AppEvents[T]) => any): this {
    this.#eventemitter.once(type, handler);

    return this;
  }
}
export const eventHandler = new EventHandler();
