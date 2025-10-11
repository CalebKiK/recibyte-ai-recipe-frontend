"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
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
        toast.success("Changes noted! Save feature is still baking.");
        // TODO: connect to backend
        // console.log("Saving preferences:", {
        //     dietaryRestrictions,
        //     culinaryPreferences,
        //     bio
        // });
    };

    const handleEdit = () => {
        // TODO: connect to backend
        toast.success("Tweaking unlocked! Our save feature is still simmering.");
    };

    return (
        <div className="personal-data-card">
            <h3>Personal Information</h3>

            <div className='user-info'>
                <div className="avatar-section">
                    <Image src={`/avatars/${avatar}`} alt="User Avatar" className="avatar-img" height={100} width={100} />
                    <button onClick={() => setAvatar("avatar2.png")}>Change Avatar</button>
                </div>

                <div className="personal-fields">
                    <div className='user-names'>
                        <div className='personal-fields-info'>
                            <label>Username</label>
                            <input value={username} onChange={e => setUsername(e.target.value)} />
                        </div>
                        
                        <div className='personal-fields-info'>
                            <label>First Name</label>
                            <input value={firstName} onChange={e => setFirstName(e.target.value)} />
                        </div>
                        
                        <div className='personal-fields-info'>
                            <label>Last Name</label>
                            <input value={lastName} onChange={e => setLastName(e.target.value)} />
                        </div>
                    </div>
                    

                    <div className='user-email-gender'>
                        <div className='personal-fields-info'>
                            <label>Email</label>
                            <input value={email} disabled />
                        </div>
                        

                        <div className='personal-fields-info'>
                            <label>Gender</label>
                            <select value={gender} onChange={e => setGender(e.target.value)}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="non-binary">Non-Binary</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className='other-personal-info'>
                        <p className="member-since">Member since {memberSince}</p>
                    </div>
                </div>
            </div>
            
            <div className='profile-crud-btns'>
                <button onClick={handleEdit} className="profile-edit-btn">Edit</button>
                <button onClick={handleSave} className="profile-save-btn">Save Changes</button>
            </div>
            
        </div>
    );
}