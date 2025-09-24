"use client";

import React, { useState } from 'react';
import '../../styles/dashboard/UserDashboard.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from '@/context/AuthContext';
import {
  faSlidersH,
  faBookOpen,
  faCalendarDays,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import Preferences from './Preferences';
import UserLibrary from './UserLibrary';
import MealPlanner from './meal-planner/MealPlanner';
import Image from 'next/image';

export default function UserDashboard() {
    const [selectedSection, setSelectedSection] = useState('preferences');
    const { user } = useAuth();

  const renderSection = () => {
    switch (selectedSection) {
        case 'preferences':
            return <Preferences />;
        case 'user-library':
            return <UserLibrary />;
        case 'meal-planner':
            return <MealPlanner/>;
        default:
            return <Preferences />
    }
  };

  const getProfileImage = () => {
        if (!user || !user.gender) {
            return '/images/dashboard-icons/neutral-user.png';
        }
        if (user.gender.toLowerCase() === 'male') {
            return '/images/dashboard-icons/male-user.png';
        } else if (user.gender.toLowerCase() === 'female') {
            return '/images/dashboard-icons/female-user.png';
        } else {
            return '/images/dashboard-icons/neutral-user.png';
        }
    };

    // Get the user's full name
    const getUserName = () => {
        if (!user) return 'Guest';
        const nameParts = [user.first_name, user.last_name].filter(Boolean);
        return nameParts.length > 0 ? nameParts.join(' ') : 'User';
    };

    // Get the user's email or a fallback
    const getUserEmail = () => {
        if (!user || !user.email) {
            // A modern and contemporary text for when the email is missing
            return 'Email coming soon...';
        }
        return user.email;
    };

    return (
        <div className="user-dashboard-component">
            <div className='user-dashboard-header'>
                <h2>Dashboard</h2>
                <div className='user-profile-link'>
                    <Image src={getProfileImage()} alt='user-icon' width={30} height={30} />
                    <div className='user-profile-info'>
                        <h4>{getUserName()}</h4>
                        <p>{getUserEmail()}</p>
                    </div>
                </div>
            </div>
            <div className='dashboard-content'>
                <div className='dashboard-links'>
                    <button 
                        onClick={() => setSelectedSection('preferences')} 
                        className={selectedSection === 'preferences' ? 'active' : ''}
                    >
                        <FontAwesomeIcon icon={faSlidersH} className="dashboard-sidebar-icon" />
                        Preferences
                    </button>
                    <button 
                        onClick={() => setSelectedSection('user-library')} 
                        className={selectedSection === 'user-library' ? 'active' : ''}
                    >
                        <FontAwesomeIcon icon={faBookOpen} className="dashboard-sidebar-icon" />
                        Library
                    </button>
                    <button 
                        onClick={() => setSelectedSection('meal-planner')} 
                        className={selectedSection === 'meal-planner' ? 'active' : ''}
                    >
                        <FontAwesomeIcon icon={faCalendarDays} className="dashboard-sidebar-icon" />
                        Meal Planner
                    </button>
                </div>
                <div className='selected-dashboard-link'>
                    {renderSection()}
                </div>
            </div>
        </div>
    );
}