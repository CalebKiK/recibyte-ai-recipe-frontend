import { apiRequest } from "./apiClient";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-recipbyte.fly.dev/api";
// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:800/api";

// 🔹 Filter recipes by ingredients + dietary restrictions
export async function getRecipesByIngredients(ingredients, dietaryRestrictions) {
    let url = `${BASE_URL}/recipes/filter_by_ingredients/?ingredients=${ingredients}`;
    if (dietaryRestrictions) {
        url += `&dietaryRestrictions=${dietaryRestrictions}`
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch recipes");
    return res.json();

    // 👇This 'return' is to clean up the API layer so all components benefit from consistent error handling
    // The below replaces the above 3 lines including the 'return' of the function
    // return apiRequest(url);
}

// 🔹 Get a single recipe detail (local/spoonacular)
export async function getRecipeDetails(recipe) {
    const res = await fetch(`${BASE_URL}/recipes/${recipe.source}-${recipe.id}/detail/`);
    if (!res.ok) throw new Error("Failed to fetch recipe detail");
    return res.json();

    // 👇This 'return' is to clean up the API layer so all components benefit from consistent error handling
    // The below replaces the whole functionality of the function
    // return apiRequest(`/recipes/${recipe.source}-${recipe.id}/detail/`);
}

// 🔹 Add recipe to favourites
export async function addRecipeToFavourites(recipeId, token) {
    const res = await fetch(`${BASE_URL}/users/favorites/${recipeId}/toggle/`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) throw new Error("Failed to add recipe to favourites");
    return res.json();

    // 👇This 'return' is to clean up the API layer so all components benefit from consistent error handling
    // The below replaces the whole functionality of the function
    // return apiRequest(`/users/favorites/${recipeId}/toggle/`, {
    //     method: "PUT",
    //     headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "application/json",
    //     },
    // });
}

// 🔹 Add recipe to history
export async function addRecipeToHistory(recipeId, token) {
    const res = await fetch(`${BASE_URL}/users/history/${recipeId}/add/`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) throw new Error("Failed to add recipe to history");
    return res.json();

    // 👇This 'return' is to clean up the API layer so all components benefit from consistent error handling
    // The below replaces the whole functionality of the function
    // return apiRequest(`/users/history/${recipeId}/add/`, {
    //     method: "PUT",
    //     headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "application/json",
    //     },
    // });
}

// 🔹 Fetch random recipe
export async function getRandomRecipes() {
    const res = await fetch(`${BASE_URL}/recipes/random/`);
    if (!res.ok) throw new Error("Failed to fetch random recipe");
    return res.json();

    // 👇This 'return' is to clean up the API layer so all components benefit from consistent error handling
    // The below replaces the whole functionality of the function
    // return apiRequest("/recipes/random/");
}