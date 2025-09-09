"use client";

import '../styles/RecipeCard.css';
import { toSentenceCase, toTitleCase } from '@/utils/stringFormatters';
import Image from 'next/image';

export default function RecipeCard({ recipe, onSelectRecipe }) {
    
    const handleRecipeClick = () => {
        if(onSelectRecipe) {
            onSelectRecipe(recipe);
        }
    }

    if (!recipe) {
        return null;
    }

    const displayIngredients = recipe.ingredients ? recipe.ingredients.map(ingredient => toSentenceCase(ingredient.name)).join(', ') : 'N/A'

    return (
        <div className="recipe-card" onClick={handleRecipeClick}>
            {recipe.image && <Image src={recipe.image} alt={recipe.title} height={160} width={230} />}
            <h5>{toTitleCase(recipe.title)}</h5>
            {recipe.description && <p>{toSentenceCase(recipe.description.substring(0, 200))}...</p>} 
            {recipe.ingredients && recipe.ingredients.length > 0 && <p><span>Ingredients:</span> {displayIngredients}</p>}
            {recipe.total_time && <p><span>Cooking Time:</span> {recipe.total_time} minutes</p>} 
            {recipe.nutrition && recipe.nutrition.length > 0 && <p><span>Calories:</span> {recipe.nutrition[0]}</p>} 
            
        </div>
    );
}