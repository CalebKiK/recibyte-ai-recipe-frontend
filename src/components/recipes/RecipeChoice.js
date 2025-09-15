"use client";

import { toSentenceCase, toTitleCase } from '@/utils/stringFormatters';
import '../../styles/recipes/RecipeChoice.css';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { addRecipeToFavourites, addRecipeToHistory } from "@/api/recipes";

export default function RecipeChoice({ recipe }) {
    const { token } = useAuth();
    const [message, setMessage] = useState(null);

    let displayIngredients = [];

    const sourceIngredients = recipe.detailed_ingredients?.length
        ? recipe.detailed_ingredients
        : recipe.ingredients;

    if (Array.isArray(sourceIngredients)) {
        if (sourceIngredients.length > 0) {
            if (typeof sourceIngredients[0] === "string") {
                displayIngredients = sourceIngredients
                    .filter(ing => ing.trim() !== "")
                    // .map(ing => toSentenceCase(ing))
            } else if (typeof sourceIngredients[0] === "object" && sourceIngredients[0].name) {
                displayIngredients = sourceIngredients
                    .map(ingredient => ingredient.name)
            }
        }
    } else if (typeof sourceIngredients === "string") {
        displayIngredients = sourceIngredients.split(',').map(ing => toSentenceCase(ing.trim()));
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
        // instructionSteps = recipe.instructions.filter(step => step.trim() !== '');
        instructionSteps = recipe.instructions.flatMap(step =>
            step.split(/\.\s*(?=\d+\.)/g)
                .filter(s => s.trim() !== '')
        ).filter(step => step.trim() !== '');

    } else if (typeof recipe.instructions === 'string') {
        instructionSteps = recipe.instructions
            .replace(/\n+/g, ' ')
            .split(/\.\s*/)
            .map(step => step.trim())
            .filter(step => step.length > 0)
            .map(step => step.endsWith('.') ? step : step + '.');
    }

    return (
        <div className="recipe-choice-component">
            <div className='recipe-choice-header'>
                {recipe.image && <Image src={recipe.image} alt={recipe.title} height={200} width={200} />}
                <div className='recipe-choice-heading'>
                    <h2>Let’s make: {toTitleCase(recipe.title)}</h2>
                    <div className='recipe-choice-ingredients'>
                        <h4>Ingredients</h4>
                        <ul>
                            {displayIngredients.length > 0 ? (
                                displayIngredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))
                            ) : (
                                <p>N/A</p>
                            )}
                        </ul>
                    </div>
                </div> 
            </div>
            <div className='recipe-choice-text'>
                <h4>Instructions</h4>
                <ol>
                    {instructionSteps.map((step, index) => (
                        <li key={index}>
                            {toSentenceCase(step.trim())}
                        </li>
                    ))}
                </ol>
            </div>
            <div className='recipe-choice-btns'>
                <button className='share-recipe-btn' title="Share this recipe">
                    <Image src="/images/recipe-choice-icons/share-1.png" alt="Share this recipe" height={20} width={20} />
                </button>
                <button className='substitute-ingredient-btn' title="Substitute ingredients">
                    <Image src="/images/recipe-choice-icons/arrow.png" alt="Substitute ingredients" height={20} width={20} />
                </button>
                {/* Will turn to a full colour filled icon when clicked */}
                <button className='like-recipe-btn' title="Like recipe" onClick={handleLike}>
                    <Image src="/images/recipe-choice-icons/like.png" alt="Like recipe" height={20} width={20} />
                </button>
                {/* Will turn to a full colour filled icon when clicked */}
                <button className='dislike-recipe-btn' title="Dislike recipe">
                    <Image src="/images/recipe-choice-icons/dislike.png" alt="Dislike recipe" height={20} width={20} />
                </button>
            </div>
            {/* {message && <div className='message'>{message}</div>} */}
        </div>
    );
}