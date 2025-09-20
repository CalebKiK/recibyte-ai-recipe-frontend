"use client";

import { useState } from 'react';
import '../../styles/dashboard/Favourites.css';
import { toSentenceCase, toTitleCase } from '@/utils/stringFormatters';

export default function RecipeItem({ recipe, isExpanded, onClick, onRemove, showRemove = true }) {
    // const instructionSteps = recipe.instructions 
    //     ? recipe.instructions.split('. ').filter(step => step.trim() !== '') 
    //     : [];

    const instructionSteps = Array.isArray(recipe.instructions)
        ? recipe.instructions
        : (typeof recipe.instructions === 'string'
            ? recipe.instructions.split('. ').filter(step => step.trim() !== '')
            : []);

    return (
        <div className="recipe-item" onClick={onClick}>
            <div className='recipe-item-content'>
                <h4>{toTitleCase(recipe.title)}</h4>
                <p><strong>Ingredients:</strong> 
                    {Array.isArray(recipe.ingredients) 
                        ? recipe.ingredients.map(i => toSentenceCase(i)).join(', ') 
                        : 'N/A'}
                </p>
                {isExpanded && (
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
                )}
            </div>
            
            <div className='recipe-item-remove-btn'>
                {showRemove && (
                    <button className="remove-button" onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}>x</button>
                )}
            </div>
            
        </div>
    );
}