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

  const createdDate = planObj.created_at ? new Date(planObj.created_at) : null;
  const createdDay = createdDate ? createdDate.toLocaleDateString("en-US", { weekday: "long" }) : null;
  const today = new Date();
  const todayIndex = createdDate ? Math.floor((today - createdDate) / (1000 * 60 * 60 * 24)) : null;

  const createdDateStr = createdDate
    ? createdDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // Check if today or yesterday
  let dateTag = "";
  if (createdDate) {
    const today = new Date();
    const diffDays = Math.floor(
      (today.setHours(0, 0, 0, 0) - createdDate.setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24)
    );
    if (diffDays === 0) dateTag = "(Today)";
    if (diffDays === 1) dateTag = "(Yesterday)";
  }

  const isNaturalWeek = createdDay === "Monday";

  return (
    <div className="meal-plan-schedule-component">
      <h3>The Kitchen Calendar</h3>
      <p>Your forecast for a flavorful {planObj.timeframe ?? ""}.
        <strong>{createdDateStr && ` Created on: ${createdDateStr} ${dateTag}`}</strong>
      </p>

      {/* <div className="mp-created">{planObj.created_at && <small>Created at: {new Date(planObj.created_at).toLocaleString()}</small>}</div> */}

      {/* <div className="mp-days">
        {days.length === 0 ? (
          <p>No days found in plan.</p>
        ) : (
          days.map((d) => <MealSlot key={d.day} day={d} />)
        )}
      </div> */}
      <div className="mp-days">
        {days.length === 0 ? (
          <p>No days found in plan.</p>
        ) : (
          <table className="meal-plan-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Breakfast</th>
                <th>Lunch</th>
                <th>Dinner</th>
              </tr>
            </thead>
            <tbody>
              {days.map((d, index) => {
                let label = isNaturalWeek ? d.day : `Day ${index + 1}`;
                let tag = "";
                if (index === todayIndex) tag = "Today";
                if (index === todayIndex - 1) tag = "Yesterday";
                if (index === todayIndex + 1) tag = "Tomorrow";

                return (
                  <tr key={d.day}>
                    <td>
                      <div className="day-label">
                        <strong>{label}</strong>
                        {tag && <div className="day-tag">{tag}</div>}
                      </div>
                      
                    </td>
                    {d.meals.map((m, i) => (
                      <td key={i}>
                        <div className="mp-meal">
                          {m.image && (
                            <img src={m.image} alt={m.title} width={70} height={60} />
                          )}
                          <div className="meal-content">
                            <strong>{m.title}</strong>
                            <div className="meal-ready-in">Ready in: {m.readyInMinutes ?? m.ready_in_minutes} mins</div>
                            {m.sourceUrl && (
                                <a href={m.sourceUrl} target="_blank" rel="noreferrer">
                                View recipe
                                </a>
                            )}
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}