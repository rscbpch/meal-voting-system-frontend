import { useState, useEffect, useRef } from "react";
import { XMarkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import type { Dish } from "../services/dishService";
import Loading from "./Loading";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    dish: Dish | null;
    isDeleting?: boolean;
}

const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    dish,
    isDeleting = false,
}: DeleteConfirmationModalProps) => {
    const [isClosing, setIsClosing] = useState(false);
    const [isOpening, setIsOpening] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            // Trigger opening animation
            setIsOpening(true);
        } else {
            document.body.style.overflow = "auto";
            setIsOpening(false);
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setIsOpening(false);
        // Wait for animation to complete before closing
        setTimeout(() => {
            setIsClosing(false);
            setIsOpening(false);
            onClose();
        }, 300); // Match animation duration
    };

    const handleConfirm = async () => {
        try {
            await onConfirm();
            // Close modal after successful deletion
            handleClose();
        } catch (error) {
            // Error handling is done in the parent component
            // Modal stays open to show error state if needed
        }
    };

    // Don't return null immediately - let animation handle visibility
    if (!isOpen && !isClosing) return null;

    return (
        <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ease-in-out ${
            isClosing ? 'opacity-0 backdrop-blur-none' : isOpening ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-none'
        }`}>
            <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transition-all duration-300 ease-in-out transform ${
                isClosing ? 'opacity-0 scale-95 translate-y-4' : isOpening ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
            }`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Delete Food Item
                    </h3>
                    <button
                        onClick={handleClose}
                        disabled={isDeleting}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <XMarkIcon className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                    {isDeleting ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loading size={120} />
                            <p className="text-gray-600 mt-4 text-center">
                                Deleting food item...
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete this food item? This action cannot be undone.
                            </p>
                            
                            {/* Dish Information */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <div className="flex items-center gap-4">
                                    {/* Dish Image */}
                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                        {dish?.imageURL ? (
                                            <img
                                                src={dish.imageURL}
                                                alt={dish.name || dish.name_kh || "Food item"}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Dish Details */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-lg text-gray-800 mb-1">
                                            {dish?.name || dish?.name_kh || "Food item"}
                                        </h4>
                                        {dish?.description && (
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {dish.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Action Buttons */}
                {!isDeleting && (
                    <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
