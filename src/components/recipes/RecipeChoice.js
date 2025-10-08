"use client";

import { toSentenceCase, toTitleCase } from '@/utils/stringFormatters';
import '../../styles/recipes/RecipeChoice.css';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { toggleRecipeFavourite, addToUserHistory } from "@/api/recipes";
import ConfirmModal from '../modals/ConfirmModal';

export default function RecipeChoice({ recipe, onUpdateFavourite }) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(Boolean(recipe.is_favorite));
    const [showConfirm, setShowConfirm] = useState(false);
    const [disliked, setDisliked] = useState(false);
    // const [message, setMessage] = useState('');

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

    useEffect(() => {
        setLiked(Boolean(recipe.is_favorite));
    }, [recipe?.is_favorite]);

    const handleLike = async () => {
        if (!user) {
            toast.error('Please log in to add to favorites.');
            return;
        }

        try {
            const res = await toggleRecipeFavourite(recipe);
            const newState = res && typeof res.is_favorite !== "undefined" ? res.is_favorite : !liked;
            setLiked(newState);

            if (onUpdateFavourite) {
                onUpdateFavourite(recipe.id, newState, recipe.source || "local_db");
            }

            toast.success(newState ? "Recipe added to favourites!" : "Recipe removed from favourites.");
        } catch (error) {
            console.error("Error while updating favourites:", error);
            toast.error("Error while updating favourites.");
        }

        // if (liked) {
        //     setShowConfirm(true);
        //     return;
        // }

        // try {
        //     await toggleRecipeFavourite(recipe);
        //     toast.success("Recipe added to favourites!");
        //     setLiked(true);
        // } catch (error) {
        //     console.error("Error while updating favourites:", error);
        //     toast.error("Error while updating favourites.");
        // }
    };

    const handleConfirmRemove = async () => {
        try {
            await toggleRecipeFavourite(recipe); // toggles off
            toast.success("Recipe removed from favourites.");
            setLiked(false);
        } catch (error) {
            console.error("Error while removing favourite:", error);
            toast.error("Error while removing favourite.");
        } finally {
            setShowConfirm(false);
        }
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
                {/* <button className='share-recipe-btn' title="Share this recipe">
                    <Image src="/images/recipe-choice-icons/share-1.png" alt="Share this recipe" height={20} width={20} />
                </button>
                <button className='substitute-ingredient-btn' title="Substitute ingredients">
                    <Image src="/images/recipe-choice-icons/arrow.png" alt="Substitute ingredients" height={20} width={20} />
                </button> */}
                {/* Will turn to a full colour filled icon when clicked */}
                <button className='like-recipe-btn' title="Save recipe" onClick={handleLike}>
                    <Image 
                        src=
                            {liked 
                            ? "/images/recipe-choice-icons/like-2.png" 
                            : "/images/recipe-choice-icons/like.png"} 
                        alt="Save recipe" 
                        height={20} 
                        width={20} 
                    />
                </button>
                {/* Will turn to a full colour filled icon when clicked */}
                {/* <button className='dislike-recipe-btn' title="Dislike recipe" onClick={() => setDisliked(!disliked)}>
                    <Image 
                        // src="/images/recipe-choice-icons/dislike.png" 
                        src={disliked 
                            ? "/images/recipe-choice-icons/dislike-1.png" 
                            : "/images/recipe-choice-icons/dislike.png"} 
                        alt="Dislike recipe" 
                        height={20} 
                        width={20} 
                    />
                </button> */}
            </div>
            {/* {message && <div className='message'>{message}</div>} */}

            {/* Confirm Modal for removal */}
            <ConfirmModal
                show={showConfirm}
                title="Remove from favourites?"
                message={`Are you sure you want to remove "${recipe.title}" from your Favourites?`}
                confirmText="Remove"
                cancelText="Cancel"
                onConfirm={handleConfirmRemove}
                onCancel={() => setShowConfirm(false)}
            />
        </div>
    );
}