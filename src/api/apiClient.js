const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-recipbyte.fly.dev/api";

// 🔹 Centralized request function
export async function apiRequest(endpoint, options = {}) {
    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, options);

        // Attempt to parse JSON (may fail if empty response)
        let data;
        try {
            data = await res.json();
        } catch {
            data = null;
        }

        if (!res.ok) {
            // Handle common errors
            if (res.status >= 500) {
                throw { detail: "Server unavailable, try again later" };
            }
            if (res.status === 404) {
                throw { detail: "Resource not found" };
            }
            if (res.status === 401) {
                throw { detail: "Unauthorized, please log in again" };
            }
            // Otherwise throw backend response
            throw data || { detail: "Something went wrong" };
        }

        return data;
    } catch (err) {
        // Handle network failures (no internet, server unreachable, CORS, etc.)
        if (err instanceof TypeError) {
            throw { detail: "Network error, please check your connection" };
        }
        throw err;
    }
}