"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { fetchUserProfile } from '@/api/users';
import '../../../../styles/dashboard/user-profile/personal-info/ProfileData.css';

export default function PersonalData() {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({
        avatar: "default.png",
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        gender: "prefer-not-to-say",
        member_since: ""
    });

    const [dots, setDots] = useState("");

    useEffect(() => {
            const interval = setInterval(() => {
                setDots((prev) => {
                    if (prev === "....") return "";
                    return prev + ".";
                });
            }, 500);
            return () => clearInterval(interval);
        }, []
    );

    useEffect(() => {
        fetchUserProfile()
          .then(data => {
              console.log("📌 Mapped profile data in PersonalData.js:", data);
              const profile = Array.isArray(data) ? data[0] : data;
              setUserData({
                  avatar: profile.user.profile_photo || "default.png",
                  username: profile.user.username,
                  first_name: profile.user.first_name,
                  last_name: profile.user.last_name,
                  email: profile.user.email,
                  gender: profile.gender || "prefer-not-to-say",
                  member_since: profile.member_since
              });
          })
          .catch(() => toast.error("Could not load user info"))
          .finally(() => setLoading(false));
    }, []);

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

    const handleAvatarChange = () => {
        toast.success("Avatar change feature is still cooking.");
    }

    return (
        <div className="personal-data-card">
            <h3>Personal Information</h3>

            {loading ? (
                <p>Loading{dots}</p>
            ) : (
                <div className='user-info'>
                    <div className="avatar-section">
                        <Image 
                            src={`/images/avatars/${userData.avatar}`} 
                            alt="Recibyte User Avatar" 
                            className="avatar-img" 
                            height={100} 
                            width={100} 
                        />
                        <button onClick={handleAvatarChange}>
                            Change Avatar
                        </button>
                    </div>
                    <div className="personal-fields">
                        <div className='user-names'>
                            <div className='personal-fields-info'>
                                <label>Username</label>
                                <input value={userData.username} readOnly />
                            </div>
                            <div className='personal-fields-info'>
                                <label>First Name</label>
                                <input value={userData.first_name} readOnly />
                            </div>
                            <div className='personal-fields-info'>
                                <label>Last Name</label>
                                <input value={userData.last_name} readOnly />
                            </div>
                        </div>
                        
                        <div className='user-email-gender'>
                            <div className='personal-fields-info'>
                                <label>Email</label>
                                <input value={userData.email} readOnly />
                            </div>  
                            <div className='personal-fields-info'>
                                <label>Gender</label>
                                <select value={userData.gender}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="non-binary">Non-Binary</option>
                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className='other-personal-info'>
                            <p>Member since 
                                <span>{userData.member_since}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
            
            <div className='profile-crud-btns'>
                <button onClick={handleEdit} className="profile-edit-btn">Edit</button>
                <button onClick={handleSave} className="profile-save-btn">Save Changes</button>
            </div>
            
        </div>
    );
}