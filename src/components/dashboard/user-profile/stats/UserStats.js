"use client";

import React from 'react';
import StatsSummary from './StatsSummary';
import SearchStats from './SearchStats';
import '../../../../styles/dashboard/user-profile/stats/UserStats.css';

export default function UserStats() {
    return (
        <div className="user-stats-section">
            <StatsSummary />
            <SearchStats />
        </div>
    );
}