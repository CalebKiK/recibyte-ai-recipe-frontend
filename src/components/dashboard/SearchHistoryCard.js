"use client";

import { useState } from 'react';
import '../../styles/dashboard/UserSearchHistory.css';
import ConfirmModal from '../modals/ConfirmModal';
import { formatCreatedAt } from '@/utils/formatDate';

export default function SearchHistoryCard({ recipe, onClick, onRemove, showRemove = true }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const { id, query, minimal_results, created_at } = recipe;

    return (
        <>
            <div className="search-history-card" onClick={onClick}>
                <div className='search-history-card-content'>
                    <div className='search-history-card-params'>
                        {query.ingredients?.length > 0 && (
                            <p><strong>Ingredients:</strong> {query.ingredients.join(", ")}</p>
                        )}
                        {query.restrictions?.length > 0 && (
                            <p><strong>Dietary Restrictions:</strong> {query.restrictions.join(", ")}</p>
                        )}
                        {query.preferences?.length > 0 && (
                            <p><strong>Preferences:</strong> {query.preferences.join(", ")}</p>
                        )}
                    </div>
                    
                    <div className='search-history-card-stats'>
                        <p>Recipes found: {minimal_results?.length || 0}</p>
                        <small>{formatCreatedAt(created_at)}</small>
                    </div>
                    
                </div>

                <div className='search-history-card-remove-btn'>
                    {showRemove && (
                        <button className="remove-button" 
                            onClick={(e) => {
                            e.stopPropagation();
                            setShowConfirm(true);
                        }}>x</button>
                    )}
                </div>
            </div>

            {/* Confirm Modal */}
            <ConfirmModal
                show={showConfirm}
                title="Remove from Search History?"
                message={`Are you sure you want to remove this entry?`}
                confirmText="Remove"
                cancelText="Cancel"
                onConfirm={() => {
                setShowConfirm(false);
                onRemove();
                }}
                onCancel={() => setShowConfirm(false)}
            />
        </>
        
    );
}