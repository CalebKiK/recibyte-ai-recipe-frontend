"use client";

import React, { useState } from 'react';
import '../../../styles/dashboard/user-profile/UserProfile.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faChartLine } from "@fortawesome/free-solid-svg-icons";
import PersonalInfo from './personal-info/PersonalInfo';
import UserStats from './stats/UserStats';


export default function UserProfile() {
    const [selectedSection, setSelectedSection] = useState('personal-info');

    const renderSection = () => {
        switch (selectedSection) {
            case 'personal-info':
                return <PersonalInfo />;
            case 'stats':
                return <UserStats />;
            default:
                return <PersonalInfo />;
        }
    };

    return (
        <div className="user-profile-component">
            {/* <h2>My Account</h2> */}
            <div className="user-profile-content">
                <div className="user-profile-links">
                    <button 
                        onClick={() => setSelectedSection('personal-info')} 
                        className={selectedSection === 'personal-info' ? 'active' : ''}
                    >
                        <FontAwesomeIcon icon={faUser} className="profile-links-icon" />
                        Personal Info
                    </button>
                    <button 
                        onClick={() => setSelectedSection('stats')} 
                        className={selectedSection === 'stats' ? 'active' : ''}
                    >
                        <FontAwesomeIcon icon={faChartLine} className="profile-links-icon" />
                        Insights
                    </button>
                </div>
                <div className="selected-profile-link">
                    {renderSection()}
                </div>
            </div>
        </div>
    );
}