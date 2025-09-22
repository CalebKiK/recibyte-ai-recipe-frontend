import { apiRequest } from "./apiClient";
import { refreshAccessToken } from "./token/refresh";
import { useAuth } from "@/context/AuthContext";
import { BASE_URL } from "./config";

// 🔹 Login user
export async function loginUser(email, password) {
    const res = await fetch(`${BASE_URL}/users/login/`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw data;

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

// 🔹 Fetch user search history
export async function fetchUserSearchHistory(token) {
  const res = await fetch(`${BASE_URL}/users/search-history/`, {
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  // if (!res.ok && data.code === "token_not_valid") {
  //   const newToken = await refreshAccessToken();
  //   return await fetchUserSearchHistory(newToken);  // retry
  // }

  if (!res.ok) {
    throw new Error(data.detail || "Failed to fetch search history");
  }

  return data;
}

// 🔹 Replay a search history entry
export async function replaySearchHistory(historyId, token) {
  const res = await fetch(`${BASE_URL}/users/search-history/${historyId}/replay/`, {
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json" },
    });
    
    const data = await res.json();

    if (!res.ok && data.code === "token_not_valid") {
      const newToken = await refreshAccessToken();
      return await replaySearchHistory(historyId, newToken);  // retry
    }

    if (!res.ok) {
      throw new Error(data.detail || "Failed to replay search history");
    }

    return data;
}

// 🔹 Add a search history to the database
export async function addSearchHistory(query, minimalResults, token) {
  const payload = {
    query: query || { ingredients: [], restrictions: [], preferences: [] },
    minimal_results: minimalResults || [],
  };

  const res = await fetch(`${BASE_URL}/users/search-history/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data;
  try {
    data = await res.json();
  } catch (err) {
    // Response wasn’t JSON, log it
    const text = await res.text();
    console.error("Non-JSON response from backend, the data:", data);
    console.error("Non-JSON response from backend, the text:", text);
    throw new Error("Backend did not return JSON");
  }

  if (!res.ok && data.code === "token_not_valid") {
    const newToken = await refreshAccessToken();
    return await addSearchHistory(query, minimalResults, newToken);
  }

  if (!res.ok) {
    throw new Error(data.detail || "Failed to add search history");
  }

  return data;
}

// 🔹 Delete a search history entry
export async function deleteSearchHistory(historyId, token) {
  const res = await fetch(`${BASE_URL}/users/search-history/${historyId}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Failed to delete search history");
  }

  return true;
}

