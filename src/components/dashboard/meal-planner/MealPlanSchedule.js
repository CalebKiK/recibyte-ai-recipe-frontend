"use client";

import React from "react";
import "../../../styles/dashboard/meal-planner/MealPlanSchedule.css";
import MealSlot from "./MealSlot";

export default function MealPlanSchedule({ response }) {
  // response can be the object returned by our API
  // (saved: true, meal_plan) or (saved: false, plan)
  const planObj = response?.saved ? response.meal_plan : response?.plan || response || {};
  const normalizedPlan = planObj.plan || planObj;
  const days = normalizedPlan?.days || [];

  return (
    <div className="meal-plan-schedule-component">
      <h3>The Kitchen Calendar</h3>
      <p>Your forecast for a flavorful {planObj.timeframe ?? ""}.</p>

      <div className="mp-created">{planObj.created_at && <small>Created: {new Date(planObj.created_at).toLocaleString()}</small>}</div>

      <div className="mp-days">
        {days.length === 0 ? <p>No days found in plan.</p> : days.map((d) => <MealSlot key={d.day} day={d} />)}
      </div>
    </div>
  );
}