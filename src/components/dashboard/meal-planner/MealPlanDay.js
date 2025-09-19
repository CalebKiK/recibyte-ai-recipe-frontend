// Represents a single day in the weekly calendar. It will contain the meal slots (Breakfast, Lunch, Dinner). 
"use client";

import '../../../styles/dashboard/meal-planner/MealPlanDay.css';

export default function MealPlanDay() {
    
    
    return (
        <div className="meal-plan-day-component">
            <div className='meal-planner-header'>
                <h1>Today's Plate/The Daily Digest</h1>
                
            </div>
            
            <h2>What&apos;s on the menu today? / Your culinary lineup for the day.</h2>
        </div>
    );
}