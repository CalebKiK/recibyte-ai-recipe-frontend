"use client";

import { useState } from 'react';
import '../../styles/dashboard/library/Favourites.css';
import Image from 'next/image';
import ConfirmModal from '../modals/ConfirmModal';
import { toSentenceCase, toTitleCase } from '@/utils/stringFormatters';
import { formatCreatedAt } from '@/utils/formatDate';

export default function FavouritesRecipeCard({ recipe, isExpanded, onClick, onRemove, showRemove = true }) {
    const [showConfirm, setShowConfirm] = useState(false);

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

    const instructionSteps = Array.isArray(recipe.instructions)
        ? recipe.instructions
        : (typeof recipe.instructions === 'string'
            ? recipe.instructions.split('. ').filter(step => step.trim() !== '')
            : []);

    return (
        <>
            <div className="fav-recipe-card" onClick={onClick}>
                <div className='fav-recipe-card-content'>
                    <div className='fav-recipe-card-header'>
                        {recipe.image && <Image src={recipe.image} alt={recipe.title} height={60} width={70} />}
                        <div className='fav-recipe-card-title-date'>
                            <h4>{toTitleCase(recipe.title)}</h4>
                            <small>{formatCreatedAt(recipe.created_at)}</small>
                        </div>
                    </div>
                    {isExpanded && (
                        <div className='fav-recipe-card-expanded'>
                            <div className='fav-recipe-card-ingredients'>
                                {recipe.ingredients && recipe.ingredients.length > 0 && <p><strong>Ingredients:</strong> {displayIngredients}</p>}
                            </div>
                            <div className='fav-recipe-card-steps'>
                                <p><strong>Instructions:</strong></p>
                                <ul>
                                    {instructionSteps.map((step, index) => (
                                        <li key={index}>
                                            {toSentenceCase(step.trim())}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        
                    )}
                </div>
                
                <div className='fav-recipe-card-remove-btn'>
                    {showRemove && (
                        <button className="remove-button" 
                            onClick={(e) => {
                            e.stopPropagation();
                            setShowConfirm(true);
                        }}>x</button>
                    )}
                </div>
            </div>
            
            {/* Confirm Modal */}
            <ConfirmModal
                show={showConfirm}
                title="Remove from favourites?"
                message={`Are you sure you want to remove "${recipe.title}" from your Favourites?`}
                confirmText="Remove"
                cancelText="Cancel"
                onConfirm={() => {
                setShowConfirm(false);
                onRemove();
                }}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
}