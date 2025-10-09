"use client";

import Navbar from "@/components/shared/Navbar";
import RecipeChoice from "@/components/recipes/RecipeChoice";
import RecipeSuggestions from "@/components/recipes/RecipeSuggestions";
import WhyRecipe from "@/components/recipes/WhyRecipe";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getRecipesByIngredients, getRandomRecipes } from "@/api/recipes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { addSearchHistory } from "@/api/users"; 
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import '../../styles/recipes/RecipePage.css';

function RecipePageContent() {
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
        const fetchRecipes = async () => {
            setLoading(true);
            setError(null);

            const ingredients = searchParams.get('ingredients');
            const dietaryRestrictions = searchParams.get('dietaryRestrictions');
            const isRandom = searchParams.get('random');

            try {
                let fetchedRecipes = [];

                if (isRandom === 'true') {
                    const data = await getRandomRecipes();
                    fetchedRecipes = [data];
                } else if (ingredients) {
                    const data = await getRecipesByIngredients(ingredients, dietaryRestrictions);
                    fetchedRecipes = data;
                } else {
                    setError('No search criteria provided to fetch recipes.');
                    setLoading(false);
                    return;
                }

                setRecipes(fetchedRecipes);
                if (fetchedRecipes.length === 1) {
                    setSelectedRecipe(fetchedRecipes[0]);
                } else {
                    setSelectedRecipe(null);
                }

                if (user && fetchedRecipes.length > 0 && isRandom !== 'true') {
                    const minimalResults = fetchedRecipes.map(r => ({
                        id: r.id,
                        title: r.title,
                        image: r.image,
                    }));

                    await addSearchHistory(
                        {
                            ingredients: ingredients?.split(",") || [],
                            restrictions: dietaryRestrictions?.split(",") || [],
                        },
                        minimalResults
                    );
                }
            
            } catch (err) {
                console.error("Error fetching recipes:", err);
                if (err?.detail) {
                    setError(err.detail);
                } else if (err?.error) {
                    setError(err.error);
                } else {
                    toast.error("Recipe radar empty. Try new search?");
                    setError("Hmm… looks like we couldn’t find any recipes with those ingredients.");
                }
                setRecipes([]);
                setSelectedRecipe(null);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [searchParams, user]);

    const handleUpdateFavourite = (id, isFav, source) => {
        setRecipes(prev =>
            prev.map(r =>
                r.id === id && (r.source || "local_db") === source
                    ? { ...r, is_favorite: isFav }
                    : r
            )
        );
        if (selectedRecipe?.id === id && (selectedRecipe.source || "local_db") === source) {
            setSelectedRecipe({ ...selectedRecipe, is_favorite: isFav });
        }
    };

    const handleSelectRecipe = (recipe) => {
        setSelectedRecipe(recipe);
    };

    return(
        <>
            {loading && <p>Loading recipes{dots}</p>}
            {/* {error && (
                <div className="error-message">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="error-icon" />
                    <p>{error}</p>
                </div>
            )} */}
            {error && <p className="error-message">{error}</p>}

            {!loading && !error && recipes.length > 0 && (
                <>
                    {recipes.length > 1 && (
                            <RecipeSuggestions recipes={recipes} onSelectRecipe={handleSelectRecipe} />
                    )}

                    {selectedRecipe && (
                        <RecipeChoice recipe={selectedRecipe} onUpdateFavourite={handleUpdateFavourite} />
                    )}

                    {recipes.length === 1 && !selectedRecipe && (
                        <p>No recipe selected from the single result.</p>
                    )}
                </>
            )}

            {!loading && !error && recipes.length === 0 && !selectedRecipe && (
                <p>No recipes found based on your criteria.</p>
            )}
            {/* {recipes.length > 0 && <WhyRecipe />} */}
        </>
    );
}

export default function RecipePage() {
    return (
        <div className="recipe-page">
            <Navbar /> 
            <Suspense fallback={<div>Loading page content...</div>}>
                <RecipePageContent />
            </Suspense>
        </div>
    );
}