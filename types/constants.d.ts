/// <reference types="@tarojs/taro" />

// 路由常量
declare namespace CONS_ROUTE {
  // 路由枚举
  enum ROUTE_ENUM {
    INDEX = "INDEX", // 首页
  }
  // 路由项
  type IROUTE = {
    /** 路由路径 */
    path: string;
  };
  // 路由列表
  type ROUTE_LIST = Record<ROUTE_ENUM, IROUTE>;
}

// 本地存储常量
declare namespace CONS_STORAGE {
  enum STORAGE_ENUM {
    ACCESS_TOKEN = "ACCESS_TOKEN", // 登录 token
    REFRESH_TOKEN = "REFRESH_TOKEN", // 刷新令牌
    OPEN_ID = "OPEN_ID", // 微信openId
  }
  type STORAGE_LIST = Record<STORAGE_ENUM, string>;
}

