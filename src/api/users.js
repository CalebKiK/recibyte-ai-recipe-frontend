import { fetchWithAuth } from "./apiClient";
import { BASE_URL } from "./config";

// 🔹 Register user
export async function registerUser(userData) {
    const res = await fetch(`${BASE_URL}/users/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw data;

    return data;
}

// Fetch current user's profile (includes favorite_recipes)
export async function fetchUserProfile() {

    return fetchWithAuth("/users/profile/");
}

// 🔹 Fetch user's favorite recipes
export async function fetchUserFavorites(token) {
  return fetchWithAuth("/users/favorites/");
}

// 🔹 Fetch user search history
export async function fetchUserSearchHistory() {
  return fetchWithAuth("/users/search-history/");
}

// 🔹 Replay a search history entry
export async function replaySearchHistory(historyId) {
  return fetchWithAuth(`/users/search-history/${historyId}/replay/`);
}

// 🔹 Add a search history to the database
export async function addSearchHistory(query, minimalResults, token) {
  const payload = {
    query: query || { ingredients: [], restrictions: [], preferences: [] },
    minimal_results: minimalResults || [],
  };

  return fetchWithAuth("/users/search-history/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// 🔹 Delete a search history entry
export async function deleteSearchHistory(historyId) {
  return fetchWithAuth(`/users/search-history/${historyId}/`, {
    method: "DELETE",
  });
}

