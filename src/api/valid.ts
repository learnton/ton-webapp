import instance, { VALID_SERVICE } from "./axiosInstance";
import { DidUrl } from "@zcloak/did-resolver/types";

export const validName = (params: { did: DidUrl | null }) => {
  return instance.post(`/api/valid_name/resolve`, params, {
    baseURL: VALID_SERVICE,
  });
};
