import instance, { DID_SERVICE } from "./axiosInstance";
import { DidUrl } from "@zcloak/did-resolver/types";

export const getDidDocument = (params: { did: DidUrl }) => {
  return instance.get(`/did/${params.did}`, {
    baseURL: DID_SERVICE,
  });
};

export const createDid = (params: Record<string, unknown>) => {
  return instance.post(`/did/`, params, {
    baseURL: DID_SERVICE,
  });
};

export type Request = {
  /**
   * ctypeHash，支持模糊查询
   */
  id?: string;
  /**
   * 支持模糊查询
   */
  title?: string;
};
export const getCTypes = (params?: Request) => {
  return instance.get(`/ctype`, { params, baseURL: DID_SERVICE });
};
