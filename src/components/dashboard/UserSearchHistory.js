"use client";

import '../../styles/dashboard/UserSearchHistory.css';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import SearchHistoryCard from './SearchHistoryCard';
import toast from 'react-hot-toast';
import { fetchUserSearchHistory } from '@/api/users';

export default function UserSearchHistory() {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [dots, setDots] = useState("");

    useEffect(() => {
        async function loadHistory() {
            setLoading(true);
            try {
                const data = await fetchUserSearchHistory();
                setHistory(data || []);
            } catch (error) {
                toast.error('Failed to load history.');
            } finally {
                setLoading(false);
            }
        }
        loadHistory();
    }, [user]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => {
                if (prev === "....") return "";
                return prev + ".";
            });
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const handleCardClick = (recipeId) => {
        setExpandedId(prev => prev === recipeId ? null : recipeId);
    };

    const handleDelete = async (id) => {
        try {
            await deleteSearchHistory(id);
            setHistory(prev => prev.filter(item => item.id !== id));
            toast.success('Search history deleted');
            } catch (err) {
            toast.error('Failed to delete search history');
        }
    };

    return (
        <div className="user-search-history-component">
            <h2>Your Recent Explorations</h2>
            {loading ? (
                <p className='dashboard-section-load-message'>{`Fetching your culinary history${dots}`}</p>
            ) : history.length === 0 ? (
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