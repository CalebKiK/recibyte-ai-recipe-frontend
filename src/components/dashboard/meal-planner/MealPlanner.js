"use client";

import '../../../styles/dashboard/meal-planner/MealPlanner.css';

export default function MealPlanner() {
    
    
    return (
        <div className="meal-planner-component">
            <div className='meal-planner-header'>
                <h1>Your Weekly Menu / Meal Prep Lab</h1>
                {/* Button below conditionally rendered if there is no meal plan or if it is 3 days to the end of current meal plan */}
                <button>Add Meal Plan</button>
            </div>
            
            <p>A week of delicious decisions, all in one place. We do the math, you make the magic.</p>
        </div>
    );
}