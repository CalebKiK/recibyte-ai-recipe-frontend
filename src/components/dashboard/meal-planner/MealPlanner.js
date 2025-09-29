"use client";

import React, { useState, useEffect } from "react";
import '../../../styles/dashboard/meal-planner/MealPlanner.css';
import AddMealPlanForm from './AddMealPlanForm';
import Modal from "@/components/modals/Modal";
import MealPlanSchedule from "./MealPlanSchedule";
import { useAuth } from "@/context/AuthContext";
import { getMealPlans } from "@/api/mealPlans";

export default function MealPlanner() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [lastPlanResponse, setLastPlanResponse] = useState(null);
    const { token } = useAuth();

    const openModal = () => setShowAddModal(true);
    const closeModal = () => setShowAddModal(false);

    // callback when a plan is generated/saved inside form
    const handlePlanSaved = (response) => {
        setLastPlanResponse(response);
        closeModal();
    };

    useEffect(() => {
        async function fetchLatestPlan() {
            if (!token) return;
            try {
                const plans = await getMealPlans(token); 
                if (plans.length > 0) {
                    setLastPlanResponse({ saved: true, meal_plan: plans[0] });
                }
            } catch (err) {
                console.error("Failed to load saved plans:", err);
            }
        }
        fetchLatestPlan();
    }, [token]);

    function handleConfirmMealPlan() {
        confirmMealPlan(lastPlanResponse.meal_plan.id, token)
            .then(confirmed => setLastPlanResponse({ saved: true, meal_plan: confirmed }))
            .catch(err => alert("Failed to confirm plan: " + err.message));
    }
    
    return (
        <div className="meal-planner-component">
            <div className='meal-planner-header'>
                <h3>Your Weekly Menu / Meal Prep Lab</h3>
                {/* Button below conditionally rendered if there is no meal plan or if it is 3 days to the end of current meal plan */}
                <button className="add-meal-plan-btn" onClick={openModal}>Add Meal Plan</button>
            </div>
            
            <p>A week of delicious decisions, all in one place. We do the math, you make the magic.</p>

            {lastPlanResponse ? (
                <>
                    <MealPlanSchedule response={lastPlanResponse} />

                    {lastPlanResponse.meal_plan?.status === "draft" && (
                    <button
                        className="confirm-meal-plan-btn"
                        onClick={handleConfirmMealPlan}
                    >
                        Confirm Meal Plan
                    </button>
                    )}
                </>
            ) : (
                <p className="empty-hint">No plan generated yet — click “Add Meal Plan” to get started.</p>
            )}

            <Modal show={showAddModal} onClose={closeModal} ariaLabel="Add Meal Plan">
                <AddMealPlanForm onSaved={handlePlanSaved} onClose={closeModal} />
            </Modal>
        </div>
    );
}