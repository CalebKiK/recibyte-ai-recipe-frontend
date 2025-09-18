"use client";

import { useState } from 'react';
import '../../styles/dashboard/UserDashboard.css';
import Favourites from './Favourites';
import Preferences from './Preferences';
import UserHistory from './UserHistory';
import MealPlanner from './meal-planner/MealPlanner';

export default function UserDashboard() {
    const [selectedSection, setSelectedSection] = useState('preferences');

  const renderSection = () => {
    switch (selectedSection) {
        case 'preferences':
            return <Preferences />;
        case 'favourites':
            return <Favourites />;
        case 'history':
            return <UserHistory />;
        case 'meal-planner':
            return <MealPlanner/>;
        default:
            return <Preferences />
    }
  };

    return (
        <div className="user-dashboard-component">
            <h1>Dashboard</h1>
            <div className='dashboard-content'>
                <div className='dashboard-links'>
                    <button onClick={() => setSelectedSection('preferences')}>Preferences</button>
                    <button onClick={() => setSelectedSection('favourites')}>Recipe Favourites</button>
                    <button onClick={() => setSelectedSection('history')}>User History</button>
                    <button onClick={() => setSelectedSection('meal-planner')}>Meal Planner</button>
                </div>
                <div className='selected-dashboard-link'>
                    {renderSection()}
                </div>
            </div>
        </div>
    );
}