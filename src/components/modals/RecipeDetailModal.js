"use client";

import "../../styles/modals/RecipeDetailModal.css";
import { toSentenceCase, toTitleCase } from "@/utils/stringFormatters";
import Image from "next/image";

export default function RecipeDetailModal({ recipe, show, onClose }) {
  if (!show || !recipe) return null;

  const displayIngredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
        .map((ing) =>
          typeof ing === "string"
            ? toSentenceCase(ing)
            : ing?.name
            ? toSentenceCase(ing.name)
            : ""
        )
        .filter(Boolean)
        .join(", ")
    : typeof recipe.ingredients === "string"
    ? toSentenceCase(recipe.ingredients.trim())
    : "N/A";

  const instructionSteps = Array.isArray(recipe.instructions)
    ? recipe.instructions
    : typeof recipe.instructions === "string"
    ? recipe.instructions
        .split(". ")
        .filter((step) => step.trim() !== "")
    : [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="recipe-modal recipe-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
            <div className="modal-image">
                {recipe.image && (
                    <div className="modal-image">
                        <Image
                        src={recipe.image}
                        alt={recipe.title}
                        width={200}
                        height={150}
                        />
                    </div>
                )}
            </div>
            <div className="modal-header-content">
                <div className="modal-heading">
                    <h2>{toTitleCase(recipe.title)}</h2>
                    <button className="close-btn" onClick={onClose} title="Remove recipe">
                        ✕
                    </button>
                </div>
                <p><strong>Ingredients:</strong></p>
                <p>{displayIngredients}</p>
            </div>
        </div>
        
        <div className="modal-content">
          <div className="modal-instructions">
            <p>
              <strong>Instructions:</strong>
            </p>
            <ul>
              {instructionSteps.map((step, index) => (
                <li key={index}>{toSentenceCase(step.trim())}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}