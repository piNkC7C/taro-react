import  * as storageUtil from "./storage";
import { refreshTokenAPI } from "@/api/login";

// 刷新token的API调用
export const refreshToken = async () => {
  try {
    const refreshToken = storageUtil.getRefreshToken();
    if (!refreshToken) {
      throw new Error("没有刷新令牌");
    }
    const result = await refreshTokenAPI(refreshToken);
    if (result.success) {
      // 保存新的token
      storageUtil.setRefreshToken(result.data.refreshToken);
      storageUtil.setAccessToken(result.data.accessToken);
      return result.data.accessToken;
    } else {
      throw new Error(result.errMsg || "刷新令牌失败");
    }
  } catch (error) {
    // console.log("刷新token失败:", error);
    throw error;
  }
};
