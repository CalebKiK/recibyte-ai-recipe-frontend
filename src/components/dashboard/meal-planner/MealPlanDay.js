// Represents a single day in the weekly calendar. It will contain the meal slots (Breakfast, Lunch, Dinner). 
"use client";

import '../../styles/meal-planner/MealPlanDay.css';

export default function MealPlanDay() {
    
    
    return (
        <div className="meal-plan-day-component">
            <div className='meal-planner-header'>
                <h1>Meal Planner</h1>
                {/* Button below conditionally rendered if there is no meal plan or if it is 3 days to the end of current meal plan */}
                <button>Add Meal Plan</button>
            </div>
            
            <h2>*Catchy message or line about benefits of meal planners</h2>
        </div>
    );
}