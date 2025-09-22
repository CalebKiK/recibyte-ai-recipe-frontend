import { BASE_URL } from "../config";

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