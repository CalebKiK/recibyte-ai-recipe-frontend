"use client";

import '../../styles/dashboard/Favourites.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import RecipeItem from './RecipeItem';
import toast from 'react-hot-toast';
import { toggleRecipeFavourite } from '@/api/recipes';
import { fetchUserProfile, fetchUserFavorites } from '@/api/users';

export default function Favourites() {
    const { token } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [message, setMessage] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        async function getFavorites() {
            try {
                const fetchedFavorites = await fetchUserFavorites(token);
                setFavorites(fetchedFavorites);
            } catch (error) {
                toast.error('Failed to load favourites.');
            }
        }

        if (token) {
            getFavorites();
        }
            
    }, [token]);

    const handleRemove = async (recipe) => {
        try {
            // const res = await axios.put(`https://backend-recipbyte.fly.dev/api/users/favorites/${id}/toggle/`, {}, {
            //     headers: { Authorization: `Bearer ${token}` },
            // });
            const res = await toggleRecipeFavourite(recipe, token);
            toast.success(res.data.message);

            // Refetch updated favorites
            // const updatedRes = await axios.get('https://backend-recipbyte.fly.dev/api/users/profile/', {
            //     headers: { Authorization: `Bearer ${token}` },
            // });
            const updatedProfile = await fetchUserProfile(token);
            setFavorites(updatedProfile[0]?.favorite_recipes || []);
            // setFavorites(updatedRes.data.favorite_recipes || []);
        } catch (err) {
            toast.error('Failed to remove from favorites.');
        }
    };

    // const handleRemove = async (id) => {
    //     try {
    //         const res = await axios.put(`https://backend-recipbyte.fly.dev/api/users/favorites/${id}/toggle/`, {}, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         setFavorites(prev => prev.filter(r => r.id !== id));
    //         setMessage(res.data.message);
    //     } catch (err) {
    //         setMessage('Failed to remove from favorites.');
    //     }
    // };

    const handleCardClick = (recipeId) => {
        setExpandedId(prev => prev === recipeId ? null : recipeId);
    };

    return (
        <div className="user-favourites-component">
            <h2>Recipe Favourites</h2>
            {favorites.length === 0 ? (
                <p>No recipes in favourites at the moment.</p>
            ) : (
                favorites.map(recipe => (
                    <RecipeItem
                        key={recipe.id}
                        recipe={recipe}
                        isExpanded={expandedId === recipe.id}
                        onClick={() => handleCardClick(recipe.id)}
                        onRemove={() => handleRemove(recipe.id)}
                    />
                ))
            )}
            {/* {message && <p className='message'>{message}</p>} */}
        </div>
    );
}