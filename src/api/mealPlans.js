import { BASE_URL } from "./config";
import { fetchWithAuth } from "./apiClient";

/**
 * Propose (generate) a meal plan via backend.
 * payload example:
 * {
 *   timeFrame: "week" | "day",
 *   targetCalories: 2000,
 *   diet: "vegetarian",
 *   exclude: ["shellfish","olives"],
 *   save: true,
 *   title: "My Weekly Plan"
 * }
 */

export async function proposeMealPlan(payload) {
  return fetchWithAuth("/meal-plans/propose/", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
}

export async function getMealPlans() {
  return fetchWithAuth("/meal-plans/list/", {
    method: "GET",
  });
}

export async function confirmMealPlan(pk) {
  return fetchWithAuth(`/meal-plans/${pk}/confirm/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
}

// export async function proposeMealPlan(payload) {
//   const res = await fetch(`${BASE_URL}/meal-plans/propose/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });

//   // handle non-json responses gracefully for debugging
//   const text = await res.text();
//   let data;
//   try {
//     data = text ? JSON.parse(text) : {};
//   } catch (err) {
//     // backend returned HTML or non-json (helpful for debugging)
//     throw new Error(`Unexpected non-JSON response from backend: ${text.slice(0, 500)}`);
//   }

//   if (!res.ok) {
//     // try to give back a readable message
//     const message = data.detail || data.error || JSON.stringify(data);
//     throw new Error(message);
//   }

//   return data;
// }

// // export async function getMealPlans(token) {
// //     return apiRequest(`${BASE_URL}/meal-plans/list/`, {
// //         method: "GET",
// //         headers: {
// //             Authorization: `Bearer ${token}`,
// //         },
// //     });
// // }

// export async function getMealPlans() {
//   return apiRequest("/meal-plans/list/", {
//     method: "GET",
//   });
//   // const response = await fetch(`${BASE_URL}/meal-plans/list/`, {
//   //   headers: { Authorization: `Bearer ${token}` },
//   // });

//   // if (!response.ok) {
//   //   let details = "";
//   //   try {
//   //     const data = await response.json();
//   //     details = JSON.stringify(data);
//   //   } catch (e) {
//   //     details = response.statusText;
//   //   }
//   //   throw new Error(`Failed to fetch meal plans: ${response.status} ${details}`);
//   // }

//   // return response.json();
// }

// export async function confirmMealPlan(pk) {
//   const res = await fetch(`${BASE_URL}/meal-plans/${pk}/confirm/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//   });

//   const data = await res.json();
//   if (!res.ok) throw new Error(data.detail || "Failed to confirm meal plan");
//   return data;
// }