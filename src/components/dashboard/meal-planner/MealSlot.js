// Represents a single meal within a day. This is where you would display the recipe's title and image. 
// It's also the component that would handle the drag-and-drop logic for dropping a recipe onto it
"use client";

import React from "react";
import '../../../styles/dashboard/meal-planner/MealPlanDay.css';
import Image from 'next/image';

export default function MealSlot({ day }) {
    
    return (
        <div className="meal-slot-component"> 
            <h4 style={{ textTransform: "capitalize" }}>{day.day}</h4>
            <div className="mp-meals">
                {day.meals.map((m) => (
                <div key={`${m.id}-${m.title}`} className="mp-meal">
                    {m.image && (
                    <img src={m.image} alt={m.title} width={80} height={60} style={{ objectFit: "cover" }} />
                    )}
                    <div className="mp-meal-info">
                    <strong>{m.title}</strong>
                    <div>Ready: {m.readyInMinutes ?? m.ready_in_minutes ?? "—"} mins</div>
                    <div>Servings: {m.servings ?? "—"}</div>
                    {m.sourceUrl && (
                        <a href={m.sourceUrl} target="_blank" rel="noreferrer">
                        View recipe
                        </a>
                    )}
                    </div>
                </div>
                ))}
            </div>
            {day.nutrients && (
                <div className="mp-nutrients">
                <small>Calories: {Math.round(day.nutrients.calories) || "—"}</small>
                </div>
            )}
        </div>
    );
}