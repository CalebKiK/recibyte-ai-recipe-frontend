"use client";

import React from 'react';
import PersonalData from './PersonalData';
import PersonalPreferences from './PersonalPreferences';
import '../../../../styles/dashboard/user-profile/personal-info/PersonalInfo.css';

export default function PersonalInfo() {
    return (
        <div className="personal-info-section">
            <PersonalData />
            <PersonalPreferences />
        </div>
    );
}