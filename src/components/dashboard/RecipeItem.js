"use client";

import { useState } from 'react';
import '../../styles/dashboard/Favourites.css';
import Image from 'next/image';
import ConfirmModal from '../modals/ConfirmModal';
import { toSentenceCase, toTitleCase } from '@/utils/stringFormatters';

export default function RecipeItem({ recipe, isExpanded, onClick, onRemove, showRemove = true }) {
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
            <div className="recipe-item" onClick={onClick}>
                <div className='recipe-item-content'>
                    <div className='recipe-item-header'>
                        {recipe.image && <Image src={recipe.image} alt={recipe.title} height={40} width={50} />}
                        <h4>{toTitleCase(recipe.title)}</h4>
                    </div>
                    {isExpanded && (
                        <div className='recipe-item-expanded'>
                            <div className='recipe-item-ingredients'>
                                {recipe.ingredients && recipe.ingredients.length > 0 && <p><strong>Ingredients:</strong> {displayIngredients}</p>}
                            </div>
                            <div className='recipe-item-steps'>
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
                
                <div className='recipe-item-remove-btn'>
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
                message={`Are you sure you want to remove "${recipe.title}" from your favourites?`}
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