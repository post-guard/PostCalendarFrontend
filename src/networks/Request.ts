// @ts-ignore
import type { IResponse } from "@/models/IResponse";
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
       return new Promise(async (resolve) => {
            const response = await this.instance.put<IResponse<T>>(url, data)
            .catch(err => {throw err});

            resolve(response.data);
       });
    }

    public delete<T>(url: string): Promise<IResponse<T>> {
        return new Promise(async (resolve) => {
            const response = await this.instance.delete<IResponse<T>>(url)
            .catch(err => {throw err});

            resolve(response.data);
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

