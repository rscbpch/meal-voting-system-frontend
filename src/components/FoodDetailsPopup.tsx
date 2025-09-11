/**
 * FoodDetailsPopup Component
 * 
 * A popup component that displays detailed information about a food item with feedback functionality.
 * 
 * Features:
 * - Displays food image on the left and information on the right
 * - Supports both English and Khmer languages based on LanguageContext
 * - Shows feedback section with conditional display based on voter state
 * - If isVoter=true: Shows feedback form on left and feedback list on right
 * - If isVoter=false: Shows only feedback list (full width)
 * 
 * Usage Examples:
 * 
 * 1. For Staff (MenuManagement):
 * ```tsx
 * <FoodDetailsPopup
 *   isOpen={showDetailsPopup}
 *   onClose={() => setShowDetailsPopup(false)}
 *   dish={selectedDish}
 *   isVoter={false} // Staff members are not voters
 * />
 * ```
 * 
 * 2. For Voters (MenuPage or other voter pages):
 * ```tsx
 * <FoodDetailsPopup
 *   isOpen={showDetailsPopup}
 *   onClose={() => setShowDetailsPopup(false)}
 *   dish={selectedDish}
 *   isVoter={true} // Voters can submit feedback
 * />
 * ```
 * 
 * 3. With CardV2 component:
 * ```tsx
 * <CardV2
 *   // ... other props
 *   onViewDetails={() => handleViewDetails(dish.id)}
 * />
 * ```
 */

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaCat,
    FaDog,
    FaDragon,
    FaHippo,
    FaCrow,
    FaFrog,
    FaFish,
    FaHeart,
} from "react-icons/fa";
import type { Dish } from "../services/dishService";
import type { FeedbackItem } from "../services/feedbackService";
import { fetchDishFeedbacks, createDishFeedback } from "../services/feedbackService";
import Loading from "./Loading";

interface FoodDetailsPopupProps {
    isOpen: boolean;
    onClose: () => void;
    dish: Dish | null;
    isVoter: boolean;
    favoriteCount?: number;
    totalWishes?: number | null;
}

const animalIcons = [FaCat, FaDog, FaDragon, FaHippo, FaCrow, FaFrog, FaFish];

