// @ts-ignore
import type { IResponse } from "@/models/IResponse";
import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

const defaultConfig: AxiosRequestConfig = {
    timeout: 3000,
    headers: {
        "Content-Type": "application/json"
    }
};

export class Request {
    private instance: AxiosInstance;
    public static token: string;

    constructor(config: AxiosRequestConfig = defaultConfig) {
        this.instance = axios.create(config);

        this.instance.interceptors.request.use(
            (config) => {
                config.headers.Authorization = "Bearer " + Request.token;
                return config;
            }
        )
    }

    /**
     * 设置请求的令牌
     * @param token 请求令牌
     */
    public static setAuthorizationToken(token : string) {
        Request.token = token;
    }

    public get<T>(url: string): Promise<IResponse<T>> {
        return new Promise( async (resolve) => {
            const response = await this.instance.get<IResponse<T>>(url);

            resolve(response.data);
        });
    }

    public async post<T>(url: string, data: any): Promise<IResponse<T>> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.instance.post<IResponse<T>>(url, data);
                resolve(response.data);
            } catch(err) {
                reject(err);
            }
        });
    }

    public put<T>(url: string, data: any): Promise<IResponse<T>> {
       return new Promise(async (resolve, reject) => {
           try {
            const response = await this.instance.put<IResponse<T>>(url, data);
            resolve(response.data);
           } catch(err) {
            reject(err);
           }
       });
    }

    public delete<T>(url: string): Promise<IResponse<T>> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.instance.delete<IResponse<T>>(url);
                resolve(response.data);
            } catch(err) {
                reject(err);
            }
        });
    }
}

/**
 * 从Axios中提取服务器返回的错误信息
 * @param error 收到的错误
 */
export function axiosErrorHandler<T>(error: any): string {
    const axiosError = error as AxiosError<IResponse<T>>;

    if (error.response?.status != undefined
        && error.response.status >= 400 && error.response.status < 500) {
            // 返回了有效的错误码
            if (error.response.data.message != undefined) {
                return error.response.data.message;
            }
        }
    
    return "服务器错误，请联系管理员";
}

