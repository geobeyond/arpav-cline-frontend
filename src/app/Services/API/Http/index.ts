import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { BACKEND_API_URL } from '../../../../utils/constants';

import { getCookie, removeCookie } from '../../../../utils/cookie';

declare module 'axios' {
  interface AxiosResponse<T = any> extends Promise<T> {}
}

abstract class HttpClient {
  protected readonly instance: AxiosInstance;

  public constructor(AxiosConf: AxiosRequestConfig) {
    this.instance = axios.create(AxiosConf);
    this._initializeResponseInterceptor();
  }

  private _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError,
    );
  };

  private _handleResponse = ({ data }: AxiosResponse) => data;

  protected _handleError = (error: any) => {
    if (
      error?.response?.status === 401 &&
      error?.response?.data?.message === 'Unauthenticated.'
    ) {
      if (getCookie('AuthToken')) {
        removeCookie('AuthToken');
        if (window) window.location.reload();
      }
    }
    return Promise.reject(error);
  };
}

const AxiosConf: AxiosRequestConfig = {
  baseURL: BACKEND_API_URL,
};

export class Http extends HttpClient {
  // protected static classInstance?: Http;

  public constructor() {
    super(AxiosConf);
    this._initializeRequestInterceptor();
  }

  private _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(
      this._handleRequest,
      this._handleError,
    );
  };

  private _handleRequest = (config: AxiosRequestConfig) => {
    const token = getCookie('AuthToken');
    // console.log('token _handleRequest', token)
    if (typeof token === 'string') {
      // @ts-ignore
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  };
}
