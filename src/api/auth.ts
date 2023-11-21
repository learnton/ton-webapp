import instance from "./axiosInstance";

export const bind = (params: { onChainAddress: string; didUrl: string }) => {
  return instance.post(`/api/telegram/account/did/bind`, params);
};

export const login = () => {
  return instance.post(`/api/login/telegram`);
};
