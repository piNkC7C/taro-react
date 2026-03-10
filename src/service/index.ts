import Taro from "@tarojs/taro";
import * as reqConfig from "./config";
import request from "./request";
import { refreshToken } from "@/utils/auth";
import * as storageUtil from "@/utils/storage";

// 刷新中状态与等待队列
let isRefreshing = false;
interface PendingRequest {
  config: REQUEST.IRequest;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  requestInstance: request;
}
const waitQueue: PendingRequest[] = [];

const handleTokenRefresh = async (
  originalRequest: REQUEST.IRequest,
  requestInstance: request,
) => {
  return new Promise((resolve, reject) => {
    // 进入等待队列
    waitQueue.push({
      config: originalRequest,
      resolve,
      reject,
      requestInstance,
    });

    if (isRefreshing) return;
    isRefreshing = true;

    refreshToken()
      .then((newToken) => {
        storageUtil.setAccessToken(newToken);
        // 重试队列中的请求
        waitQueue.forEach(({ config, resolve, reject, requestInstance }) => {
          config.headers = config.headers || {};
          config.headers["Authorization"] = `Bearer ${newToken}`;
          requestInstance.request(config).then(resolve).catch(reject);
        });
        waitQueue.length = 0;
      })
      .catch((error) => {
        // 刷新失败，清除 token 并提示
        storageUtil.removeAccessToken();
        storageUtil.removeRefreshToken();
        waitQueue.forEach(({ resolve }) =>
          resolve({
            success: false,
            data: null,
            msg: "刷新 token 失败",
          }),
        );
        waitQueue.length = 0;
      })
      .finally(() => {
        isRefreshing = false;
      });
  });
};

const createRequest = (baseURL: string, shouldEncode?: 0 | 1) => {
  const requestInstance = new request({
    baseURL,
    timeout: reqConfig.TIME_OUT,
    shouldEncode,
    interceptors: {
      // 请求拦截：自动携带 token、租户信息
      requestSuccessFn(config) {
        config.headers = config.headers || {};
        config.headers["tenant-id"] = "1";
        const token = storageUtil.getAccessToken();
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      // 响应拦截：统一结构化返回，并处理 401
      responseSuccessFn(response) {
        const res = response.data;
        switch (res.code) {
          case 0:
            return {
              ...res,
              success: true,
            };
          case 401:
            // 进入刷新逻辑
            return handleTokenRefresh(response.config, requestInstance) as any;
          default:
            Taro.showToast({ title: res.msg || "接口响应失败", icon: "none" });
            return {
              ...res,
              success: false,
            };
        }
      },
      responseFailureFn(error) {
        console.log("接口响应失败", error);
        Taro.showToast({ title: error.errMsg || "接口响应失败", icon: "none" });
        return {
          success: false,
          data: null,
          msg: error.errMsg || "接口响应失败",
          errMsg: error.errMsg || "接口响应失败",
          errno: error.errno || 0,
        };
      },
    },
  });

  return requestInstance;
};

// 默认应用端请求实例
const appRequest = createRequest(reqConfig.BASE_URL + reqConfig.APP_URL);

export { appRequest };
