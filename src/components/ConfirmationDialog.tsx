import { useEffect } from "react";
import {
    XMarkIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: "warning" | "danger" | "info";
    isLoading?: boolean;
}

const ConfirmationDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Yes",
    cancelText = "No",
    type = "warning",
    isLoading = false,
}: ConfirmationDialogProps) => {
    // Close on escape key (only if not loading)
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && !isLoading) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose, isLoading]);

    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case "warning":
                return (
                    <ExclamationTriangleIcon className="h-6 w-6 text-[#429818]" />
                );
            case "danger":
                return (
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                );
            case "info":
                return (
                    <ExclamationTriangleIcon className="h-6 w-6 text-[#429818]" />
                );
            default:
                return (
                    <ExclamationTriangleIcon className="h-6 w-6 text-[#429818]" />
                );
        }
    };

    const getConfirmButtonColor = () => {
        switch (type) {
            case "warning":
                return "bg-[#429818] hover:bg-[#3E7B27] text-white";
            case "danger":
                return "bg-red-600 hover:bg-red-700 text-white";
            case "info":
                return "bg-[#429818] hover:bg-[#3E7B27] text-white";
            default:
                return "bg-yellow-600 hover:bg-yellow-600 text-white";
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 border-2 border-gray-200">
                {/* Close button */}
                {!isLoading && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <XMarkIcon className="h-5 w-5 text-gray-500" />
                    </button>
                )}

                {/* Content */}
                <div className="p-6">
                    <div className="flex gap-4">
                        {/* Icon aligned with title */}
                        <div className="flex-shrink-0 flex items-start pt-1">
                            {getIcon()}
                        </div>

                        {/* Text content */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-gray-800">
                                {message}
                            </p>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-6 flex justify-end gap-3">
                        {!isLoading && (
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-[#EEEEEE] text-[#888888] rounded-lg hover:bg-gray-200 hover:text-gray-600 transition-colors"
                            >
                                {cancelText}
                            </button>
                        )}
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                                isLoading ? "opacity-50 cursor-not-allowed" : ""
                            } ${getConfirmButtonColor()}`}
                        >
                            {isLoading && (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
