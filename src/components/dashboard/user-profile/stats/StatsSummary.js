"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { fetchUserInsights } from '@/api/users';
import '../../../../styles/dashboard/user-profile/stats/SearchStats.css';

export default function StatsSummary() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["userInsights"],
        queryFn: fetchUserInsights,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

  if (isLoading) return <p>Loading summary...</p>;
  if (isError) return <p>Could not load summary</p>;

  return (
    <div className="stats-summary-card">
      <h3>Your Summary</h3>

      <div className="stats-item">
        <p>Favorites: </p>
        {data.fav_recipes_count > 0 ? (
          <strong>{data.fav_recipes_count} recipes saved ❤️</strong>
        ) : (
          <span>No favorites yet — start saving delicious recipes!</span>
        )}
      </div>

      <div className="stats-item">
        <p>Meal Plans: </p>
        {data.meal_plans_generated > 0 ? (
          <strong>{data.meal_plans_generated} meal plans created 🗓️</strong>
        ) : (
          <span>You haven’t created a meal plan yet — generate your first one today!</span>
        )}
      </div>
    </div>
  );
}

// export default function StatsSummary() {

//     const [insights, setInsights] = useState(null);
//     const [dots, setDots] = useState("");
    
//     useEffect(() => {
//             const interval = setInterval(() => {
//                 setDots((prev) => {
//                     if (prev === "....") return "";
//                     return prev + ".";
//                 });
//             }, 500);
//             return () => clearInterval(interval);
//         }, []
//     );

//     useEffect(() => {
//         fetchUserInsights()
//           .then(setInsights)
//           .catch(() => setInsights(null));
//     }, []);

//     if (!insights) return <p>Loading summary{dots}</p>;

//     return (
//         <div className="stats-summary-card">
//             <h3>Your Summary</h3>

//             <div className="stats-item">
//                 <p>Favorites: </p>
//                 {insights.fav_recipes_count > 0 
//                     ? <strong> {insights.fav_recipes_count} recipes saved ❤️</strong> 
//                     : <span>No favorites yet — start saving delicious recipes!</span>}
//             </div>

//             <div className="stats-item">
//                 <p>Meal Plans: </p>
//                 {insights.meal_plans_generated > 0 
//                     ? <strong> {insights.meal_plans_generated} meal plans created 🗓️</strong> 
//                     : <span>You haven’t created a meal plan yet — generate your first one today!</span>}
//             </div>
//         </div>
//     );
// }