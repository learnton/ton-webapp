import axios from "axios";

// 各环境BaseURL配置
const ENVIRONMENT = {
  dev: "https://card-service.zkid.xyz",
  test: "http://test.com/api",
  master: "https://card-service.zkid.app",
};

// 域名与环境映射关系
const HASH: Record<string, string> = {
  "dev.com": ENVIRONMENT.dev,
  "test.com": ENVIRONMENT.test,
  "legit3.id": ENVIRONMENT.master,
};

// 创建请求实例
const instance = axios.create({
  baseURL: HASH[window.location.host] || ENVIRONMENT.dev,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 响应后处理
instance.interceptors.response.use(
  function (response) {
    // if (response?.data?.code !== 200) {
    //   throw new Error(response?.data?.msg);
    // } else {
    //   return response.data;
    // }
    return response.data;
  },
  function (error) {
    return catchError(error);
  }
);

/**
 * 请求错误处理
 */
const catchError = function (error: any) {
  //原生错误对象
  if (error.response) {
    // that falls out of the range of 2xx
    switch (error.response.status) {
      case 400:
        break;
      case 401:
        break;
      case 403:
        break;
      default:
    }
  } else if (error.message) {
    // Something happened in setting up the request that triggered an Error
    let message = error.message;
    if (message.indexOf("timeout") > -1) {
      message = "请求超时, 请重试";
    } else if (message.indexOf("Network") > -1) {
      message = "网络异常";
    } else if (message.indexOf("canceled") > -1) {
      // 请求取消
    } else {
    }
    console.warn(message);
  }

  return Promise.reject(error);
};

export default instance;
