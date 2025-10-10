"use client";

import React from 'react';
import '../../../../styles/dashboard/user-profile/stats/SearchStats.css';

export default function StatsSummary() {
    const favoritesCount = 0; // placeholder
    const mealPlans = 2; // placeholder

    return (
        <div className="stats-summary-card">
            <h3>Your Summary</h3>

            <div className="stats-item">
                <p>Favorites</p>
                {favoritesCount > 0 
                    ? <strong>{favoritesCount} recipes saved ❤️</strong> 
                    : <span>No favorites yet — start saving delicious recipes!</span>}
            </div>

            <div className="stats-item">
                <p>Meal Plans</p>
                {mealPlans > 0 
                    ? <strong>{mealPlans} meal plans created 🗓️</strong> 
                    : <span>You haven’t created a meal plan yet — generate your first one today!</span>}
            </div>
        </div>
    );
}