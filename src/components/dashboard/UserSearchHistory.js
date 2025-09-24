"use client";

import '../../styles/dashboard/UserSearchHistory.css';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import SearchHistoryCard from './SearchHistoryCard';
import toast from 'react-hot-toast';
import { fetchUserSearchHistory } from '@/api/users';

export default function UserSearchHistory() {
    const { token } = useAuth();
    const [history, setHistory] = useState([]);
    const [message, setMessage] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        async function loadHistory() {
            try {
                const data = await fetchUserSearchHistory(token);
                setHistory(data || []);
            } catch (error) {
                toast.error('Failed to load history.');
            }
        }
        loadHistory();
    }, [token]);

    const handleCardClick = (recipeId) => {
        setExpandedId(prev => prev === recipeId ? null : recipeId);
    };

    const handleDelete = async (id) => {
        try {
            await deleteSearchHistory(id, token);
            setHistory(prev => prev.filter(item => item.id !== id));
            toast.success('Search history deleted');
            } catch (err) {
            toast.error('Failed to delete search history');
        }
    };

    return (
        <div className="recipe-history-component">
            <h2>Your Recent Explorations</h2>
            {history.length === 0 ? (
                <p>You haven’t explored any recipes yet.</p>
            ) : (
                <div className="user-search-history-list">
                    {
                        history.map(item => (
                            <SearchHistoryCard
                                key={item.id}
                                recipe={item}
                                isExpanded={expandedId===item.id}
                                onClick={() => handleCardClick(item.id)}
                                onRemove={() => handleDelete(item.id)}
                                showRemove={false}
                            />
                        ))
                    }
                </div>
                
            )}
            {message && <p className='message'>{message}</p>}
        </div>
    );
}