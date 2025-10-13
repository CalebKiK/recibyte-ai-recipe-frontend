"use client";

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchUserProfile } from '@/api/users';
import '../../../../styles/dashboard/user-profile/personal-info/ProfileData.css';

export default function PersonalPreferences() {
    const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
    const [culinaryPreferences, setCulinaryPreferences] = useState([]);
    const [availableRestrictions, setAvailableRestrictions] = useState([]);
    const [bio, setBio] = useState("");

    // useEffect(() => {
    //     let mounted = true;
    //     fetch("/data/dietaryRestrictions.json")
    //     .then((r) => r.json())
    //     .then((data) => {
    //         if (mounted) setAvailableRestrictions(data || []);
    //     })
    //     .catch(() => {
    //         if (mounted) setAvailableRestrictions([]);
    //     });
    //     return () => (mounted = false);
    // }, []);

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
            .then(setAvailableRestrictions)
            .catch(() => setAvailableRestrictions([]));
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
                    <div className='diet-preference'>
                        <label>Diet</label>
                        <div className="profile-filters-dropdown">
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
                    </div>
                    
                    <div className='profile-culinary-preferences'>
                        <label>Culinary</label>
                        <input 
                            placeholder="e.g. Italian, Mediterranean" 
                            value={culinaryPreferences} 
                            onChange={e => setCulinaryPreferences(e.target.value.split(","))}
                        />
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