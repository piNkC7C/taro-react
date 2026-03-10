/// <reference types="@tarojs/taro" />

// 请求常量
declare namespace REQUEST {
  // 响应体
  interface IResponse<T = any> {
    success: boolean;
    data: T;
    msg: string;
    errMsg?: string; // 微信接口返回的错误信息（可选）
    errno?: number; // 微信接口返回的错误码（可选）
  }
  // 接口响应体
  interface IApiResponse<T = any> {
    code: number;
    data: T;
    msg: string;
  }
  // Taro 响应成功体
  interface ITaroResponseSuccess extends Taro.request.SuccessCallbackResult {
    config: IRequest; // 原始请求配置
    data: IApiResponse; // 接口响应数据（按业务约定结构化）
  }
  // Taro 响应失败体
  interface ITaroResponseFailure extends Taro.request.SuccessCallbackResult {
    errno?: number; // 错误码（可选）
  }
  // 拦截器
  interface IInterceptors {
    requestSuccessFn?: (config: IRequest) => IRequest;
    // 统一使用响应成功/失败两类拦截器：
    // 成功：按业务约定返回结构化 IResponse
    responseSuccessFn?: (res: ITaroResponseSuccess) => IResponse;
    // 失败：网络错误/超时等统一在此处理并返回结构化 IResponse
    responseFailureFn?: (err: ITaroResponseFailure) => IResponse;
  }
  // 请求体
  interface IRequest extends Taro.request.Option {
    shouldEncode?: 0 | 1; // 是否对参数进行编码（0: 不编码, 1: 编码）（默认 1: 编码）
    params?: Record<string, any>; // 请求参数（会根据 shouldEncode 自动编码）
    data?: Record<string, any>; // 请求体数据（POST/PUT 等）
    interceptors?: IInterceptors; // 单次请求拦截器
    // 允许携带自定义字段（例如在响应拦截器中需要访问原始请求配置）
    [key: string]: any;
  }
}
