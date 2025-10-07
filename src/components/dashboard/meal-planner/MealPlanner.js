"use client";

import React, { useState, useEffect } from "react";
import '../../../styles/dashboard/meal-planner/MealPlanner.css';
import AddMealPlanForm from './AddMealPlanForm';
import Modal from "@/components/modals/Modal";
import MealPlanSchedule from "./MealPlanSchedule";
import { useAuth } from "@/context/AuthContext";
import { getMealPlans, confirmMealPlan } from "@/api/mealPlans";
import toast from "react-hot-toast";

export default function MealPlanner() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [lastPlanResponse, setLastPlanResponse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dots, setDots] = useState("");
    const { user } = useAuth();

    // const openModal = () => setShowAddModal(true);
    // const openModal = () => {
    //     if (lastPlanResponse?.meal_plan?.status === "active") {
    //         toast.error("You already have an active plan for this timeframe.");
    //         return;
    //     }
    //     setShowAddModal(true);
    // };

    // Add feature for where the modal allows to open maybe 2 - 3 days before the current plan ends
    const openModal = async () => {
        try {
            const plans = await getMealPlans();
            const active = plans.find(p => p.status === "active");
            if (active) {
                toast.error("You already have an active plan for this timeframe.");
                return;
            }
            setShowAddModal(true);
        } catch (err) {
            console.log("Error checking existing plans:", err || err.message);
            toast.error("Could not verify existing plans. Try again.");
        }
    };

    const closeModal = () => setShowAddModal(false);

    // callback when a plan is generated/saved inside form
    const handlePlanSaved = (response) => {
        setLastPlanResponse(response);
        closeModal();
    };

    useEffect(() => {
        async function fetchLatestPlan() {
            if (!user) return;
            setLoading(true);
            try {
                const plans = await getMealPlans(user); 
                if (plans.length > 0) {
                    // setLastPlanResponse({ saved: true, meal_plan: plans[0] });
                    const active = plans.find(p => p.status === "active");
                    setLastPlanResponse({ saved: true, meal_plan: active || plans[0] });
                }
            } catch (err) {
                console.error("Failed to load saved plans:", err || err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchLatestPlan();
    }, [user]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => {
                if (prev === "....") return "";
                return prev + ".";
            });
        }, 500);
        return () => clearInterval(interval);
    }, []);

    function handleConfirmMealPlan() {
        confirmMealPlan(lastPlanResponse.meal_plan.id)
            .then(confirmed => {
                setLastPlanResponse({ saved: true, meal_plan: confirmed });
                toast.success('Meal plan confirmed successfully.');
            })
            .catch(err => toast.error("Failed to confirm plan: " + (err.detail || err.message || "Unknown error")));
    }
    
    return (
        <div className="meal-planner-component">
            <div className='meal-planner-header'>
                <h3>Your Weekly Menu / Meal Prep Lab</h3>
                {/* Button below conditionally rendered if there is no meal plan or if it is 3 days to the end of current meal plan */}
                <button className="add-meal-plan-btn" onClick={openModal}>Add Meal Plan</button>
            </div>
            
            <p>A week of delicious decisions, all in one place. We do the math, you make the magic.</p>

            {loading ? (
                <p className='dashboard-section-load-message'>{`Loading your meal plan${dots}`}</p>
            ) : lastPlanResponse ? (
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