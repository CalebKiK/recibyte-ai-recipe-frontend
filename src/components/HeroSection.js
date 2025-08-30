"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import '../styles/HomePage.css';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faDice, faUtensils } from "@fortawesome/free-solid-svg-icons";

export default function HeroSection() {

    const [ingredient, setIngredient] = useState('');
    const [ingredientsList, setIngredientsList] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const { user } = useAuth();
    const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
    const router = useRouter();
    const [loadingGenerate, setLoadingGenerate] = useState(false);
    const [loadingSnap, setLoadingSnap] = useState(false);
    const [loadingRandom, setLoadingRandom] = useState(false);
    const [dots, setDots] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => {
                if (prev === ".....") return "";
                return prev + ".";
            });
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const backgroundImages = [
        '/images/background-images/alexandru-bogdan-ghita-UeYkqQh4PoI-unsplash.jpg',
        '/images/background-images/anh-nguyen-kcA-c3f_3FE-unsplash.jpg',
        '/images/background-images/eaters-collective-12eHC6FxPyg-unsplash.jpg',
        '/images/background-images/gaelle-marcel-GaLWM8dX73U-unsplash.jpg',
        '/images/background-images/joseph-gonzalez-fdlZBWIP0aM-unsplash.jpg',
        '/images/background-images/katie-smith-uQs1802D0CQ-unsplash.jpg',
        '/images/background-images/lily-banse--YHSwy6uqvk-unsplash.jpg',
        '/images/background-images/mariana-medvedeva-iNwCO9ycBlc-unsplash.jpg',
        '/images/background-images/megan-thomas-xMh_ww8HN_Q-unsplash.jpg',
        '/images/background-images/odiseo-castrejon--OXFGMUaNhM-unsplash.jpg',
        '/images/background-images/pexels-ella-olsson-572949-1640777.jpg',
        '/images/background-images/pexels-ella-olsson-572949-3026802.jpg',
        '/images/background-images/pexels-picjumbo-com-55570-196643.jpg',
        '/images/background-images/pexels-vanmalidate-769289.jpg',
        '/images/background-images/thermopro-wAkmA9I54dY-unsplash.jpg',
        '/images/background-images/victoria-shes-UC0HZdUitWY-unsplash.jpg',
    ];

    const handleInputChange = (event) => {
        setIngredient(event.target.value);
    };

    const handleAddIngredient = () => {
        if (ingredient.trim() !== '') {
            setIngredientsList([...ingredientsList, ingredient.trim().toLowerCase()]);
            setIngredient('');
        }
    };

    const handleRemoveIngredient = (index) => {
        const updatedList = ingredientsList.filter((_, i) => i !== index);
        setIngredientsList(updatedList);
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const handleRestrictionChange = (restriction) => {
        if (dietaryRestrictions.includes(restriction)) {
            setDietaryRestrictions(dietaryRestrictions.filter((r) => r !== restriction));
        } else {
            setDietaryRestrictions([...dietaryRestrictions, restriction]);
        }
    };

    const goToImageDetectorPage = async () => {
        try {
            setLoadingSnap(true);
            router.push('/image-detector');
        } catch (error) {
            console.error(error);
            toast.error("Error navigating to Image Detector.");
            setLoadingSnap(false);
        }
    };

    const handleRandomRecipe = async () => { 
        try {
            setLoadingRandom(true);
            const response = await fetch('http://127.0.0.1:8000/api/recipes/random/'); 

            if (response.ok) {
                const data = await response.json();
                router.push(`/recipes?random=true`);
            } else if (response.status === 404) {
                toast.error("No recipes found in the database. Please import some recipes first!");
            }
            else {
                console.error("Failed to fetch random recipe:", response.status);
                toast.error("Failed to fetch a random recipe. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching random recipe:", error);
            toast.error("An error occurred while fetching a random recipe. Check console for details.");
        } finally {
            setLoadingRandom(false);
        }
    };

    const handleGenerateRecipes = async () => {
        if(ingredientsList.length > 0) {
            try {
                setLoadingGenerate(true);
                 const ingredientsQuery = ingredientsList.map(encodeURIComponent).join(',');
                const restrictionsQuery = dietaryRestrictions.map(encodeURIComponent).join(',');

                let url = `/recipes?ingredients=${ingredientsQuery}`;
                if (restrictionsQuery) {
                    url += `&dietaryRestrictions=${restrictionsQuery}`;
                }

                router.push(url);
            } catch (error) {
                console.error("Error generating recipes:", error);
                toast.error("Something went wrong. Please try again.");
                setLoadingGenerate(false);
            }
        } else {
            toast.error("Please enter at least 1 ingredient.")
        }
    };
    
    return (
        <div className="hero-section-component">
            <h1>Welcome{user?.username ? `, ${user.username}` : ''}!</h1>
            <h2>Let&apos;s turn your ingredients into culinary magic.</h2>
            <div className="ingredients-component">
                <div className="swipe-background-container">
                    <div className="swipe-track">
                        {backgroundImages.concat(backgroundImages).map((src, index) => (
                        <img
                            key={index}
                            src={src}
                            alt=""
                            className="swipe-image"
                        />
                        ))}
                    </div>
                </div>
                <div className="ingredients-section">
                    <div className="ingredients-input">
                        <input
                            placeholder={`Add your ingredients here${dots}`}
                            value={ingredient}
                            onChange={handleInputChange}
                            onKeyDown={(e) =>{
                                if (e.key === 'Enter') {
                                    handleAddIngredient();
                                }
                            }}
                        />
                        <button className='add-ingredient-btn' onClick={handleAddIngredient}>Add</button>
                        {/* <button className='filters-btn' onClick={toggleFilters}>
                            <span role="img" aria-label="filters">⚙️</span>
                        </button> */}
                        {showFilters && (
                            <div className='filters-dropdown'>
                                <label>
                                    <input
                                        type="checkbox"
                                        value="vegetarian"
                                        checked={dietaryRestrictions.includes('vegetarian')}
                                        onChange={() => handleRestrictionChange('vegetarian')}
                                    />
                                    Vegetarian
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        value="vegan"
                                        checked={dietaryRestrictions.includes('vegan')}
                                        onChange={() => handleRestrictionChange('vegan')}
                                    />
                                    Vegan
                                </label>
                            </div>
                        )}
                    </div>
                    <div className='ingredients-filters-list'>
                        <ul className='ingredients-list'>
                            {ingredientsList.map((item, index) => (
                                <li key={index}>
                                    {item}
                                    <button onClick={() => handleRemoveIngredient(index)}>x</button>
                                </li>
                            ))
                            }
                        </ul>
                        <ul className='filters-list'></ul>
                    </div>
                    <div className='homepage-btns-desktop'>
                        <button 
                            className='generate-recipe-btn' 
                            onClick={handleGenerateRecipes}
                            disabled={loadingGenerate}
                        >
                            <FontAwesomeIcon icon={faUtensils} />{" "}
                            {loadingGenerate ? (
                                <>
                                    Cooking up ideas<span className="dots"></span>
                                </>
                            ) : (
                                "Generate Recipes!"
                            )}
                        </button>
                        <div className='to-other-options'>
                            <button 
                                className='to-image-detection-btn' 
                                onClick={goToImageDetectorPage}
                                disabled={loadingSnap}
                            >
                                <FontAwesomeIcon icon={faCamera} />{" "}
                                {loadingSnap ? (
                                    <>
                                        Snapping to it<span className="dots"></span>
                                    </>
                                ) : (
                                    "Snap Ingredients"
                                )}
                            </button>
                            <button 
                                className='feeling-adventurous-btn' 
                                onClick={handleRandomRecipe}
                                disabled={loadingRandom}
                            >
                                <FontAwesomeIcon icon={faDice} /> {" "}
                                {loadingRandom ? (
                                    <>
                                        Rolling the dice<span className="dots"></span>
                                    </>
                                ) : (
                                    "Feeling Adventurous?"
                                )}
                            </button>
                        </div>
                    </div>

                    <div className='homepage-btns-mobile'>
                        <button 
                            className='generate-recipe-btn' 
                            onClick={handleGenerateRecipes}
                            disabled={loadingGenerate}
                        >
                            <FontAwesomeIcon icon={faUtensils} />{" "}
                            {loadingGenerate ? (
                                <>
                                    Cooking up ideas<span className="dots"></span>
                                </>
                            ) : (
                                "Generate Recipes!"
                            )}
                        </button>

                        {/* <button 
                            className='generate-recipe-btn' 
                            onClick={handleGenerateRecipes}
                            disabled={loadingGenerate}
                        >
                            <FontAwesomeIcon icon={faUtensils} />{" "}
                            {loadingGenerate ? "Cooking up ideas…" : "Generate Recipes!"}
                        </button> */}

                        <div className='homepage-btns-tier-2'>
                            <button 
                                className='to-image-detection-btn' 
                                onClick={goToImageDetectorPage}
                                disabled={loadingSnap}
                            >
                                <FontAwesomeIcon icon={faCamera} />{" "}
                                {loadingSnap ? (
                                    <>
                                        Snapping to it<span className="dots"></span>
                                    </>
                                ) : (
                                    "Snap Ingredients"
                                )}
                            </button>
                            <button 
                                className='feeling-adventurous-btn' 
                                onClick={handleRandomRecipe}
                                disabled={loadingRandom}
                            >
                                <FontAwesomeIcon icon={faDice} /> {" "}
                                {loadingRandom ? (
                                    <>
                                        Rolling the dice<span className="dots"></span>
                                    </>
                                ) : (
                                    "Feeling Adventurous?"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}