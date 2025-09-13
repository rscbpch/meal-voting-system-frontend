import { useState, useEffect, useRef } from "react";
import {
    CameraIcon,
    XMarkIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { FiX, FiPlus } from "react-icons/fi";
import { createDish, checkDishNames } from "../../services/dishService";
import type { CreateDishForm, Category } from "../../services/dishService";
import Loading from "../../components/Loading";

interface CreateDishModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    onDishCreated: () => void;
}

// Regex validators
const isKhmer = (text: string) => /^[\u1780-\u17FF0-9\s.,!?()'"-]*$/.test(text);
const isEnglish = (text: string) => /^[A-Za-z0-9\s.,!?()'"-]*$/.test(text);

// Ingredient Input Component
const IngredientInput = ({
    label,
    placeholder,
    value,
    onChange,
    lang, // "khmer" | "english"
}: {
    label: string;
    placeholder: string;
    value: string[];
    onChange: (val: string[]) => void;
    lang: "khmer" | "english";
}) => {
    const [input, setInput] = useState("");
    const [error, setError] = useState("");

    const handleAdd = () => {
        if (input.trim() === "") return;

        // Validate input based on lang
        if (lang === "khmer" && !isKhmer(input)) {
            setError("Please input Khmer text only!");
            return;
        }
        if (lang === "english" && !isEnglish(input)) {
            setError("Please input English text only!");
            return;
        }

        setError(""); // clear error
        onChange([...value, input.trim()]);
        setInput("");
    };

    const handleRemove = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        
        // Allow typing but show warning for invalid characters
        if (lang === "khmer" && val && !isKhmer(val)) {
            setError("Please use Khmer characters only");
        } else if (lang === "english" && val && !isEnglish(val)) {
            setError("Please use English characters only");
        } else {
            setError(""); // Clear error if input is valid
        }
        
        setInput(val); // Always allow typing
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleAdd();
                        }
                    }}
                    className={`${label === "Khmer Ingredients *" ? "khmer-font-content" : ""} flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 transition-colors ${
                        error
                            ? "border-red-400 bg-red-50/30 focus:ring-red-400"
                            : "border-gray-300 focus:ring-[#3E7B27] focus:border-[#3E7B27]"
                    }`}
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    className="p-3 rounded-lg bg-[#429818] text-white hover:bg-[#3E7B27] transition"
                >
                    <FiPlus size={18} strokeWidth={3} />
                </button>
            </div>

            {error && <p className="text-sm text-red-600 mt-1 font-medium">{error}</p>}

            <div className="flex flex-wrap gap-2 mt-2">
                {value.map((item, index) => (
                    <div
                        key={index}
                        className={`${label === "Khmer Ingredients *" ? "khmer-font-content" : ""} flex items-center gap-2 bg-[#E2F3D7] text-green-800 px-3 py-1 rounded-full`}
                    >
                        <span>{item}</span>
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className={`text-[#429818] hover:text-[#F42828]`}
                        >
                            <FiX />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CreateDishModal = ({
    isOpen,
    onClose,
    categories,
    onDishCreated,
}: CreateDishModalProps) => {
    const [newDishForm, setNewDishForm] = useState<
        Partial<CreateDishForm> & {
            ingredient_array?: string[];
            ingredient_kh_array?: string[];
        }
    >({
        name: "",
        name_kh: "",
        categoryId: 0,
        ingredient: "",
        ingredient_kh: "",
        ingredient_array: [],
        ingredient_kh_array: [],
        description: "",
        description_kh: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isOpening, setIsOpening] = useState(false);

    const [categoryOpen, setCategoryOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setCategoryOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleAddDish = async (e: React.FormEvent) => {
    e.preventDefault();

    // Set loading state
    setIsSubmitting(true);

    // Clear previous form errors
    setErrors({});

    const requiredFields = [];
    if (!selectedImage) requiredFields.push("image");
    if (!newDishForm.name_kh?.trim()) requiredFields.push("Khmer name");
    if (!newDishForm.name?.trim()) requiredFields.push("English name");
    if (!newDishForm.categoryId || newDishForm.categoryId === 0) requiredFields.push("category");
    if (!newDishForm.description_kh?.trim()) requiredFields.push("Khmer description");
    if (!newDishForm.description?.trim()) requiredFields.push("English description");

    const ingredientErrors = [];
    if (!newDishForm.ingredient_kh_array || newDishForm.ingredient_kh_array.length === 0) {
        ingredientErrors.push("at least 1 Khmer ingredient");
    }
    if (!newDishForm.ingredient_array || newDishForm.ingredient_array.length === 0) {
        ingredientErrors.push("at least 1 English ingredient");
    }

    // Check for validation errors (language format errors) but exclude form errors
    const hasValidationErrors = Object.entries(errors).some(([key, err]) => 
        key !== 'form' && err && err !== ""
    );

    if (requiredFields.length > 0 || ingredientErrors.length > 0 || hasValidationErrors) {
        let errorMessage = "";
        
        if (requiredFields.length > 0) {
            errorMessage += `Please fill in: ${requiredFields.join(", ")}. `;
        }
        
        if (ingredientErrors.length > 0) {
            errorMessage += `Please add ${ingredientErrors.join(" and ")}. `;
        }
        
        if (hasValidationErrors) {
            errorMessage += "Please fix the input format errors.";
        }

        setErrors((prev) => ({
            ...prev,
            form: errorMessage.trim(),
        }));
        setIsSubmitting(false);
        // Don't reset form data on validation error - keep everything filled for user to fix
        return;
    }

    // Check for duplicate names before submitting
    try {
        const nameCheck = await checkDishNames(
            newDishForm.name || "",
            newDishForm.name_kh || ""
        );

        if (nameCheck.nameExists || nameCheck.nameKhExists) {
            let duplicateMessage = "A dish with this name already exists: ";
            const duplicates = [];
            if (nameCheck.nameExists) duplicates.push("English name");
            if (nameCheck.nameKhExists) duplicates.push("Khmer name");
            duplicateMessage += duplicates.join(" and ") + ". Please choose different names.";
            
            setErrors((prev) => ({ ...prev, form: duplicateMessage }));
            setIsSubmitting(false);
            // Don't reset form data on duplicate name error - keep everything filled for user to change name
            return;
        }
    } catch (error) {
        console.error("Error checking duplicate names:", error);
        // Continue with submission if we can't check (server will catch duplicates)
    }

    const formData: CreateDishForm = {
        ...(newDishForm as CreateDishForm),
        ingredient: newDishForm.ingredient_array?.join(", ") || "",
        ingredient_kh: newDishForm.ingredient_kh_array?.join(", ") || "",
        image: selectedImage!,
    };

    try {
        await createDish(formData);
        // Success: refresh the dish list and close modal with animation
        onDishCreated();
        setIsSubmitting(false);
        handleClose();
    } catch (error: any) {
        console.error("Error creating dish:", error);
        
        // Handle specific error cases
        let errorMessage = "Failed to create dish";
        
        if (error.message && error.message.includes("already exists")) {
            errorMessage = "A dish with this name or Khmer name already exists. Please choose a different name.";
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        setErrors((prev) => ({ ...prev, form: errorMessage }));
        setIsSubmitting(false);
        // Don't reset form data on error - keep everything filled for user to retry
    }
};

    // Check if form is valid for submission
    const isFormValid = () => {
        // Check required fields
        const hasRequiredFields = selectedImage && 
            newDishForm.name_kh?.trim() && 
            newDishForm.name?.trim() && 
            newDishForm.categoryId && newDishForm.categoryId !== 0 &&
            newDishForm.description_kh?.trim() &&
            newDishForm.description?.trim();
        
        // Check ingredients
        const hasIngredients = (newDishForm.ingredient_kh_array?.length || 0) > 0 && 
            (newDishForm.ingredient_array?.length || 0) > 0;
        
        // Check for validation errors (language format errors) but exclude form errors
        const hasValidationErrors = Object.entries(errors).some(([key, err]) => 
            key !== 'form' && err && err !== ""
        );
        
        return hasRequiredFields && hasIngredients && !hasValidationErrors;
    };

    const handleClose = () => {
        setIsClosing(true);
        setIsOpening(false);
        // Wait for animation to complete before closing
        setTimeout(() => {
            // Reset form data only when actually closing the modal
            setNewDishForm({
                name: "",
                name_kh: "",
                categoryId: 0,
                ingredient: "",
                ingredient_kh: "",
                ingredient_array: [],
                ingredient_kh_array: [],
                description: "",
                description_kh: "",
            });
            setSelectedImage(null);
            setImagePreview(null);
            setErrors({});
            setIsClosing(false);
            setIsOpening(false);
            onClose();
        }, 300); // Match animation duration
    };

    // for form input
    const handleInputChange =
        (field: keyof typeof newDishForm, lang: "khmer" | "english") =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = e.target.value;

            // Update the form value first (allow typing)
            setNewDishForm((prev) => ({
                ...prev,
                [field]: value,
            }));

            // Clear form error when user starts typing in name fields
            if (field === "name" || field === "name_kh") {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    // Clear form error when user starts typing
                    if (newErrors.form) {
                        newErrors.form = "";
                    }
                    return newErrors;
                });
            }

            // Show warning for invalid characters but allow typing
            if (lang === "khmer" && value && !isKhmer(value)) {
                setErrors((prev) => ({
                    ...prev,
                    [field]: "Please use Khmer characters only",
                }));
            } else if (lang === "english" && value && !isEnglish(value)) {
                setErrors((prev) => ({
                    ...prev,
                    [field]: "Please use English characters only",
                }));
            } else {
                // Clear error if input is valid
                setErrors((prev) => ({
                    ...prev,
                    [field]: "",
                }));
            }
        };

    // Don't return null immediately - let animation handle visibility
    if (!isOpen && !isClosing) return null;

    return (
        <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ease-in-out ${
            isClosing ? 'opacity-0 backdrop-blur-none' : isOpening ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-none'
        }`}>
            <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col overflow-hidden transition-all duration-300 ease-in-out transform ${
                isClosing ? 'opacity-0 scale-95 translate-y-4' : isOpening ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
            }`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                    <h3 className="text-2xl font-semibold text-gray-800">
                        Add New Food
                    </h3>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className={`p-2 rounded-full transition-colors ${
                            isSubmitting 
                                ? "cursor-not-allowed opacity-50" 
                                : "hover:bg-gray-100 cursor-pointer"
                        }`}
                    >
                        <XMarkIcon className={`w-6 h-6 ${
                            isSubmitting ? "text-gray-300" : "text-gray-500"
                        }`} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6">
                    {isSubmitting ? (
                        <div className="flex justify-center items-center h-full">
                            <Loading size={200} />
                        </div>
                    ) : (
                        <form
                            id="add-dish-form"
                            onSubmit={handleAddDish}
                            className="p-6 space-y-6"
                        >
                        <div className="flex gap-14">
                            {/* Left Side - Image Upload (Sticky) */}
                            <div className="flex-shrink-0 sticky top-6 self-start">
                                <div className="relative">
                                    <div className="w-50 h-50 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-50 overflow-hidden">
                                        {imagePreview ? (
                                            <div className="relative w-full h-full">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-gray-500">
                                                    Add Image
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Right Side - Form */}
                            <div className="flex-1 space-y-6">
                                {/* Name Fields */}
                                <div className="flex gap-4">
                                    {/* Khmer Name */}
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Khmer Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={newDishForm.name_kh || ""}
                                            onChange={handleInputChange(
                                                "name_kh",
                                                "khmer"
                                            )}
                                            required
                                            className={`khmer-font-content w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 transition-colors ${
                                                errors.name_kh
                                                    ? "border-red-400 bg-red-50/30 focus:ring-red-400"
                                                    : "border-gray-300 focus:ring-[#3E7B27] focus:border-[#3E7B27]"
                                            }`}
                                            placeholder="បញ្ចូលឈ្មោះជាភាសាខ្មែរ"
                                        />
                                        {errors.name_kh && (
                                            <p className="text-sm text-red-600 mt-1 font-medium">
                                                {errors.name_kh}
                                            </p>
                                        )}
                                    </div>

                                    {/* English Name */}
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            English Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={newDishForm.name || ""}
                                            onChange={handleInputChange(
                                                "name",
                                                "english"
                                            )}
                                            required
                                            className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 transition-colors ${
                                                errors.name
                                                    ? "border-red-400 bg-red-50/30 focus:ring-red-400"
                                                    : "border-gray-300 focus:ring-[#3E7B27] focus:border-[#3E7B27]"
                                            }`}
                                            placeholder="Enter English name"
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600 mt-1 font-medium">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Form Error Display */}
                                {errors.form && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-sm text-red-600 font-medium">
                                            {errors.form}
                                        </p>
                                    </div>
                                )}

                                {/* Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category *
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCategoryOpen(!categoryOpen)
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-left flex justify-between items-center focus:outline-none focus:ring-1 focus:ring-[#3E7B27] focus:border-[#3E7B27] transition-colors"
                                    >
                                        {categories.find(
                                            (c) =>
                                                c.id === newDishForm.categoryId
                                        )?.name || "Select Category"}
                                        <ChevronDownIcon
                                            className={`w-5 h-5 transform transition-transform ${
                                                categoryOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    {categoryOpen && (
                                        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-lg max-h-40 overflow-y-auto">
                                            {categories.map((category) => (
                                                <li
                                                    key={category.id}
                                                    onClick={() => {
                                                        setNewDishForm({
                                                            ...newDishForm,
                                                            categoryId:
                                                                category.id,
                                                        });
                                                        setCategoryOpen(false);
                                                    }}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    {category.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* Khmer Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Khmer Description *
                                    </label>
                                    <textarea
                                        value={newDishForm.description_kh || ""}
                                        onChange={handleInputChange(
                                            "description_kh",
                                            "khmer"
                                        )}
                                        required
                                        className={`khmer-font-content w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 resize-none transition-colors ${
                                            errors.description_kh
                                                ? "border-red-400 bg-red-50/30 focus:ring-red-400"
                                                : "border-gray-300 focus:ring-[#3E7B27] focus:border-[#3E7B27]"
                                        }`}
                                        rows={3}
                                        placeholder="បញ្ចូលការពិពណ៌នាជាភាសាខ្មែរ"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {200 -
                                            (newDishForm.description_kh
                                                ?.length || 0)}{" "}
                                        characters left
                                    </p>
                                    {errors.description_kh && (
                                        <p className="text-sm text-red-600 font-medium">
                                            {errors.description_kh}
                                        </p>
                                    )}
                                </div>

                                {/* English Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        English Description *
                                    </label>
                                    <textarea
                                        value={newDishForm.description || ""}
                                        onChange={handleInputChange(
                                            "description",
                                            "english"
                                        )}
                                        required
                                        className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 resize-none transition-colors ${
                                            errors.description
                                                ? "border-red-400 bg-red-50/30 focus:ring-red-400"
                                                : "border-gray-300 focus:ring-[#3E7B27] focus:border-[#3E7B27]"
                                        }`}
                                        rows={3}
                                        placeholder="Enter description in English"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {200 -
                                            (newDishForm.description?.length ||
                                                0)}{" "}
                                        characters remaining
                                    </p>
                                    {errors.description && (
                                        <p className="text-sm text-red-600 font-medium">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                {/* ingredients */}
                                <IngredientInput
                                    label="Khmer Ingredients *"
                                    placeholder="បញ្ចូលគ្រឿងផ្សំ ហើយចុច Enter"
                                    value={
                                        newDishForm.ingredient_kh_array || []
                                    }
                                    onChange={(arr) => {
                                        setNewDishForm({
                                            ...newDishForm,
                                            ingredient_kh_array: arr,
                                        });
                                        // Clear form error when ingredients change
                                        setErrors((prev) => {
                                            const newErrors = { ...prev };
                                            if (newErrors.form) {
                                                newErrors.form = "";
                                            }
                                            return newErrors;
                                        });
                                    }}
                                    lang="khmer"
                                />

                                <IngredientInput
                                    label="English Ingredients *"
                                    placeholder="Enter ingredient and press Enter"
                                    value={newDishForm.ingredient_array || []}
                                    onChange={(arr) => {
                                        setNewDishForm({
                                            ...newDishForm,
                                            ingredient_array: arr,
                                        });
                                        // Clear form error when ingredients change
                                        setErrors((prev) => {
                                            const newErrors = { ...prev };
                                            if (newErrors.form) {
                                                newErrors.form = "";
                                            }
                                            return newErrors;
                                        });
                                    }}
                                    lang="english"
                                />
                            </div>
                        </div>
                        </form>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                            isSubmitting
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer"
                        }`}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="add-dish-form"
                        disabled={!isFormValid() || isSubmitting}
                        className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                            isFormValid() && !isSubmitting
                                ? "bg-[#429818] text-white hover:bg-[#3E7B27] cursor-pointer"
                                : isSubmitting
                                ? "bg-[#429818] text-white cursor-not-allowed"
                                : "bg-[#A3CFA0] text-white cursor-not-allowed"
                        }`}
                    >
                        {isSubmitting ? "Adding..." : "Add Food"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateDishModal;
