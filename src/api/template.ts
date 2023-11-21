import instance from "./axiosInstance";

export type Request = {
  id?: number;
};

export const get = (params: Request) => {
  return instance.get(`/api/template`, { params });
};
