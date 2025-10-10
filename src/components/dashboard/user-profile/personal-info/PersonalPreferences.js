"use client";

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function PersonalPreferences() {
    const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
    const [culinaryPreferences, setCulinaryPreferences] = useState([]);
    const [availableRestrictions, setAvailableRestrictions] = useState([]);
    const [bio, setBio] = useState("");

    useEffect(() => {
        let mounted = true;
        fetch("/data/dietaryRestrictions.json")
        .then((r) => r.json())
        .then((data) => {
            if (mounted) setAvailableRestrictions(data || []);
        })
        .catch(() => {
            if (mounted) setAvailableRestrictions([]);
        });
        return () => (mounted = false);
    }, []);

    const handleSave = () => {
        toast.success("Preferences saved successfully!");
        // TODO: connect to backend
        console.log("Saving preferences:", {
            dietaryRestrictions,
            culinaryPreferences,
            bio
        });
    };

    const handleSingleRestrictionChange = (e) => {
        const value = e.target.value;
        if (value) {
            // Keep the state as an array [value] for backend consistency
            setDietaryRestrictions([value]); 
        } else {
            setDietaryRestrictions([]); // Reset if 'Diet' (empty value) is chosen
        }
    };

    return (
        <div className="preferences-card">
            <h3>Preferences</h3>

            <label>Dietary Restrictions</label>
            <div className="filters-dropdown">
                <select
                    className="select-field"
                    // Use dietaryRestrictions[0] for value, or empty string if array is empty
                    value={dietaryRestrictions[0] || ""} 
                    onChange={handleSingleRestrictionChange}
                    disabled={availableRestrictions.length === 0}
                >
                    <option value="">Diet (Select One)</option>
                    {availableRestrictions.map((restriction) => (
                    <option key={restriction} value={restriction}>
                        {restriction}
                    </option>
                    ))}
                </select>
                {/* Optional: Add a loading message if data is still fetching and availableRestrictions is empty */}
                {availableRestrictions.length === 0 && <p className="text-sm text-gray-500">Loading...</p>}
            </div>

            <label>Culinary Preferences</label>
            <input 
                placeholder="e.g. Italian, Mediterranean" 
                value={culinaryPreferences} 
                onChange={e => setCulinaryPreferences(e.target.value.split(","))}
            />

            <label>Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} />

            <button onClick={handleSave} className="save-btn">Save Preferences</button>
        </div>
    );
}