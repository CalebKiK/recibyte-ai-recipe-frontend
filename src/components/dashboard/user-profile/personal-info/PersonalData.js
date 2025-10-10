"use client";

import React, { useState } from 'react';
import '../../../../styles/dashboard/user-profile/personal-info/ProfileData.css';

export default function PersonalData() {
    const [avatar, setAvatar] = useState("avatar1.png");
    const [username, setUsername] = useState("Foodie123");
    const [firstName, setFirstName] = useState("John");
    const [lastName, setLastName] = useState("Doe");
    const [email, setEmail] = useState("john@example.com");
    const [gender, setGender] = useState("prefer-not-to-say");
    const memberSince = "July 2024";

    const handleSave = () => {
        // TODO: connect to backend
        console.log("Saving personal data...");
    };

    return (
        <div className="personal-data-card">
            <h3>Personal Information</h3>

            <div className="avatar-section">
                <img src={`/avatars/${avatar}`} alt="User Avatar" className="avatar-img" />
                <button onClick={() => setAvatar("avatar2.png")}>Change Avatar</button>
            </div>

            <div className="personal-fields">
                <label>Username</label>
                <input value={username} onChange={e => setUsername(e.target.value)} />

                <label>Full Name</label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)} />
                <input value={lastName} onChange={e => setLastName(e.target.value)} />

                <label>Email</label>
                <input value={email} disabled />

                <label>Gender</label>
                <select value={gender} onChange={e => setGender(e.target.value)}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-Binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                </select>

                <p className="member-since">Member since {memberSince}</p>
            </div>

            <button onClick={handleSave} className="save-btn">Save Changes</button>
        </div>
    );
}