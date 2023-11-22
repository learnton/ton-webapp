// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  RpcEventTypes,
  RpcMethods,
  RpcRequest,
  RpcResponse,
  TransportEventMessage,
  TransportRequestMessage,
  TransportResponseMessage,
} from "@zcloak/login-rpc";

import {
  isTransportEventMessage,
  isTransportResponseMessage,
} from "@zcloak/login-rpc";

import { eventHandler, port1 } from "@/utils";

type Handlers = Record<
  string,
  {
    resolve: (data: RpcResponse<RpcMethods>) => void;
    reject: (error: Error) => void;
  }
>;

let increaseId = 0;

const handlers: Handlers = {};

port1.addEventListener("message", handleMessage);

function handleMessage({
  data,
}: MessageEvent<
  TransportResponseMessage<RpcMethods> | TransportEventMessage<RpcEventTypes>
>) {
  if (isTransportEventMessage(data)) {
    // event transport message

    eventHandler.emit(data.event, data.data);
  } else if (isTransportResponseMessage(data)) {
    // response transport message

    const handler = handlers[data.id];

    if (!handler) {
      console.error(`Unknown response: ${JSON.stringify(data)}`);

      return;
    }

    delete handlers[data.id];

    if (data.error) {
      handler.reject(new Error(data.error.message));
    } else {
      handler.resolve(data.result);
    }
  }
}

export function sendMessage<Method extends RpcMethods>(
  method: Method,
  params: RpcRequest<Method>
): Promise<RpcResponse<Method>> {
  return new Promise((resolve, reject) => {
    const id = `${Date.now()}.${increaseId++}`;

    handlers[id] = { reject, resolve };

    const message: TransportRequestMessage<Method> = {
      jsonrpc: "2.0",
      id,
      method,
      params,
    };

    port1.postMessage(message);
  });
}
