"use client";

import React, { useState, useEffect } from 'react';
import { fetchUserInsights } from '@/api/users';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import '../../../../styles/dashboard/user-profile/stats/SearchStats.css';

export default function SearchStats() {
    const [timeframe, setTimeframe] = useState("week");
    const [data, setData] = useState({ week: [], month: [] });

    // const sampleData = {
    //     week: [
    //         { ingredient: "Chicken", count: 12 },
    //         { ingredient: "Tomato", count: 8 },
    //         { ingredient: "Pasta", count: 5 },
    //         { ingredient: "Garlic", count: 4 },
    //         { ingredient: "Cheese", count: 3 },
    //     ],
    //     month: [
    //         { ingredient: "Rice", count: 20 },
    //         { ingredient: "Beef", count: 15 },
    //         { ingredient: "Onion", count: 10 },
    //         { ingredient: "Carrot", count: 8 },
    //         { ingredient: "Potato", count: 6 },
    //     ],
    // };

    useEffect(() => {
        fetchUserInsights().then((res) => {
            setData({
                week: res.top_ingredients_last_week.map(i => ({ ingredient: i, count: 1 })),
                month: res.top_ingredients_last_month.map(i => ({ ingredient: i, count: 1 }))
            });
        });
    }, []);


    return (
        <div className="search-stats-card">
            <h3>Search Insights</h3>

            <div className="timeframe-buttons">
                <button onClick={() => setTimeframe("week")} className={timeframe === "week" ? "active" : ""}>Last Week</button>
                <button onClick={() => setTimeframe("month")} className={timeframe === "month" ? "active" : ""}>Last Month</button>
            </div>

            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data[timeframe]}>
                    <XAxis dataKey="ingredient" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}