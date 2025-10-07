"use client";

import '../../styles/dashboard/Favourites.css';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import FavouritesRecipeCard from './FavsRecipeCard';
import toast from 'react-hot-toast';
import { toggleRecipeFavourite } from '@/api/recipes';
import { fetchUserFavorites } from '@/api/users';
import RecipeDetailModal from '../modals/RecipeDetailModal';

export default function Favourites() {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dots, setDots] = useState("");
    const [message, setMessage] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        async function getFavorites() {
            setLoading(true);
            try {
                const fetchedFavorites = await fetchUserFavorites();
                setFavorites(fetchedFavorites);
            } catch (error) {
                toast.error('Failed to load favourites.');
            } finally {
                setLoading(false);
            }
        }

        if (user) getFavorites();
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

    const handleRemove = async (recipe) => {
        try {
            // const res = await axios.put(`https://backend-recipbyte.fly.dev/api/users/favorites/${id}/toggle/`, {}, {
            //     headers: { Authorization: `Bearer ${user}` },
            // });
            const res = await toggleRecipeFavourite(recipe);
            toast.success(res.data.message);

            // Refetch updated favorites
            // const updatedRes = await axios.get('https://backend-recipbyte.fly.dev/api/users/profile/', {
            //     headers: { Authorization: `Bearer ${user}` },
            // });
            const updatedFavorites = await fetchUserFavorites();
            setFavorites(updatedFavorites);
            // setFavorites(updatedRes.data.favorite_recipes || []);
        } catch (err) {
            toast.error('Failed to remove from favorites.');
        }
    };

    const handleCardClick = (recipeId) => {
        setExpandedId(prev => prev === recipeId ? null : recipeId);
    };

    return (
        <div className="user-favourites-component">
            <h2>Your Culinary Hall of Fame</h2>
            {loading ? (
                <p className='dashboard-section-load-message'>{`Cooking up your favorites${dots}`}</p>
            ) : favorites.length === 0 ? (
                <p>No recipes in favourites at the moment.</p>
            ) : (
                <div className="favourites-list">
                    {favorites.map((recipe) => (
                        <FavouritesRecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            onClick={() => setSelectedRecipe(recipe)}
                            onRemove={() => handleRemove(recipe.id)}
                        />
                    ))}
                    <RecipeDetailModal
                        recipe={selectedRecipe}
                        show={!!selectedRecipe}
                        onClose={() => setSelectedRecipe(null)}
                    />
                </div>
            )}
            {/* {message && <p className='message'>{message}</p>} */}
        </div>
    );
}