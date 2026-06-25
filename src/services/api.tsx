import { reissueToken, clearAccessToken } from "./auth";

interface ApiParams {
  apiUrl: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  params?: Record<string, any>;
  body?: any;
  responseType?: "json" | "blob" | "text";
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(
  /\/+$/,
  "",
);

const request = async (
  { apiUrl, method = "GET", params, body, responseType = "json" }: ApiParams,
  retry = true,
) => {
  let url = API_BASE_URL + apiUrl;

  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  if (response.status === 401 && retry) {
    const reissued = await reissueToken();

    if (!reissued) {
      clearAccessToken();
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
    }

    return request({ apiUrl, method, params, body, responseType }, false);
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  if (responseType === "blob") return response.blob();
  if (responseType === "text") return response.text();

  return response.json();
};

export const fetchDataFromApiGet = async ({
  apiUrl,
  params,
  responseType,
}: ApiParams) => {
  return request({
    apiUrl,
    params,
    method: "GET",
    responseType,
  });
};

export const fetchDataFromApiPost = async ({
  apiUrl,
  body,
  params,
  responseType,
}: ApiParams) => {
  return request({
    apiUrl,
    body,
    params,
    method: "POST",
    responseType,
  });
};

export const fetchDataFromApiPatch = async ({
  apiUrl,
  body,
  params,
  responseType,
}: ApiParams) => {
  return request({
    apiUrl,
    body,
    params,
    method: "PATCH",
    responseType,
  });
};

export const fetchDataFromApiDelete = async ({
  apiUrl,
  params,
  responseType,
}: ApiParams) => {
  return request({
    apiUrl,
    params,
    method: "DELETE",
    responseType,
  });
};
