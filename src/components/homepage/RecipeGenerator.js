"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/homepage/RecipeGenerator.css';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faDice, faUtensils } from "@fortawesome/free-solid-svg-icons";

export default function RecipeGenerator() {
    const [ingredient, setIngredient] = useState('');
    const [ingredientsList, setIngredientsList] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
    const router = useRouter();
    const [loadingGenerate, setLoadingGenerate] = useState(false);
    const [loadingSnap, setLoadingSnap] = useState(false);
    const [loadingRandom, setLoadingRandom] = useState(false);
    const [dots, setDots] = useState("");
    const [showTip, setShowTip] = useState(false);
    const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);

    const placeholders = [
        "Add your ingredients here...",
        "e.g., Chicken, Rice, Soy Sauce",
        "Try adding 2 or more ingredients for better results!",
        "What's in your pantry?"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPlaceholderIndex(
                (prevIndex) => (prevIndex + 1) % placeholders.length
            );
        }, 5000); // Change placeholder every 5 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => {
                if (prev === "....") return "";
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
        if (event.target.value.length > 0) {
            setShowTip(true);
        }
    };

    const handleInputBlur = () => {
        setShowTip(false);
    };

    const handleAddIngredient = () => {
        // Handle multiple ingredients separated by commas
        if (ingredient.includes(',')) {
            const newIngredients = ingredient
                .split(',')
                .map(item => item.trim().toLowerCase())
                .filter(item => item !== '');

            let validIngredients = [];
            for (const newIngredient of newIngredients) {
                if (!/^[a-zA-Z\s-]+$/.test(newIngredient)) {
                    toast.error(`"${newIngredient}" contains invalid characters. Please use only letters, spaces or dashes.`);
                    return;
                }
                if (newIngredient.length > 30) {
                    toast.error(`"${newIngredient}" is too long (max 30 characters).`);
                    return;
                }
                if (newIngredient.length < 3) {
                    toast.error(`"${newIngredient}" is too short (min 3 characters).`);
                    return;
                }
                if (ingredientsList.includes(newIngredient)) {
                    toast.error(`You already added "${newIngredient}".`);
                    return;
                }
                validIngredients.push(newIngredient);
            }

            if (ingredientsList.length + validIngredients.length > 8) {
                toast.error("You can only add up to 8 ingredients in total.");
                return;
            }

            setIngredientsList([...ingredientsList, ...validIngredients]);
            setIngredient('');
            setShowTip(false);
            return;
        }

        // Handle single ingredient
        const newIngredient = ingredient.trim().toLowerCase();

        if (!newIngredient){
            toast.error("Ingredient cannot be empty.");
            return;
        }

        if (!/^[a-zA-Z\s-]+$/.test(newIngredient)) {
            toast.error("Ingredient should only contain letters, spaces or dashes.")
            return;
        }

        if (newIngredient.length > 30) {
            toast.error("Ingredient name is too long (max 30 characters).");
            return;
        }

        if (newIngredient.length < 3) {
            toast.error("Ingredient name is too short (min 3 characters).");
            return;
        }

        if (ingredientsList.length > 8) {
            toast.error("You can only add up to 8 ingredients.");
            return;
        }

        if (ingredientsList.includes(newIngredient)) {
            toast.error("You already added this ingredient.");
            return;
        }

        setIngredientsList([...ingredientsList, newIngredient]);
        setIngredient('');
        setShowTip(false);
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
            const response = await fetch('https://backend-recipbyte.fly.dev/api/recipes/random/'); 

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
        <div className="recipe-generator-component">
            <div className="swipe-background-container">
                <div className="swipe-track">
                    {backgroundImages.concat(backgroundImages).map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt="swipe-background images"
                        className="swipe-image"
                    />
                    ))}
                </div>
            </div>
            <div className="ingredients-section">
                <div className="ingredients-input">
                    <input
                        // placeholder={`Add your ingredients here${dots}`}
                        placeholder={placeholders[currentPlaceholderIndex]}
                        value={ingredient}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onFocus={() => setShowTip(true)}
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
                {showTip && ingredientsList.length < 3 && (
                    <div className="tip-popover">
                        Tip: Adding more ingredients will get you better recipes!
                    </div>
                )}
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
                <div className='gen-recipe-btns-desktop'>
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

                <div className='gen-recipe-btns-mobile'>
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

                    <div className='gen-recipe-btns-tier-2'>
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
    );
}