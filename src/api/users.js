import { apiRequest, fetchWithAuth } from "./apiClient";
import { refreshAccessToken } from "./token/refresh";
import { useAuth } from "@/context/AuthContext";
import { BASE_URL } from "./config";

// 🔹 Login user
// export async function loginUser(email, password) {
//     const res = await fetch(`${BASE_URL}/users/login/`, {
//         method: "POST",
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify({ email, password })
//     });
//     const data = await res.json();
//     if (!res.ok) throw data;

//     return data;

//     // 👇This 'return' is to clean up the API layer so all components benefit from consistent error handling
//     // The below replaces the whole functionality of the function
//     // return apiRequest("/users/login/", {
//     //     method: "POST",
//     //     headers: { "Content-Type": "application/json" },
//     //     body: JSON.stringify({ email, password })
//     // });
// }

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

    // 👇This 'return' is to clean up the API layer so all components benefit from consistent error handling
    // The below replaces the whole functionality of the function
    // return apiRequest("/users/register/", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(userData)
    // });
}

// // 🔹 Fetch user profile by token
// export async function fetchUserByToken(token) {
//   try {
//     const res = await fetch(`${BASE_URL}/users/profile/`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const data = await res.json();
    
//     if (!res.ok) {
//       // const errorData = await res.json();
//       throw data;
//     }

//     // The API might return an array or a single object. Normalize it.
//     return Array.isArray(data) ? data[0]?.user : data.user ?? data;
//   } catch (error) {
//     console.error("Failed to fetch user profile:", error);
//     throw error;
//   }
// }

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

