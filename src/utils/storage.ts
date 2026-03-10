import Taro from "@tarojs/taro"
import { LOCAL_STORAGE_NAME } from "@/constants"

// 获取accessToken
export const getAccessToken = () => {
    return Taro.getStorageSync(LOCAL_STORAGE_NAME.ACCESS_TOKEN)
}

// 设置accessToken
export const setAccessToken = (token: string) => {
    Taro.setStorageSync(LOCAL_STORAGE_NAME.ACCESS_TOKEN, token)
}

// 删除accessToken
export const removeAccessToken = () => {
    Taro.removeStorageSync(LOCAL_STORAGE_NAME.ACCESS_TOKEN)
}

// 获取refreshToken
export const getRefreshToken = () => {
    return Taro.getStorageSync(LOCAL_STORAGE_NAME.REFRESH_TOKEN)
}

// 设置refreshToken

export const setRefreshToken = (refreshToken: string) => {
    Taro.setStorageSync(LOCAL_STORAGE_NAME.REFRESH_TOKEN, refreshToken)
}

// 删除refreshToken
export const removeRefreshToken = () => {
    Taro.removeStorageSync(LOCAL_STORAGE_NAME.REFRESH_TOKEN)
}

// 获取openId
export const getOpenId = () => {
    return Taro.getStorageSync(LOCAL_STORAGE_NAME.OPEN_ID)
}

// 设置openId
export const setOpenId = (openId: string) => {
    Taro.setStorageSync(LOCAL_STORAGE_NAME.OPEN_ID, openId)
}
