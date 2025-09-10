"use client";

import { toSentenceCase, toTitleCase } from '@/utils/stringFormatters';
import '../styles/RecipeChoice.css';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { addRecipeToFavourites, addRecipeToHistory } from "@/api/recipes";

export default function RecipeChoice({ recipe }) {
    const { token } = useAuth();
    const [message, setMessage] = useState(null);

    let displayIngredients = "N/A";

    const sourceIngredients = recipe.detailed_ingredients?.length
        ? recipe.detailed_ingredients
        : recipe.ingredients;

    if (Array.isArray(sourceIngredients)) {
        if (sourceIngredients.length > 0) {
            if (typeof sourceIngredients[0] === "string") {
                displayIngredients = sourceIngredients
                    .filter(ing => ing.trim() !== "")
                    .join(", ");
            } else if (typeof sourceIngredients[0] === "object" && sourceIngredients[0].name) {
                displayIngredients = sourceIngredients
                    .map(ingredient => toSentenceCase(ingredient.name))
                    .join(", ");
            }
        }
    } else if (typeof sourceIngredients === "string") {
        displayIngredients = sourceIngredients.trim();
    }

    // const addToFavorites = async () => {
    //     try {
    //         const response = await axios.put(
    //             `https://backend-recipbyte.fly.dev/api/users/favorites/${recipe.id}/toggle/`,
    //             {},
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );
    //         toast.success(response.data.message);
    //     } catch (error) {
    //         toast.error('Error adding to favorites. Please try again.');
    //     }
    // };

    // const addToHistory = async () => {
    //     try {
    //         await axios.put(
    //             `https://backend-recipbyte.fly.dev/api/users/history/${recipe.id}/add/`,
    //             {},
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );
    //     } catch (error) {
    //         console.error('Error adding to history');
    //     }
    // };

    const handleLike = async () => {
        if (!token) {
            toast.error('Please log in to add to favorites.');
            return;
        }

        try {
            await addRecipeToFavourites(recipe.id, token);
            await addRecipeToHistory(recipe.id, token);
            toast.success("Recipe added to favourites!");
        } catch (error) {
            toast.error("Error while updating favourites/history.");
        }

        // await addToFavorites();
        // await addToHistory();
        // toast.success("Recipe added to favourites!");
    };

    let instructionSteps = [];

    if (Array.isArray(recipe.instructions)) {
        instructionSteps = recipe.instructions.filter(step => step.trim() !== '');
    } else if (typeof recipe.instructions === 'string') {
        instructionSteps = recipe.instructions.split('. ').filter(step => step.trim() !== '');
    }

    return (
        <div className="recipe-choice-component">
            <div className='recipe-choice-header'>
                {recipe.image && <Image src={recipe.image} alt={recipe.title} height={200} width={200} />}
                <div className='recipe-choice-heading'>
                    <h2>Let’s make: {toTitleCase(recipe.title)}</h2>
                    <div className='recipe-choice-ingredients'>
                        <h4>Ingredients</h4>
                        <p>{displayIngredients}</p>
                    </div>
                </div> 
            </div>
            {/* <h2>Let’s make: {toTitleCase(recipe.title)}</h2>
            <div className='recipe-choice-ingredients'>
                <h4>Ingredients</h4>
                <p>{displayIngredients}</p>
            </div> */}
            <div className='recipe-choice-text'>
                <h4>Instructions</h4>
                {/* <p>{recipe.instructions}</p> */}
                <ul>
                    {instructionSteps.map((step, index) => (
                        <li key={index}>
                            {toSentenceCase(step.trim())}
                        </li>
                    ))}
                </ul>
            </div>
            <div className='recipe-choice-btns'>
                <button className='substitute-ingredient-btn'>Substitute Ingredient</button>
                <button className='like-recipe-btn' onClick={handleLike}>Like (Thumbs Up)</button>
                <button className='dislike-recipe-btn'>Not Like (Thumbs Down)</button>
            </div>
            {/* {message && <div className='message'>{message}</div>} */}
        </div>
    );
}