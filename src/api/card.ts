import instance, { CARD_SERVICE } from "./axiosInstance";
import { HexString } from "@zcloak/crypto/types";
import type { Message, MessageType } from "@zcloak/message/types";

export const getCtype = (params: { id: HexString }) => {
  return instance.get(`/api/ctype`, { params, baseURL: CARD_SERVICE });
};

export const postMessage = (params: {
  msg?: Message<MessageType> | null;
  templateId?: number | null;
}) => {
  return instance.post(`/api/message`, { params, baseURL: CARD_SERVICE });
};
