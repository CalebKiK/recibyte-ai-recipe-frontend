import { apiRequest, fetchWithAuth } from "./apiClient";
import { BASE_URL } from "./config";

// 🔹 Filter recipes by ingredients + dietary restrictions
export async function getRecipesByIngredients(ingredients, dietaryRestrictions) {
    let endpoint = `/recipes/filter_by_ingredients/?ingredients=${ingredients}`;
    if (dietaryRestrictions) {
        endpoint += `&dietaryRestrictions=${dietaryRestrictions}`
    }

    return apiRequest(endpoint);
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

// 🔹 Add or Remove recipe to favourites
export async function toggleRecipeFavourite(recipe, token) {
    const payload = {
        source: recipe.source,
        source_recipe_id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
    }

    return fetchWithAuth(`/users/favorites/toggle/`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

// 🔹 Add recipe to history
export async function addToUserHistory(recipeId, token) {

    // 👇This 'return' is to clean up the API layer so all components benefit from consistent error handling
    // The below replaces the whole functionality of the function
    return apiRequest(`/users/history/${recipeId}/add/`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
}

// 🔹 Fetch random recipe
export async function getRandomRecipes() {
    // const res = await fetch(`${BASE_URL}/recipes/random/`);
    // if (!res.ok) throw new Error("Failed to fetch random recipe");
    // return res.json();

    // 👇This 'return' is to clean up the API layer so all components benefit from consistent error handling
    // The below replaces the whole functionality of the function
    return apiRequest("/recipes/random/");
}