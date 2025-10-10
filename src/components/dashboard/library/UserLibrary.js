"use client";

import React, { useState } from 'react';
import '../../../styles/dashboard/library/UserLibrary.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Favourites from './../library/Favourites';
import UserSearchHistory from './UserSearchHistory';


export default function UserLibrary() {
    const [selectedSection, setSelectedSection] = useState('favourites');
    
      const renderSection = () => {
        switch (selectedSection) {
            case 'favourites':
                return <Favourites />;
            case 'search-history':
                return <UserSearchHistory />;
            default:
                return <Favourites />
        }
      };

    return (
        <div className="user-library-component">
            {/* <h2>Your Library</h2> */}
            <div className='user-library-content'>
                <div className='user-library-links'>
                    <button 
                        onClick={() => setSelectedSection('favourites')} 
                        className={selectedSection === 'favourites' ? 'active' : ''}
                    >
                        <FontAwesomeIcon icon={faThumbsUp} className="library-links-icon" />
                        Recipe Favourites
                    </button>
                    <button 
                        onClick={() => setSelectedSection('search-history')} 
                        className={selectedSection === 'search-history' ? 'active' : ''}
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="library-links-icon" />
                        User History
                    </button>
                </div>
                <div className='selected-library-link'>
                    {renderSection()}
                </div>
            </div>
        </div>
    );
}