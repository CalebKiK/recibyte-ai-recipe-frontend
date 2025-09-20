import { apiRequest } from "./apiClient";
import { refreshAccessToken } from "./token/refresh";
import { useAuth } from "@/context/AuthContext";
import { BASE_URL } from "./config";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-recipbyte.fly.dev/api";
// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

// 🔹 Login user
export async function loginUser(email, password) {
    const res = await fetch(`${BASE_URL}/users/login/`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw data;

    // Pass tokens to AuthContext
    // await login({ access: data.access, refresh: data.refresh });
    return data;

    // 👇This 'return' is to clean up the API layer so all components benefit from consistent error handling
    // The below replaces the whole functionality of the function
    // return apiRequest("/users/login/", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email, password })
    // });
}

// 🔹 Register user
export async function registerUser(userData) {
    const res = await fetch(`${BASE_URL}/users/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw data;

    // await login({ access: data.access, refresh: data.refresh });
    return data;

    // 👇This 'return' is to clean up the API layer so all components benefit from consistent error handling
    // The below replaces the whole functionality of the function
    // return apiRequest("/users/register/", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(userData)
    // });
}

// 🔹 Fetch user profile by token
export async function fetchUserByToken(token) {
  try {
    const res = await fetch(`${BASE_URL}/users/profile/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw errorData;
    }

    const data = await res.json();

    // The API might return an array or a single object. Normalize it.
    return Array.isArray(data) ? data[0]?.user : data.user ?? data;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw error;
  }
}

// Fetch current user's profile (includes favorite_recipes)
export async function fetchUserProfile(token) {
    // const res = await axios.get(`${BASE_URL}/users/profile/`, {
    //     headers: { Authorization: `Bearer ${token}` },
    // });
    // const data = await res.json();
    // if (!res.ok) throw data;

    // return data;

    // return apiRequest(`/users/profile/`);

    return fetchWithAuth("/users/profile/");
}

// 🔹 Fetch user's favorite recipes
export async function fetchUserFavorites(token) {
  const res = await fetch(`${BASE_URL}/users/favorites/`, {
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok && data.code === "token_not_valid") {
    const newToken = await refreshAccessToken();
    return await fetchUserFavorites(newToken);  // retry
  }

  if (!res.ok) {
    throw new Error(data.detail || "Failed to fetch favourites");
  }

  return data;
}