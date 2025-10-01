import { refreshAccessToken } from "./token/refresh";
import { BASE_URL } from "./config";

export async function apiRequest(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include", 
  });

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
  if (!res.ok) throw data || { detail: "Request failed" };
  return data;
}

// 🔹 Centralized request function
// export async function apiRequest(endpoint, options = {}) {
//     let access = localStorage.getItem("access");

//     const headers = {
//         "Content-Type": "application/json",
//         ...(options.headers || {}),
//         ...(access ? { Authorization: `Bearer ${access}` } : {}),
//     };

//     try {
//         const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
//         let data;

//         try {
//             data = await res.json();
//         } catch {
//             data = null;
//         }

//         // If unauthorized, attempt token refresh once
//         if (res.status === 401 && data?.code === "token_not_valid") {
//             try {
//             const newAccess = await refreshAccessToken();
//             localStorage.setItem("access", newAccess);

//             const headers = {
//                 ...headers,
//                 Authorization: `Bearer ${newAccess}`,
//             };

//             res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
//             data = await res.json();
//             } catch (refreshErr) {
//             throw { detail: "Session expired. Please log in again." };
//             }
//         }

//         if (!res.ok) {
//             // Handle common errors
//             if (res.status >= 500) {
//                 throw { detail: "Server unavailable, try again later" };
//             }
//             if (res.status === 404) {
//                 throw { detail: "Resource not found" };
//             }
//             if (res.status === 401) {
//                 throw { detail: "Unauthorized, please log in again" };
//             }
//             throw data || { detail: "Something went wrong" };
//         }

//         return data;
//     } catch (err) {
//         // Handle network failures (no internet, server unreachable, CORS, etc.)
//         if (err instanceof TypeError) {
//             throw { detail: "Network error, please check your connection" };
//         }
//         throw err;
//     }
// }