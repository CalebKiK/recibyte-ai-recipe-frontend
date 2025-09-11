"use client";

import '../../styles/RecipeOptionsCard.css';
import { toSentenceCase, toTitleCase } from '@/utils/stringFormatters';
import Image from 'next/image';

export default function RecipeOptionsCard({ recipe, onSelectRecipe }) {
    
    const handleRecipeClick = () => {
        if(onSelectRecipe) {
            onSelectRecipe(recipe);
        }
    }

    if (!recipe) {
        return null;
    }

    let displayIngredients = "N/A";

    if (Array.isArray(recipe.ingredients)) {
        if (recipe.ingredients.length > 0) {
            if (typeof recipe.ingredients[0] === "string") {
                displayIngredients = recipe.ingredients
                    .filter(ing => ing.trim() !== "")
                    .map(ing => toSentenceCase(ing))
                    .join(", ");
            } else if (typeof recipe.ingredients[0] === "object" && recipe.ingredients[0].name) {
                displayIngredients = recipe.ingredients
                    .map(ingredient => toSentenceCase(ingredient.name))
                    .join(", ");
            }
        }
    } else if (typeof recipe.ingredients === "string") {
        displayIngredients = toSentenceCase(recipe.ingredients.trim());
    }

    return (
        <div className="recipe-card" onClick={handleRecipeClick}>
            {recipe.image && <Image src={recipe.image} alt={recipe.title} height={160} width={230} />}
            <h5>{toTitleCase(recipe.title)}</h5>
            {recipe.description && <p>{toSentenceCase(recipe.description.substring(0, 200))}...</p>} 
            {recipe.ingredients && recipe.ingredients.length > 0 && <p><span>Ingredients:</span> {displayIngredients}</p>}
            {recipe.total_time && <p><span>Cooking Time:</span> {recipe.total_time} minutes</p>} 
            {/* {recipe.nutrition && recipe.nutrition.length > 0 && <p><span>Calories:</span> {recipe.nutrition[0]}</p>}  */}
        </div>
    );
}