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

axiosInstance.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("[axios request] Authorization 헤더 추가됨");
  } else {
    console.log("[axios request] accessToken 없어서 Authorization 헤더 없음");
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("[axios response] 성공");
    console.log("[axios response] status:", response.status);
    console.log("[axios response] data:", response.data);
    return response;
  },
  (error) => {
    console.log("[axios response] 실패");
    console.log("[axios response] status:", error?.response?.status);
    console.log("[axios response] data:", error?.response?.data);
    return Promise.reject(error);
  }
);