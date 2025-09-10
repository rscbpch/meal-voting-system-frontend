import { useEffect } from "react";
import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

interface CustomAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  showCloseButton?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const CustomAlert = ({
  isOpen,
  onClose,
  title,
  message,
  type,
  showCloseButton = true,
  autoClose = false,
  autoCloseDelay = 3000,
}: CustomAlertProps) => {
  // Auto close functionality
  useEffect(() => {
    if (autoClose && isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case "error":
        return <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />;
      case "warning":
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />;
      case "info":
        return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    return "bg-white border-gray-200";
  };

  const getTextColor = () => {
    return "text-gray-800";
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 border-2 ${getBackgroundColor()}`}>
        {/* Close button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        )}

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              {getIcon()}
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-semibold mb-2 ${getTextColor()}`}>
                {title}
              </h3>
              <p className={`text-sm leading-relaxed ${getTextColor()}`}>
                {message}
              </p>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg font-medium transition-colors bg-[#429818] text-white hover:bg-[#3E7B27]"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
