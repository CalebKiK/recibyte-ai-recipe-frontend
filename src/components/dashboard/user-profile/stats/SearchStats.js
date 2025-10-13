"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import { fetchUserInsights } from '@/api/users';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import '../../../../styles/dashboard/user-profile/stats/SearchStats.css';

export default function SearchStats() {
    const [timeframe, setTimeframe] = useState("week");
    // const [data, setData] = useState({ week: [], month: [] });

    // useEffect(() => {
    //     fetchUserInsights().then((res) => {
    //         setData({
    //             week: res.top_ingredients_last_week.map(i => ({ ingredient: i, count: 1 })),
    //             month: res.top_ingredients_last_month.map(i => ({ ingredient: i, count: 1 }))
    //         });
    //     });
    // }, []);

    // const { data, isLoading, isError } = useQuery(["userInsights"], fetchUserInsights, {
    //     staleTime: 5 * 60 * 1000,
    //     refetchOnWindowFocus: false,
    // });

    const { data, isLoading, isError } = useQuery({
        queryKey: ["userInsights"],
        queryFn: fetchUserInsights,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    // Backend returns lists of top ingredient strings, without counts — create a synthetic count
    // so bars are visually different. We assign weights: 5,4,3,2,1 descending
    const chartData = useMemo(() => {
        if (!data) return [];

        const list = 
            timeframe === "week" 
            ? data.top_ingredients_last_week || []
            : data.top_ingredients_last_month || [];
        return list.map((ingredient, idx) => ({ 
            ingredient, 
            count: Math.max(5 - idx, 1), 
        }));
    }, [timeframe, data]);

    if (isLoading) return <p>Loading insights...</p>;
    if (isError || !data) return <p>Could not load insights</p>;


    return (
        <div className="search-stats-card">
            <h3>Search Insights</h3>

            <div className="timeframe-buttons">
                <button 
                    onClick={() => setTimeframe("week")} 
                    className={timeframe === "week" ? "active" : ""}
                    >
                        Last Week
                </button>
                <button 
                    onClick={() => setTimeframe("month")} 
                    className={timeframe === "month" ? "active" : ""}
                    >
                        Last Month
                </button>
            </div>

            <h4>{timeframe === "week" ? "Previous Week" : "Last Month"}</h4>

            <ResponsiveContainer width="100%" height={250}>
                {/* <BarChart data={data[timeframe]}> */}
                <BarChart data={chartData}>
                    <XAxis dataKey="ingredient" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}