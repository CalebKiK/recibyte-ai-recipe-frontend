"use client";

import React, { useState } from 'react';
import '../../styles/dashboard/UserLibrary.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Favourites from './Favourites';
import UserSearchHistory from './UserSearchHistory';


export default function UserProfile() {

    return (
        <div className="user-profile-component">
            <h2>Your Profile</h2>
        </div>
    );
}