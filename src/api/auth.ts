import { axiosInstance, publicAxiosInstance } from "./axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export function extractAccessTokenFromUrl(search: string) {
  const params = new URLSearchParams(search);

  return params.get("access_token");
}

export function saveAccessToken(accessToken: string) {
  localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, accessToken);
}

export function clearAccessToken() {
  localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
}

export function clearAuthStorage() {
  localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
  localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
}

export async function reissueAccessToken() {
  const response = await publicAxiosInstance.post("/api/auth/reissue", {});
  const accessToken =
    response.data?.access_token ?? response.data?.accessToken;

  if (!accessToken) {
    throw new Error("No access_token from reissue");
  }

  return accessToken;
}

// 로그아웃 (서버가 Set-Cookie로 refresh/access/JSESSIONID 만료 처리해줘야 함)
export async function logout() {
  const response = await axiosInstance.post("/api/auth/logout", {});
  if (response.status === 204 || response.status === 200) {
    clearAuthStorage();
  }
  return response;
}

// 회원 탈퇴
export async function deleteMyAccount() {
  const response = await axiosInstance.delete("/api/auth/delete", {});
  if (response.status === 204 || response.status === 200) {
    clearAuthStorage();
  }
  return response;
}
