import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

import { LOCAL_STORAGE_KEY } from "../constants/key";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type AccessTokenResponse = {
  access_token?: string;
  accessToken?: string;
};

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

let reissuePromise: Promise<string | null> | null = null;

function extractAccessToken(data: unknown) {
  if (!data || typeof data !== "object") {
    return null;
  }

  const tokenResponse = data as AccessTokenResponse;
  return tokenResponse.access_token ?? tokenResponse.accessToken ?? null;
}

function clearStoredAuth() {
  window.localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
  window.localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
}

async function reissueAccessTokenOnce() {
  if (!reissuePromise) {
    reissuePromise = publicAxiosInstance
      .post("/api/auth/reissue", {})
      .then((response) => extractAccessToken(response.data))
      .finally(() => {
        reissuePromise = null;
      });
  }

  return reissuePromise;
}

function setAuthorizationHeader(config: RetriableRequestConfig, token: string) {
  const headers = AxiosHeaders.from(config.headers);
  headers.set("Authorization", `Bearer ${token}`);
  config.headers = headers;
}

function removeAuthorizationHeader(config: RetriableRequestConfig) {
  const headers = AxiosHeaders.from(config.headers);
  headers.delete("Authorization");
  config.headers = headers;
}

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
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    console.log("[axios response] 실패");
    console.log("[axios response] status:", error?.response?.status);
    console.log("[axios response] data:", error?.response?.data);

    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await reissueAccessTokenOnce();

      if (newAccessToken) {
        window.localStorage.setItem(
          LOCAL_STORAGE_KEY.accessToken,
          newAccessToken
        );
        setAuthorizationHeader(originalRequest, newAccessToken);
      } else {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
        removeAuthorizationHeader(originalRequest);
      }

      console.log("[axios response] 토큰 재발급 후 원래 요청 재시도");
      return axiosInstance(originalRequest);
    } catch (reissueError) {
      clearStoredAuth();
      console.log("[axios response] 토큰 재발급 실패:", reissueError);
      return Promise.reject(reissueError);
    }
  }
);
