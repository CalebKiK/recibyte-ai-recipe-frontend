// Represents a single meal within a day. This is where you would display the recipe's title and image. 
// It's also the component that would handle the drag-and-drop logic for dropping a recipe onto it
"use client";

import '../../styles/meal-planner/MealPlanDay.css';

export default function MealSlot() {
    
    
    return (
        <div className="meal-slot-component">
            <div className='meal-planner-header'>
                <h1>Meal Planner</h1>
                {/* Button below conditionally rendered if there is no meal plan or if it is 3 days to the end of current meal plan */}
                <button>Add Meal Plan</button>
            </div>
            
            <h2>*Catchy message or line about benefits of meal planners</h2>
        </div>
    );
}