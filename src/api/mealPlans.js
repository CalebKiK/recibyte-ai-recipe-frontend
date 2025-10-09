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
