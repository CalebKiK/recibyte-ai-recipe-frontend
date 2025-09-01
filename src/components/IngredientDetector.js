"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import '../styles/IngredientDetector.css';
import * as tf from '@tensorflow/tfjs';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";

const IngredientDetector = ({ model, onIngredientsDetected }) => {
    const videoRef = useRef(null);
    const imagePreviewRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null); 

    const [imageSrc, setImageSrc] = useState(null);
    const [capturedPhoto, setCapturedPhoto] = useState(null); 
    const [detectedIngredients, setDetectedIngredients] = useState([]);
    const [ingredient, setIngredient] = useState('');
    const [processing, setProcessing] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);  
    const [error, setError] = useState(null);
    const [commonIngredientsMap, setCommonIngredientsMap] = useState(null);
    const [loadingGenerate, setLoadingGenerate] = useState(false);
    const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
    const router = useRouter();

    // Load the ingredients map once when the component mounts
    useEffect(() => {
        const loadIngredientsMap = async () => {
            try {
                const response = await fetch('/data/commonIngredientsMapData.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                const map = data.reduce((acc, item) => {
                    acc[item.coco_label.toLowerCase()] = item.canonical_name;
                    return acc;
                }, {});
                setCommonIngredientsMap(map);
                console.log("Common ingredients map loaded:", map);
            } catch (err) {
                console.error("Failed to load common ingredients map:", err);
                setError("Failed to load ingredient definitions. Please refresh.");
            }
        };

        loadIngredientsMap();
    }, []); 

    // Helper function to map detected labels to actual ingredients
    const getCanonicalIngredients = useCallback((predictions) => {
        if (!commonIngredientsMap) {
            console.warn("Ingredients map not loaded yet when trying to get canonical ingredients.");
            return [];
        }

        const uniqueIngredients = new Set();
        
        predictions.forEach(p => {
            if (p.score > 0.6) { 
                const canonicalName = commonIngredientsMap[p.class.toLowerCase()];
                if (canonicalName) {
                    uniqueIngredients.add(canonicalName);
                }
            }
        });
        return Array.from(uniqueIngredients);
    }, [commonIngredientsMap]); // Dependency here is crucial


    // Core detection function - reusable for both image and photo
    const performDetection = useCallback(async (imageElement) => {
        if (!model || !imageElement || !commonIngredientsMap) { // Ensure map is loaded here too
            setError("AI model or ingredient definitions not loaded.");
            setProcessing(false);
            return;
        }

        setProcessing(true);
        setError(null);
        setDetectedIngredients([]); 
        drawBoundingBoxes(imageElement, []); // Clear canvas immediately on new detection attempt

        try {
            const predictions = await model.detect(imageElement);
            console.log('Raw COCO-SSD Predictions:', predictions);

            const canonicalIngredients = getCanonicalIngredients(predictions);
            setDetectedIngredients(canonicalIngredients);
            onIngredientsDetected(canonicalIngredients); 

            drawBoundingBoxes(imageElement, predictions); // Draw new boxes

        } catch (err) {
            console.error('Error during object detection:', err);
            setError("Failed to detect ingredients. Please try again.");
        } finally {
            setProcessing(false);
        }
    }, [model, onIngredientsDetected, getCanonicalIngredients, commonIngredientsMap]); // Add commonIngredientsMap to deps

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target.result); // This will trigger the useEffect for detection
                setCapturedPhoto(null); // Clear captured photo if user uploads an image
                setDetectedIngredients([]); // Clear previous detections immediately
                setError(null); // Clear any previous errors
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClearImage = () => {
        setImageSrc(null);
        setCapturedPhoto(null); // Clear captured photo as well
        setDetectedIngredients([]);
        setError(null); // Clear any errors
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        // Crucially, reset the file input's value to allow re-uploading the same file
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset file input
        }
    };

    const handleReplaceImage = () => {
        // Clear current image and detections before opening file dialog
        handleClearImage(); 
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const startWebcam = async () => {
        setError(null);
        setImageSrc(null); // Clear any existing image preview when starting webcam
        setDetectedIngredients([]); // Clear previous detections
        setCapturedPhoto(null); // Clear previous captured photo
        try {
            // Option 1: Prefer 'user' (front camera) first, then 'environment' (rear)
            let stream;
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            } catch (userErr) {
                console.warn("Front camera failed, trying rear camera:", userErr);
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            }

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                console.log("Webcam started and stream assigned:", stream);
                setCameraActive(true);
            }
        } catch (err) {
            console.error('Error accessing webcam:', err);
            setError("Could not access webcam. Please ensure camera permissions are granted. Error: " + err.message);
            setCameraActive(false);
        }
    };

    const stopWebcam = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
    };

    const takePhoto = () => {
        if (videoRef.current && videoRef.current.readyState === 4) { // Ensure video is ready
            const video = videoRef.current;
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg'); 

            setImageSrc(dataUrl); // Set photo as preview, triggering detection useEffect
            setCapturedPhoto(dataUrl); // Store for potential re-detection if needed
            stopWebcam(); // Stop webcam after taking photo
        } else {
            setError("Webcam not ready to capture photo. Please try again.");
            console.warn("Attempted to take photo, but videoRef.current was not ready.");
        }
    };

    // Effect to trigger detection when imagePreviewRef (the <img>) loads
    useEffect(() => {
        const imgElement = imagePreviewRef.current;
        if (imgElement && imageSrc && commonIngredientsMap) { // Crucial: ensure commonIngredientsMap is loaded
            const handleImageLoad = () => {
                performDetection(imgElement);
            };
            // Add listener directly if imgElement is already loaded, or use onLoad prop
            // For robustness, add and clean up the event listener
            imgElement.addEventListener('load', handleImageLoad);
            
            // If the image is already in cache and loads instantly, the 'load' event might fire
            // before the listener is attached. We can manually trigger if it's already complete.
            if (imgElement.complete && imgElement.naturalHeight !== 0) {
                 handleImageLoad();
            }

            return () => {
                imgElement.removeEventListener('load', handleImageLoad);
            };
        }
    }, [imageSrc, performDetection, commonIngredientsMap]); // commonIngredientsMap added as dependency


    // Cleanup webcam stream when component unmounts
    useEffect(() => {
        return () => {
            stopWebcam();
        };
    }, []);

    const drawBoundingBoxes = (imgElement, predictions) => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const displayWidth = imgElement.clientWidth;
        const displayHeight = imgElement.clientHeight;

        // const { naturalWidth, naturalHeight } = imgElement;
        canvas.width = displayWidth;
        canvas.height = displayHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings

        // Scale factors between natural and displayed sizes
        const scaleX = displayWidth / imgElement.naturalWidth;
        const scaleY = displayHeight / imgElement.naturalHeight;

        predictions.forEach(p => {
            const [x, y, width, height] = p.bbox;

            // Scale bounding boxes
            const scaledX = x * scaleX;
            const scaledY = y * scaleY;
            const scaledWidth = width * scaleX;
            const scaledHeight = height * scaleY;

            ctx.beginPath();
            ctx.rect(scaledX, scaledY, scaledWidth, scaledHeight);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#00FF00';
            ctx.fillStyle = 'rgba(0, 255, 0, 0.2)'; 
            ctx.stroke();
            ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);

            ctx.fillStyle = '#00FF00';
            ctx.font = '15px Arial';
            const textX = scaledX;
            const textY = scaledY > 20 ? scaledY - 10 : scaledY + 20; 
            ctx.fillText(`${p.class} (${Math.round(p.score * 100)}%)`, textX, textY);
        });
    };

    const handleInputChange = (event) => {
        setIngredient(event.target.value);
    };

    const handleAddIngredient = () => {
        if (ingredient.trim() !== '') {
            setDetectedIngredients([...detectedIngredients, ingredient.trim().toLowerCase()]);
            setIngredient('');
        }
    };

    const handleRemoveIngredient = (index) => {
        const updatedList = detectedIngredients.filter((_, i) => i !== index);
        setDetectedIngredients(updatedList);
    };

    const handleGenerateRecipes = async () => {
            if(detectedIngredients.length > 0) {
                try {
                    setLoadingGenerate(true);
                     const ingredientsQuery = detectedIngredients.map(encodeURIComponent).join(',');
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
        <div className={`ingredient-detector-component ${!model || !commonIngredientsMap ? 'loading' : ''}`}>
            {!commonIngredientsMap && <p className="loading-message">Loading ingredient definitions...</p>}

            <p className="instruction-message">
                Ready to see what you can cook? Simply <span>upload an existing photo</span> of your ingredients or <span>snap a new one</span> using your device&apos;s camera. Our AI will do the rest!
            </p>
            <div className="input-options">
                <label className="button-label">
                    Upload Image
                    <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} style={{ display: 'none' }} disabled={!model || !commonIngredientsMap} /> {/* Disable if model/map not ready */}
                </label>
                {/* {!cameraActive ? (
                    <button onClick={startWebcam} className="action-button" disabled={!model || !commonIngredientsMap}>Take a Photo</button>
                ) : (
                    <button onClick={stopWebcam} className="action-button secondary">Stop Camera</button>
                )} */}
            </div>

            {error && <p className="error-message">{error}</p>}

            {cameraActive && (
                <div className="webcam-preview-container">
                    <video 
                        key={cameraActive} 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="webcam-feed"
                        style={{ width: '100%', maxWidth: '600px', height: 'auto', border: '1px solid #ddd' }}
                    ></video>
                    <button onClick={takePhoto} className="action-button capture-button">Capture Photo</button>
                </div>
            )}

            {imageSrc && (
                <div className="image-preview-container">
                    <Image 
                        ref={imagePreviewRef} 
                        src={imageSrc} 
                        alt="Ingredient Preview"
                        width={600}
                        height={400}
                        className="uploaded-image-preview" 
                        style={{ width: '100%', maxWidth: '600px', height: 'auto', display: 'block' }} 
                    />
                    {processing && <p className="processing-message">Detecting ingredients...</p>}
                    <canvas 
                        ref={canvasRef} 
                        className="detection-canvas" 
                        style={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '100%', 
                            height: '100%',
                            display: (imageSrc && !processing && detectedIngredients.length > 0) ? 'block' : 'none' 
                        }} 
                    />

                    <div className='upload-modification-btn'>
                        <button onClick={handleClearImage} className="action-button clear-button">Clear Image</button>
                        <button onClick={handleReplaceImage} className="action-button replace-button">Replace Image</button>
                    </div>
                </div>
            )}

            {detectedIngredients.length > 0 && (
                <div className="detected-results">
                    <h3>Detected Ingredients:</h3>
                    <ul>
                        {detectedIngredients.map((ing, index) => (
                            <li key={index}>
                                {ing}
                                <button onClick={() => handleRemoveIngredient(index)}>x</button>
                            </li>
                            
                        ))}
                    </ul>
                    <p>Review the detected ingredients. You can manually add or remove any from the list below if needed.</p>

                    <div className="ingredients-input">
                        <input
                            placeholder='Add your ingredients here...'
                            value={ingredient}
                            onChange={handleInputChange}
                            onKeyDown={(e) =>{
                                if (e.key === 'Enter') {
                                    handleAddIngredient();
                                }
                            }}
                        />
                        <button className='add-ingredient-btn' onClick={handleAddIngredient}>Add</button>
                    </div>
                    
                    <button 
                        className="action-button proceed-button" 
                        onClick={handleGenerateRecipes}
                        // onClick={() => onIngredientsDetected(detectedIngredients)}
                        disabled={loadingGenerate}
                    >
                        <FontAwesomeIcon icon={faUtensils} />{" "}
                        {loadingGenerate ? (
                            <>
                                Cooking up ideas<span className="dots"></span>
                            </>
                        ) : (
                            "Confirm & Find Recipes!"
                        )}
                    </button>
                </div>
            )}
             {imageSrc && !processing && detectedIngredients.length === 0 && (
                <p className="no-detection-message">No common ingredients detected with high confidence from this image. Please try another or add manually.</p>
            )}
        </div>
    );
};

export default IngredientDetector;
