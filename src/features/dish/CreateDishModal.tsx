import { useState } from "react";
import { CameraIcon, XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { createDish } from "../../services/dishService";
import type { CreateDishForm, Category } from "../../services/dishService";
import { useEffect } from "react";

interface CreateDishModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    onDishCreated: () => void;
}

const CreateDishModal = ({
    isOpen,
    onClose,
    categories,
    onDishCreated,
}: CreateDishModalProps) => {
    useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // disable background scroll
    } else {
      document.body.style.overflow = "auto"; // restore scroll
    }

    // Cleanup in case modal unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
    const [newDishForm, setNewDishForm] = useState<Partial<CreateDishForm>>({
        name: "",
        name_kh: "",
        categoryId: "",
        ingredient: "",
        ingredient_kh: "",
        description: "",
        description_kh: "",
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Toggle states for Khmer fields
    const [showEnglishName, setShowEnglishName] = useState(false);
    const [showKhmerDescription, setShowKhmerDescription] = useState(false);
    const [showKhmerIngredients, setShowKhmerIngredients] = useState(false);

    // Multiple ingredients state
    const [englishIngredients, setEnglishIngredients] = useState<string[]>([
        "",
    ]);
    const [khmerIngredients, setKhmerIngredients] = useState<string[]>([""]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    // Helper functions for ingredients
    const addEnglishIngredient = () => {
        setEnglishIngredients([...englishIngredients, ""]);
    };

    const removeEnglishIngredient = (index: number) => {
        if (englishIngredients.length > 1) {
            setEnglishIngredients(
                englishIngredients.filter((_, i) => i !== index)
            );
        }
    };

    const updateEnglishIngredient = (index: number, value: string) => {
        const updated = [...englishIngredients];
        updated[index] = value;
        setEnglishIngredients(updated);
    };

    const addKhmerIngredient = () => {
        setKhmerIngredients([...khmerIngredients, ""]);
    };

    const removeKhmerIngredient = (index: number) => {
        if (khmerIngredients.length > 1) {
            setKhmerIngredients(khmerIngredients.filter((_, i) => i !== index));
        }
    };

    const updateKhmerIngredient = (index: number, value: string) => {
        const updated = [...khmerIngredients];
        updated[index] = value;
        setKhmerIngredients(updated);
    };

    const handleAddDish = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedImage || !newDishForm.name_kh || !newDishForm.categoryId) {
            alert("Please fill in all required fields and select an image");
            return;
        }

        try {
            // Combine ingredients into strings
            const ingredientString = englishIngredients
                .filter((ing) => ing.trim())
                .join(", ");
            const ingredientKhString = khmerIngredients
                .filter((ing) => ing.trim())
                .join(", ");

            const formData: CreateDishForm = {
                ...(newDishForm as CreateDishForm),
                ingredient: ingredientString,
                ingredient_kh: ingredientKhString,
                image: selectedImage ?? undefined, 
            };

            await createDish(formData);
            onDishCreated();
            handleClose();
        } catch (error) {
            console.error("Error creating dish:", error);
            alert("Failed to create dish");
        }
    };

    const handleClose = () => {
        // Reset form
        setNewDishForm({
            name: "",
            name_kh: "",
            categoryId: 0,
            ingredient: "",
            ingredient_kh: "",
            description: "",
            description_kh: "",
        });
        setSelectedImage(null);
        setImagePreview(null);
        setShowEnglishName(false);
        setShowKhmerDescription(false);
        setShowKhmerIngredients(false);
        setEnglishIngredients([""]);
        setKhmerIngredients([""]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                    <h3 className="text-2xl font-semibold text-gray-800">
                        Add New Food
                    </h3>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    <form
                        id="add-dish-form"
                        onSubmit={handleAddDish}
                        className="p-6"
                    >
                        <div className="flex gap-8">
                            {/* Left Side - Image Upload */}
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-50 overflow-hidden">
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
                                        required
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Right Side - Form */}
                            <div className="flex-1 space-y-6">
                                {/* Name Fields */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Khmer Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={newDishForm.name_kh || ""}
                                        onChange={(e) =>
                                            setNewDishForm({
                                                ...newDishForm,
                                                name_kh: e.target.value,
                                            })
                                        }
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                        placeholder="បញ្ចូលឈ្មោះជាភាសាខ្មែរ"
                                    />

                                    {/* Toggle button for English name */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowEnglishName(!showEnglishName)
                                        }
                                        className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                                    >
                                        {showEnglishName ? "Hide" : "Add"}{" "}
                                        English Name
                                        <span className="text-xs">
                                            {showEnglishName ? "▲" : "▼"}
                                        </span>
                                    </button>

                                    {/* English name field */}
                                    {showEnglishName && (
                                        <div className="mt-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                English Name
                                            </label>
                                            <input
                                                type="text"
                                                value={newDishForm.name || ""}
                                                onChange={(e) =>
                                                    setNewDishForm({
                                                        ...newDishForm,
                                                        name: e.target.value,
                                                    })
                                                }
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                                placeholder="Enter English name"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        value={newDishForm.categoryId || ""}
                                        onChange={(e) =>
                                            setNewDishForm({
                                                ...newDishForm,
                                                categoryId: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="">
                                            Select Category
                                        </option>
                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Description Fields */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        English Description
                                    </label>
                                    <textarea
                                        value={newDishForm.description || ""}
                                        onChange={(e) =>
                                            setNewDishForm({
                                                ...newDishForm,
                                                description: e.target.value,
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                                        rows={3}
                                        placeholder="Enter description in English"
                                    />

                                    {/* Toggle button for Khmer description */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowKhmerDescription(
                                                !showKhmerDescription
                                            )
                                        }
                                        className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                                    >
                                        {showKhmerDescription ? "Hide" : "Add"}{" "}
                                        Khmer Description
                                        <span className="text-xs">
                                            {showKhmerDescription ? "▲" : "▼"}
                                        </span>
                                    </button>

                                    {/* Khmer description field */}
                                    {showKhmerDescription && (
                                        <div className="mt-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Khmer Description
                                            </label>
                                            <textarea
                                                value={
                                                    newDishForm.description_kh ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setNewDishForm({
                                                        ...newDishForm,
                                                        description_kh:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                                                rows={3}
                                                placeholder="បញ្ចូលការពិពណ៌នាជាភាសាខ្មែរ"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Ingredient Fields */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        English Ingredients
                                    </label>

                                    {/* English ingredients list */}
                                    <div className="space-y-2">
                                        {englishIngredients.map(
                                            (ingredient, index) => (
                                                <div
                                                    key={index}
                                                    className="flex gap-2"
                                                >
                                                    <input
                                                        type="text"
                                                        value={ingredient}
                                                        onChange={(e) =>
                                                            updateEnglishIngredient(
                                                                index,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                                        placeholder={`Ingredient ${
                                                            index + 1
                                                        }`}
                                                    />
                                                    {englishIngredients.length >
                                                        1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeEnglishIngredient(
                                                                    index
                                                                )
                                                            }
                                                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <XMarkIcon className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            )
                                        )}

                                        <button
                                            type="button"
                                            onClick={addEnglishIngredient}
                                            className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                            Add Ingredient
                                        </button>
                                    </div>

                                    {/* Toggle button for Khmer ingredients */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowKhmerIngredients(
                                                !showKhmerIngredients
                                            )
                                        }
                                        className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                                    >
                                        {showKhmerIngredients ? "Hide" : "Add"}{" "}
                                        Khmer Ingredients
                                        <span className="text-xs">
                                            {showKhmerIngredients ? "▲" : "▼"}
                                        </span>
                                    </button>

                                    {/* Khmer ingredients list */}
                                    {showKhmerIngredients && (
                                        <div className="mt-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Khmer Ingredients
                                            </label>
                                            <div className="space-y-2">
                                                {khmerIngredients.map(
                                                    (ingredient, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex gap-2"
                                                        >
                                                            <input
                                                                type="text"
                                                                value={
                                                                    ingredient
                                                                }
                                                                onChange={(e) =>
                                                                    updateKhmerIngredient(
                                                                        index,
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                                                placeholder={`គ្រឿងផ្សំ ${
                                                                    index + 1
                                                                }`}
                                                            />
                                                            {khmerIngredients.length >
                                                                1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeKhmerIngredient(
                                                                            index
                                                                        )
                                                                    }
                                                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                >
                                                                    <XMarkIcon className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={addKhmerIngredient}
                                                    className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                                                >
                                                    <PlusIcon className="w-4 h-4" />
                                                    Add Khmer Ingredient
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Fixed Action Buttons */}
                <div className="flex gap-4 p-6 border-t border-gray-200 flex-shrink-0">
                    <button
                        type="submit"
                        form="add-dish-form"
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        Add Food
                    </button>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateDishModal;
