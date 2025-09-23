"use client";

import React, { useState } from "react";
import '../../../styles/dashboard/meal-planner/MealPlanner.css';
import AddMealPlanForm from './AddMealPlanForm';
import Modal from "@/components/modals/Modal";
import MealPlanSchedule from "./MealPlanSchedule";

export default function MealPlanner() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [lastPlanResponse, setLastPlanResponse] = useState(null);

    const openModal = () => setShowAddModal(true);
    const closeModal = () => setShowAddModal(false);

    // callback when a plan is generated/saved inside form
    const handlePlanSaved = (response) => {
        setLastPlanResponse(response);
        closeModal();
    };
    
    return (
        <div className="meal-planner-component">
            <div className='meal-planner-header'>
                <h2>Your Weekly Menu / Meal Prep Lab</h2>
                {/* Button below conditionally rendered if there is no meal plan or if it is 3 days to the end of current meal plan */}
                <button onClick={openModal}>Add Meal Plan</button>
            </div>
            
            <p>A week of delicious decisions, all in one place. We do the math, you make the magic.</p>

            {lastPlanResponse ? (
                <MealPlanSchedule response={lastPlanResponse} />
            ) : (
                <p className="empty-hint">No plan generated yet — click “Add Meal Plan” to get started.</p>
            )}

            <Modal show={showAddModal} onClose={closeModal} ariaLabel="Add Meal Plan">
                <AddMealPlanForm onSaved={handlePlanSaved} onClose={closeModal} />
            </Modal>
        </div>
    );
}