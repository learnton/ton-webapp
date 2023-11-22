import instance, { DID_SERVICE } from "./axiosInstance";

export const pageList = (params: {
  msgType?: string;

  page: number;

  receiver: `did:zk:${string}`;

  size?: string;
}) => {
  return instance.get(`/message/page`, { params, baseURL: DID_SERVICE });
};

export const all = (params: {
  msgType?: string;

  receiver: `did:zk:${string}`;
}) => {
  return instance.get(`/message`, { params, baseURL: DID_SERVICE });
};
