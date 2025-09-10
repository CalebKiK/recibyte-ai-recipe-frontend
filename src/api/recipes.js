const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:800/api";

// 🔹 Filter recipes by ingredients + dietary restrictions
export async function getRecipesByIngredients(ingredients, dietaryRestrictions) {
    let url = `${BASE_URL}/recipes/filter_by_ingredients/?ingredients=${ingredients}`;
    if (dietaryRestrictions) {
        url += `&dietaryRestrictions=${dietaryRestrictions}`
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch recipes");
    return res.json
}

// 🔹 Get a single recipe detail (local/spoonacular)
export async function getRecipeDetails(recipe) {
    const res = await fetch(`${BASE_URL}/recipes/${recipe.source}-${recipe.id}/detail/`);
  if (!res.ok) throw new Error("Failed to fetch recipe detail");
  return res.json();
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
}

// 🔹 Fetch random recipe
export async function getRandomRecipes() {
    const res = await fetch(`${BASE_URL}/recipes/random/`);
    if (!res.ok) throw new Error("Failed to fetch random recipe");
    return res.json();
}