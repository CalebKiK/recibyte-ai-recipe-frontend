"use client";

import React from 'react';
import PersonalData from './PersonalData';
import PersonalPreferences from './PersonalPreferences';

export default function PersonalInfo() {
    return (
        <div className="personal-info-section">
            <PersonalData />
            <PersonalPreferences />
        </div>
    );
}