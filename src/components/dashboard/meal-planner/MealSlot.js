// Represents a single meal within a day. This is where you would display the recipe's title and image. 
// It's also the component that would handle the drag-and-drop logic for dropping a recipe onto it
"use client";

import '../../../styles/dashboard/meal-planner/MealPlanDay.css';

export default function MealSlot() {
    
    
    return (
        <div className="meal-slot-component">
            <div className='meal-planner-header'>
                <h1>Meal Planner</h1>
                
            </div>
            
            <h2>Recipe Title (e.g., "Chicken Stir-fry")	</h2>
        </div>
    );
}