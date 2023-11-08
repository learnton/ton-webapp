import instance from "./axiosInstance";

export const login = (params: { username: string; password: string }) => {
  return instance.post(`/api/login`, params).then(() => {
    instance.defaults.headers.common["Authorization"] = "test-token";
  });
};

export const get = (params: { id: string }) => {
  return instance.post(`/api/get`, params);
};

export const add = (params: { id: string }) => {
  return instance.post(`/api/add`, params);
};

export const edit = (params: { id: string }) => {
  return instance.put(`/api/get`, params);
};

export const remove = (params: { id: string }) => {
  return instance.delete(`/api/add`, { params });
};
