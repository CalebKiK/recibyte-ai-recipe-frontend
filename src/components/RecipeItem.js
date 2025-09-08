"use client";

import { useState } from 'react';
import '../styles/UserDashboard.css';
import { toSentenceCase, toTitleCase } from '@/utils/stringFormatters';

export default function RecipeItem({ recipe, isExpanded, onClick, onRemove, showRemove = true }) {
    const instructionSteps = recipe.instructions 
        ? recipe.instructions.split('. ').filter(step => step.trim() !== '') 
        : [];

    return (
        <div className="recipe-item" onClick={onClick}>
            <div className='recipe-item-content'>
                <h4>{toTitleCase(recipe.title)}</h4>
                <p><strong>Ingredients:</strong> {recipe.ingredients?.map(i => toSentenceCase(i.name)).join(', ')}</p>
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