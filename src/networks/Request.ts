// @ts-ignore
import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

const defaultConfig: AxiosRequestConfig = {
    timeout: 3000,
    headers: {
        "Content-Type": "application/json"
    }
};

export class Request {
    instance: AxiosInstance;

    constructor(config: AxiosRequestConfig = defaultConfig) {
        this.instance = axios.create(config);
    }

    public get<T>(url: string): Promise<T> {
        return new Promise((resolve) => {
            this.instance.get<T>(url).then((response) => {
                return resolve(response.data);
            });
        });
    }

    public post<T>(url: string, data: any): Promise<T> {
        return new Promise<T>((resolve) => {
            this.instance.post<T>(url, data).then((response) => {
                return resolve(response.data);
            });
        });
    }

    public put<T>(url: string, data: any): Promise<T> {
        return new Promise<T>((resolve) => {
            this.instance.put<T>(url, data).then((response) =>{
                return resolve(response.data);
            });
        });
    }

    public delete<T>(url: string): Promise<T> {
        return new Promise<T>((resolve) => {
            this.instance.delete<T>(url).then((response) => {
                return resolve(response.data);
            });
        });
    }

    public setAuthorization(token: string): void {
        this.instance.interceptors.request.use(
            (config) => {
                config.headers.Authorization = token;

                return config;
            }
        );
    }


}

