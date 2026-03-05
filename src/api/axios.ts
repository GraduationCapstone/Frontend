import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export const publicAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  withCredentials: true,
  timeout: 15000,
});

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  withCredentials: true,
  timeout: 15000,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 응답 인터셉터: 초기설정 단계에서는 공통 에러만 통과
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (!status) return Promise.reject(error);
    return Promise.reject(error);
  }
);