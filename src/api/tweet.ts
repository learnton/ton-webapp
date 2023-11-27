import instance, { TWEET_SERVICE } from "./axiosInstance";

export const generateImage: (params: {
  template: string;
  data: unknown;
  width: number;
  height: number;
  imageElement: string;
}) => Promise<Blob> = (params) => {
  return instance.post(`/puppeteer/generate_image`, params, {
    baseURL: TWEET_SERVICE,
  });
};
