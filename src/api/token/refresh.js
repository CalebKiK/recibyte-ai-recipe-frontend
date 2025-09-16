import { BASE_URL } from "../config";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-recipbyte.fly.dev/api";

export async function refreshAccessToken() {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) throw new Error("No refresh token");

  const res = await fetch(`${BASE_URL}/token/refresh/`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ refresh }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.detail || "Token refresh failed");

  localStorage.setItem("access", data.access);
  return data.access;
}