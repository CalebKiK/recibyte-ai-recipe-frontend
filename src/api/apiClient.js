import { refreshAccessToken } from "./token/refresh";
import { BASE_URL } from "./config";

export async function fetchWithAuth(endpoint, options = {}) {
  let res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include", 
  });

  if (res.status === 401) {
    // try to refresh by hitting the refresh endpoint
    const refreshRes = await fetch(`${BASE_URL}/token/refresh/`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) throw { detail: "Session expired, please log in again" };

    // retry request after refresh
    res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
    });
  }

  let data = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    if (res.status >= 500) throw { detail: "Server unavailable, try again later" };
    if (res.status === 404) throw { detail: "Resource not found" };
    if (res.status === 401) throw { detail: "Unauthorized, please log in again" };
    throw data || { detail: "Something went wrong" };
  }

  return data;
}