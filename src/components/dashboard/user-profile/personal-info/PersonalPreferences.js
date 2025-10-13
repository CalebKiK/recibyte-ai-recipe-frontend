"use client";

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchUserProfile } from '@/api/users';
import '../../../../styles/dashboard/user-profile/personal-info/ProfileData.css';

export default function PersonalPreferences() {
    const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
    const [culinaryPreferences, setCulinaryPreferences] = useState([]);
    const [availableDietRestrictions, setAvailableDietRestrictions] = useState([]);
    const [availableCulinaryPreferences, setAvailableCulinaryPreferences] = useState([]);
    const [bio, setBio] = useState("");

    useEffect(() => {
        fetchUserProfile()
            .then(data => {
                const profile = Array.isArray(data) ? data[0] : data;
                setDietaryRestrictions(profile.dietary_restrictions || []);
                setCulinaryPreferences(profile.culinary_preferences || []);
                setBio(profile.bio || "");
            })
            .catch(() => toast.error("Could not load preferences"));

        fetch("/data/dietaryRestrictions.json")
            .then(r => r.json())
            .then(setAvailableDietRestrictions)
            .catch(() => setAvailableDietRestrictions([]));

        fetch("/data/culinaryPreferences.json")
            .then(r => r.json())
            .then(setAvailableCulinaryPreferences)
            .catch(() => setAvailableCulinaryPreferences([]));
    }, []);

    const handleSave = () => {
        toast.success("Changes noted! Save feature is still baking.");
        // TODO: connect to backend
        console.log("Saving preferences:", {
            dietaryRestrictions,
            culinaryPreferences,
            bio
        });
    };

    const handleEdit = () => {
        // TODO: connect to backend
        toast.success("Tweaking unlocked! Our save feature is still simmering.");
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
            <div className='preferences-content'>
                <div className='user-preferences'>
                    <div className='profile-diet-preference'>
                        <label>Diet</label>
                        <div className="profile-filters-dropdown">
                            <select
                                className="select-field"
                                // Use dietaryRestrictions[0] for value, or empty string if array is empty
                                value={dietaryRestrictions[0] || ""} 
                                onChange={handleSingleRestrictionChange}
                                disabled={availableDietRestrictions.length === 0}
                            >
                                <option value="">Diet (Select One)</option>
                                {availableDietRestrictions.map((restriction) => (
                                <option key={restriction} value={restriction}>
                                    {restriction}
                                </option>
                                ))}
                            </select>
                            {availableDietRestrictions.length === 0 && <p className="text-sm text-gray-500">Loading...</p>}
                        </div>
                    </div>
                    
                    <div className='profile-culinary-preferences'>
                        <label>Culinary</label>
                        <div className="profile-filters-dropdown">
                            <select
                                className="select-field"
                                // Use dietaryRestrictions[0] for value, or empty string if array is empty
                                value={culinaryPreferences[0] || ""} 
                                onChange={handleSingleRestrictionChange}
                                disabled={availableCulinaryPreferences.length === 0}
                            >
                                <option value="">Culinary preference (Select One)</option>
                                {availableCulinaryPreferences.map((restriction) => (
                                <option key={restriction} value={restriction}>
                                    {restriction}
                                </option>
                                ))}
                            </select>
                            {availableCulinaryPreferences.length === 0 && <p className="text-sm text-gray-500">Loading...</p>}
                        </div>
                        {/* <input 
                            placeholder="e.g. Italian, Mediterranean" 
                            value={culinaryPreferences} 
                            onChange={e => setCulinaryPreferences(e.target.value.split(","))}
                        /> */}
                    </div>
                </div>

                <div className='user-bio'>
                    <label>Bio</label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)} />
                </div>
            </div>

            <div className='profile-crud-btns'>
                <button onClick={handleEdit} className="profile-edit-btn">Edit</button>
                <button onClick={handleSave} className="profile-save-btn">Save Preferences</button>
            </div>
            
        </div>
    );
}