"use client";

import '../../styles/meal-planner/MealPlanner.css';

export default function MealPlanner() {
    
    
    return (
        <div className="meal-planner-component">
            <div className='meal-planner-header'>
                <h1>Meal Planner</h1>
                {/* Button below conditionally rendered if there is no meal plan or if it is 3 days to the end of current meal plan */}
                <button>Add Meal Plan</button>
            </div>
            
            <h2>*Catchy message or line about benefits of meal planners</h2>
        </div>
    );
}