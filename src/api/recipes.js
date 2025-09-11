const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function getRecipesByIngredients(ingredients, dietaryRestrictions) {
    let url = `${BASE_URL}/recipes/filter_by_ingredients/?ingredients=${ingredients}`;
    if (dietaryRestrictions) {
        url += `&diet=${dietaryRestrictions}`
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch recipes");
    return res.json
}

export async function getRecipeDetails(recipe) {
    const res = await fetch(`${BASE_URL}/recipes/${recipe.source}-${recipe.id}/detail/`);
  if (!res.ok) throw new Error("Failed to fetch recipe detail");
  return res.json();
}

export async function addRecipeToFavourites(recipe) {
    
}

export async function addRecipeToHistory() {
    
}

export async function getRandomRecipes() {
    
}