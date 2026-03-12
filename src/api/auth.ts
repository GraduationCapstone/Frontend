import { publicAxiosInstance } from "./axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export function extractAccessTokenFromUrl(search: string) {
  const params = new URLSearchParams(search);

  return (
    params.get("accessToken") ||
    params.get("access_token") ||
    params.get("token")
  );
}

export function saveAccessToken(accessToken: string) {
  localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, accessToken);
}

export function clearAccessToken() {
  localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
}

export async function reissueAccessToken() {
  const response = await publicAxiosInstance.post("/api/auth/reissue", {});
  const accessToken = response.data?.accessToken;

  if (!accessToken) {
    throw new Error("No accessToken from reissue");
  }

  return accessToken;
}
