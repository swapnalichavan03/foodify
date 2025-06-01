import axiosNative, { AxiosResponse, AxiosError, RawAxiosResponseHeaders, InternalAxiosRequestConfig, AxiosResponseHeaders, AxiosInstance } from 'axios';
import { StorageManager } from '../helpers/localstorage/StorageManager';
import { Alert } from 'react-native';

export const AXIOS = () => {
    const API: AxiosInstance = axiosNative.create({
        // baseURL: "http://localhost:8080/customer/api/v1",
        baseURL: "https://foodify-server-kappa.vercel.app/customer/api/v1",
        // baseURL: "http://192.168.31.188:8080/customer/api/v1",
        timeout: 10000,
    });

    API.interceptors.request.use(async function (config) {
        const controller = new AbortController();
        const token = await StorageManager.getToken();

        try {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                config.headers.Accept = 'application/json, text/plain, */*';
            } else {
                config.headers.Accept = 'application/json, text/plain, */*';
                config.headers["content-type"] = 'application/json';
            }

            // console.log("Headers",config.headers)
            return { ...config, signal: controller.signal }
        } catch (error) {
            return Promise.reject(error);
        }
    });

    API.interceptors.response.use((response: AxiosResponse<any, any>) => {

        const modifiedResponse: AxiosResponse<any, any> = {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            config: response.config
        };
        return Promise.resolve(modifiedResponse);
    }, function (error: AxiosError<any, any>) {
        if (error?.response?.status === 401) {

        } else if (error?.message === "Network Error") {
            Alert.alert("Network Error")
        } else if (error?.response?.status === 400) {

        } else if (error?.response?.status === 403) {

        } else if (error?.response?.status === 404) {

        } else if (error?.response?.status === 405) {

        } else if (error?.response?.status === 500) {

        }

        // const modifiedError: AxiosError<any, any> = {
        //   data: error?.response?.data,
        //   status: error?.response?.status,
        //   statusText: error?.response?.statusText,
        //   headers: error?.response?.headers,
        //   config: error?.response?.config
        // };
        return Promise.reject(error);
    });
    return API;
}

export const axiosInstance = AXIOS();