"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { proposeMealPlan } from "@/api/mealPlans";
import toast from "react-hot-toast";
import '../../../styles/dashboard/meal-planner/AddMealPlanForm.css';
import MealPlanSchedule from "./MealPlanSchedule";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function sanitizeText(input = "") {
  return String(input).replace(/<[^>]*>?/gm, "").trim();
}

const excludeTokenRegex = /^[\w\s\-,']+$/;

export default function AddMealPlanForm({ onSaved = () => {}, onClose = () => {} }) {
    const { token } = useAuth();
    const [diet, setDiet] = useState("");
    const [diets, setDiets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [planResponse, setPlanResponse] = useState(null);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const oneYearFromToday = new Date();
    oneYearFromToday.setFullYear(today.getFullYear() + 1);

    const todayFormatted = today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');

    useEffect(() => {
        let mounted = true;
        fetch("/data/dietaryRestrictions.json")
        .then((r) => r.json())
        .then((data) => {
            if (mounted) setDiets(data || []);
        })
        .catch(() => {
            if (mounted) setDiets([]);
        });
        return () => (mounted = false);
    }, []);

    const validationSchema = () =>
        Yup.object({
        timeFrame: Yup.string().oneOf(["week", "day"]).required("Timeframe is required"),
        startDate: Yup.date()
            .required("Start date is required")
            .min(yesterday, "Start date cannot be before today")
            .max(oneYearFromToday, "Start date cannot be more than a year from today"),
        targetCalories: Yup.number()
            .nullable()
            .transform((v, o) => (String(o).trim() === "" ? null : v))
            .integer("Must be a whole number")
            .min(0, "Must be 0 or greater")
            .max(10000, "Unrealistic calorie target")
            .notRequired(),
        diet: Yup.string()
            .nullable()
            .notRequired()
            .test("allowed-diet", "Selected diet is invalid", (val) => {
                if (!val) return true; // allow empty
                return diets.includes(val);
            }),
        exclude: Yup.string()
            .nullable()
            .transform((v) => (String(v).trim() === "" ? null : v))
            .test("valid-exclude", "Exclude contains invalid characters", (value) => {
            if (!value) return true;
            // split by comma and ensure tokens match allowed chars
            const tokens = value.split(",").map((t) => t.trim()).filter(Boolean);
            if (tokens.length === 0) return true;
            return tokens.every((t) => excludeTokenRegex.test(t));
            })
            .max(500, "Exclude list too long")
            .notRequired(),
        save: Yup.boolean(),
        title: Yup.string()
            .nullable()
            .transform((v) => (String(v).trim() === "" ? null : v))
            .max(100, "Title must be 100 characters or fewer")
            .test("no-tags", "Title contains invalid characters", (v) => {
            if (!v) return true;
            // basic check: no angle brackets
            return !/[<>]/.test(v);
            })
            .notRequired(),
        });

    const initialValues = {
        timeFrame: "week",
        startDate: todayFormatted,
        targetCalories: "",
        diet: "",
        exclude: "",
        save: true,
        title: "",
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        if (!token) {
            toast.error("Please log in to generate meal plans.");
            setSubmitting(false);
            return;
        }

        const payload = {
            timeFrame: values.timeFrame,
            startDate: values.startDate,
            targetCalories: 
                values.targetCalories !== "" && values.targetCalories !== null 
                ? Number(values.targetCalories) 
                : undefined,
            // only send diet if it's a known option
            diet: values.diet && diets.includes(values.diet) ? values.diet : undefined,
            exclude: undefined,
            save: Boolean(values.save),
            title: values.title ? sanitizeText(values.title) : undefined,
        };

        if (values.exclude && String(values.exclude).trim() !== "") {
            const tokens = String(values.exclude)
                .split(",")
                .map((t) => sanitizeText(t))
                .filter(Boolean);
            payload.exclude = tokens.length > 0 ? tokens : undefined;
        }

        setSubmitting(true);

        try {
            const data = await proposeMealPlan(payload, token);
            setPlanResponse(data);
            toast.success("Meal plan generated.");
            onSaved(data);
        } catch (err) {
            console.error("Error proposing meal plan:", err);
            const msg = (err && err.message) || "Failed to generate meal plan";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };
    
    return (
        <div className="add-meal-plan-form">
            <h2>Cook Up a Plan!</h2>
            <p>Your personalized meal plan is a few clicks away./ Give us the details; we&apos;ll handle the rest.</p>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
                {({ isSubmitting, values, setFieldValue }) => (
                <Form>
                    <div className="generate-meal-plan-form-inputs">
                        <div className="generate-meal-plan-input-container">
                            <label>
                                Timeframe:<span className="required-asterisk">*</span>
                                <Field as="select" name="timeFrame">
                                    <option value="week">Week</option>
                                    <option value="day">Day</option>
                                </Field>
                            </label>
                            <div className="field-error">
                                <ErrorMessage name="timeFrame" component="div" className="error-message" />
                            </div>
                        </div>

                        <div className="generate-meal-plan-input-container">
                            <label>
                                Start Date:<span className="required-asterisk">*</span>
                                <Field type="date" name="startDate" />
                            </label>
                            <div className="field-error">
                                <ErrorMessage name="startDate" component="div" className="error-message" />
                            </div>
                        </div>

                        <div className="generate-meal-plan-input-container">
                            <label>
                                Target calories (optional):
                                <Field type="number" name="targetCalories" min="0" />
                            </label>
                            <div className="field-error">
                                <ErrorMessage name="targetCalories" component="div" className="error-message" />
                            </div>
                        </div>

                        <div className="generate-meal-plan-input-container">
                            <label>
                                Diet (optional):
                                <Field as="select" name="diet">
                                    <option value="">— none —</option>
                                    {diets.map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                    ))}
                                </Field>
                            </label>
                            <div className="field-error">
                                <ErrorMessage name="diet" component="div" className="error-message" />
                            </div>
                        </div>

                        <div className="generate-meal-plan-input-container">
                            <label>
                                Exclude (comma-separated ingredients):
                                <Field name="exclude" as="input" placeholder="shellfish, olives" />
                            </label>
                            <div className="field-error">
                                <ErrorMessage name="exclude" component="div" className="error-message" />
                            </div>
                        </div>
                        
                        <div className="generate-meal-plan-input-container">
                            <label className="checkbox-label">
                                Save plan to account:
                                <Field name="save" type="checkbox" />
                            </label>
                        </div>

                        <div className="generate-meal-plan-input-container">
                            <label>
                                Title (optional):
                                <Field name="title" as="input" placeholder="My weekly plan" />
                            </label>
                            <div className="field-error">
                                <ErrorMessage name="title" component="div" className="error-message" />
                            </div>
                        </div>
                    </div>

                    <div className="generate-meal-plan-form-buttons">
                        <button type="submit" className="generate-meal-plan-btn" disabled={isSubmitting}>
                            {isSubmitting ? "Generating..." : "Generate Meal Plan"}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                            // reset and close
                            onClose();
                            }}
                            style={{ marginLeft: 8 }}
                            className="cancel-generate-meal-plan-btn"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    </div>

                    <div className="save-plan-tip">
                        <small>Tip: Use the &quot;Save plan&quot; checkbox to store the generated plan in your account.</small>
                    </div>

                    {planResponse && (
                    <>
                        <hr />
                        <MealPlanSchedule response={planResponse} />
                    </>
                    )}
                </Form>
                )}
            </Formik>

            {planResponse && (
                <>
                    <hr />
                    <MealPlanSchedule response={planResponse} />
                </>
            )}
    
        </div>
    );
}