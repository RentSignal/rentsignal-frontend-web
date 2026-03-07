interface ApiParams {
  apiUrl: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  params?: Record<string, any>;
  body?: any;
  responseType?: "json" | "blob" | "text";
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const request = async ({
  apiUrl,
  method = "GET",
  params,
  body,
  responseType = "json",
}: ApiParams) => {
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
