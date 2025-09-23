import { BASE_URL } from "./config";

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
export async function proposeMealPlan(payload, token) {
  const res = await fetch(`${BASE_URL}/meal-plans/propose/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  // handle non-json responses gracefully for debugging
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    // backend returned HTML or non-json (helpful for debugging)
    throw new Error(`Unexpected non-JSON response from backend: ${text.slice(0, 500)}`);
  }

  if (!res.ok) {
    // try to give back a readable message
    const message = data.detail || data.error || JSON.stringify(data);
    throw new Error(message);
  }

  return data;
}