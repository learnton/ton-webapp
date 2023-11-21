import instance from "./axiosInstance";

export const pageList = (params: {
  msgType?: string;

  page: number;

  receiver: `did:zk:${string}`;

  size?: string;
}) => {
  return instance.get(`/api/message/page`, { params });
};

export const all = (params: {
  msgType?: string;

  receiver: `did:zk:${string}`;
}) => {
  return instance.get(`/api/message`, { params });
};