const FoodDetailsPopup = ({ isOpen, onClose, dish, isVoter, favoriteCount = 0, totalWishes }: FoodDetailsPopupProps) => {
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [feedbackForm, setFeedbackForm] = useState({
        food: 0,
        content: ""
    });

    // Fetch feedbacks when popup opens and dish changes
    useEffect(() => {
        if (isOpen && dish?.id) {
            fetchFeedbacks();
        }
    }, [isOpen, dish?.id]);

    // Lock body scroll when popup is open
    useEffect(() => {
        if (isOpen) {
            // Save current scroll position
            const scrollY = window.scrollY;
            // Lock body scroll
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            
            return () => {
                // Restore scroll position when popup closes
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen]);

    const fetchFeedbacks = async () => {
        if (!dish?.id) return;
        
        try {
            setLoading(true);
            console.log("Fetching feedbacks for dish:", dish.id);
            const response = await fetchDishFeedbacks(dish.id);
            console.log("Feedback response:", response);
            setFeedbacks(response.feedbacks || []);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitFeedback = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dish?.id || (!feedbackForm.content.trim() && feedbackForm.food === 0)) return;

        try {
            setSubmitting(true);
            console.log("Submitting feedback for dish:", dish.id, "with data:", {
                food: feedbackForm.food > 0 ? feedbackForm.food : undefined,
                content: feedbackForm.content.trim() || undefined
            });
            
            const result = await createDishFeedback(dish.id, {
                food: feedbackForm.food > 0 ? feedbackForm.food : undefined,
                content: feedbackForm.content.trim() || undefined
            });
            
            console.log("Feedback submission result:", result);
            
            // Reset form
            setFeedbackForm({ food: 0, content: "" });
            
            // Refresh feedbacks
            await fetchFeedbacks();
        } catch (error) {
            console.error("Error submitting feedback:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const Star = ({ filled, onClick }: { filled: boolean; onClick?: () => void }) => (
        <svg
            className={`w-5 h-5 ${filled ? "text-yellow-500" : "text-gray-300"} ${onClick ? "cursor-pointer hover:text-yellow-400" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            onClick={onClick}
        >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    );

    const StarInput = ({
        value,
        onChange,
        label,
    }: {
        value: number;
        onChange: (v: number) => void;
        label: string;
    }) => {
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
                <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => {
                        const filled = i < value;
                        return (
                            <button
                                type="button"
                                key={i}
                                aria-label={`Rate ${i + 1} star`}
                                onClick={() => {
                                    // If clicking the same star that's already selected, unselect it
                                    if (value === i + 1) {
                                        onChange(0);
                                    } else {
                                        onChange(i + 1);
                                    }
                                }}
                                className="focus:outline-none hover:scale-110 transition-transform"
                            >
                                <svg
                                    className={`w-6 h-6 ${
                                        filled ? "text-yellow-500" : "text-gray-300"
                                    }`}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const MAX_CHARS = 250;
    const remaining = Math.max(0, MAX_CHARS - feedbackForm.content.length);

    // Calculate rating statistics from feedbacks
    const ratingStats = feedbacks.reduce((acc, feedback) => {
        if (typeof feedback.food === "number" && feedback.food > 0) {
            acc.totalRatings += 1;
            acc.totalScore += feedback.food;
        }
        return acc;
    }, { totalRatings: 0, totalScore: 0 });

    const averageRating = ratingStats.totalRatings > 0 
        ? (ratingStats.totalScore / ratingStats.totalRatings).toFixed(1)
        : 0;

    const renderFeedbackItem = (feedback: FeedbackItem) => {
        const date = new Date(feedback.createdAt);
        const formattedDate = `${date.toLocaleDateString(undefined, {
            day: "2-digit",
            month: "short",
        })}, ${date.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })}`;

        // Stable "random" index based on feedback id
        const randomIndex = feedback.id
            ? feedback.id % animalIcons.length
            : Math.floor(Math.random() * animalIcons.length);
        const AnimalIcon = animalIcons[randomIndex];

        return (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between p-3 pb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#EAF6E7] flex items-center justify-center text-[#3E7B27] text-lg">
                            <AnimalIcon />
                        </div>
                        <span className="text-gray-700 font-medium text-sm">
                            Anonymous
                        </span>
                    </div>
                    <span className="text-xs text-gray-400">
                        {formattedDate}
                    </span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100"></div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1 bg-green-50 rounded-full px-2 py-1">
                            <span className="text-gray-600 text-xs font-medium">
                                Food:
                            </span>
                            <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        filled={typeof feedback.food === "number" && feedback.food > 0 && i < feedback.food}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-700 text-sm whitespace-pre-wrap break-words">
                        {feedback.content}
                    </p>
                </div>
            </div>
        );
    };

    if (!dish) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Food Details
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto">
                            {/* Top Section - Food Info */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-start gap-6">
                                    {/* Food Image */}
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={dish.imageURL || "/placeholder-food.jpg"}
                                            alt={dish.name}
                                            className="w-32 h-32 object-cover rounded-full shadow-md"
                                        />
                                    </div>

                                    {/* Food Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-2xl font-bold text-gray-900">
                                                {dish.name}
                                            </h3>
                                            {/* Backend Total Wishes */}
                                            {totalWishes !== undefined && totalWishes !== null && totalWishes > 0 && (
                                                <div className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                                                    <FaHeart className="w-4 h-4" style={{ color: '#AAD36C' }} />
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {totalWishes}
                                                    </span>
                                                </div>
                                            )}
                                            {/* Fallback to favoriteCount for non-voters if no backend data */}
                                            {!isVoter && !totalWishes && favoriteCount > 0 && (
                                                <div className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                                                    <FaHeart className="w-4 h-4" style={{ color: '#AAD36C' }} />
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {favoriteCount}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Feedback Statistics */}
                                        {ratingStats.totalRatings > 0 && (
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="flex items-center gap-1 bg-yellow-50 rounded-full px-3 py-1">
                                                    <Star filled={true} />
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {averageRating} average
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    from {ratingStats.totalRatings} rating{ratingStats.totalRatings !== 1 ? 's' : ''}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Description */}
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            {dish.description || "No description available"}
                                        </p>

                                        {/* Ingredients */}
                                        {dish.ingredient && (
                                            <div className="mb-4">
                                                <h4 className="text-md font-semibold text-gray-700 mb-2">
                                                    Main ingredients
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {dish.ingredient.split(',').map((ingredient, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white border"
                                                            style={{ backgroundColor: '#AAD36C', borderColor: '#AAD36C' }}
                                                        >
                                                            {ingredient.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Section - Feedback */}
                            <div className="p-6 pb-12">
                                <div className={`grid grid-cols-1 gap-6 ${isVoter ? 'lg:grid-cols-2' : 'lg:grid-cols-1 lg:w-3/4 lg:mx-auto'}`}>
                                    {/* Feedback Form (only for voters) */}
                                    {isVoter && (
                                        <div className="lg:sticky lg:top-6 lg:self-start">
                                            <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
                                                <h4 className="text-lg font-semibold mb-2">
                                                    Leave anonymous feedback
                                                </h4>
                                                <p className="text-xs text-gray-500 mb-4">
                                                    We do not collect your identity. Feedback is anonymous.
                                                </p>
                                                <form onSubmit={handleSubmitFeedback} className="space-y-4">
                                                    <StarInput
                                                        label="Food Rating"
                                                        value={feedbackForm.food}
                                                        onChange={(rating) => setFeedbackForm(prev => ({ ...prev, food: rating }))}
                                                    />
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Content
                                                        </label>
                                                        <textarea
                                                            value={feedbackForm.content}
                                                            onChange={(e) => setFeedbackForm(prev => ({ 
                                                                ...prev, 
                                                                content: e.target.value.slice(0, MAX_CHARS)
                                                            }))}
                                                            className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-[#429818] focus:border-[#429818] resize-y"
                                                            placeholder="Write your feedback..."
                                                            maxLength={MAX_CHARS}
                                                            required
                                                        />
                                                        <div className="text-xs text-gray-400 text-right">
                                                            {remaining} characters left
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <button
                                                            type="submit"
                                                            disabled={submitting || (!feedbackForm.content.trim() && feedbackForm.food === 0)}
                                                            className="px-4 py-2 rounded-md bg-[#429818] text-white disabled:opacity-50"
                                                        >
                                                            {submitting ? "Submitting..." : "Submit Feedback"}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}

                                    {/* Feedback List */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-lg font-semibold">
                                                Recent feedback
                                            </h4>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Star filled={ratingStats.totalRatings > 0} />
                                                    <span className="font-medium">
                                                        {averageRating}
                                                    </span>
                                                </div>
                                                <span className="text-gray-400">•</span>
                                                <span>
                                                    {ratingStats.totalRatings} rating{ratingStats.totalRatings !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {loading ? (
                                            <div className="flex justify-center py-8">
                                                <Loading className="w-8 h-8" />
                                            </div>
                                        ) : feedbacks.length === 0 ? (
                                            <p className="text-gray-500 text-center py-8">
                                                No feedback yet
                                            </p>
                                        ) : (
                                            <div className="space-y-3">
                                                {feedbacks.map((feedback) => (
                                                    <div key={feedback.id}>
                                                        {renderFeedbackItem(feedback)}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FoodDetailsPopup;
