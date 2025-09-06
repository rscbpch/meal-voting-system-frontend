import { useState, useEffect } from "react";
import Sidebar from "../../components/SideBar";
import PageTransition from "../../components/PageTransition";
import CardV2 from "../../components/CardV2";
import {
    getDishes,
    getCategories,
    createDish,
} from "../../services/dishService";
import type {
    Dish,
    Category,
    CreateDishForm,
} from "../../services/dishService";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const MenuManagement = () => {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedCategoryObj, setSelectedCategoryObj] =
        useState<Category | null>(null);
    const [sortBy, setSortBy] = useState<
        "recent" | "most_rated" | "most_favorite"
    >("recent");
    const [displayMode, setDisplayMode] = useState<"all" | "category">("all");
    const [showAddForm, setShowAddForm] = useState(false);
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
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category.id.toString());
        setSelectedCategoryObj(category); // update the selected category
        setDisplayMode("category");
        setShowCategoryDropdown(false); // close dropdown
    };
    // Fetch dishes and categories on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [dishesData, categoriesData] = await Promise.all([
                    getDishes({ sort: sortBy }),
                    getCategories(),
                ]);
                setDishes(dishesData.items);
                setCategories(categoriesData);
                console.log("Categories loaded:", categoriesData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [sortBy]);

    // Filter dishes based on search and category
    const filteredDishes = dishes.filter((dish) => {
        const matchesSearch =
            dish.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dish.name_kh?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" ||
            dish.categoryId?.toString() === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAddDish = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedImage || !newDishForm.name_kh || !newDishForm.categoryId) {
            alert("Please fill in all required fields and select an image");
            return;
        }

        try {
            const formData: CreateDishForm = {
                ...(newDishForm as CreateDishForm),
                image: selectedImage,
            };
            await createDish(formData);
            // Refresh dishes list
            const dishesData = await getDishes({ sort: sortBy });
            setDishes(dishesData.items);
            setShowAddForm(false);
            setNewDishForm({
                name: "",
                name_kh: "",
                categoryId: "",
                ingredient: "",
                ingredient_kh: "",
                description: "",
                description_kh: "",
            });
            setSelectedImage(null);
        } catch (error) {
            console.error("Error creating dish:", error);
            alert("Failed to create dish");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    // Edit and Delete handlers for menu management
    const handleEditDish = (dishId: number) => {
        console.log("Edit dish:", dishId);
        // TODO: Implement edit functionality
        // This could open an edit modal or navigate to an edit page
    };

    const handleDeleteDish = async (dishId: number) => {
        if (window.confirm("Are you sure you want to delete this dish?")) {
            try {
                // TODO: Implement delete API call
                console.log("Delete dish:", dishId);
                // await deleteDish(dishId);
                // Refresh dishes list
                // const dishesData = await getDishes({ sort: sortBy });
                // setDishes(dishesData.items);
            } catch (error) {
                console.error("Error deleting dish:", error);
                alert("Failed to delete dish");
            }
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 bg-[#F6FFE8] ">
                <PageTransition>
                    {/* Main Title with Shadow */}
                    <div className="bg-white shadow-sm p-6 mb-6">
                        <h1 className="text-2xl font-semibold text-[#3A4038]">
                            Menu Management
                        </h1>
                    </div>

                    {/* Food Title with Count */}
                    <div className="px-6 mb-6 flex items-center gap-4 font-semibold text-[#3A4038] text-xl">
                        <h2>Food</h2>
                        <div className="bg-[#A1DB7A] bg-opacity-0 pt-1 p-2 rounded-md">
                            {loading ? "..." : filteredDishes.length}
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="p-6 mb-6 flex items-center justify-between pb-0 pt-0">
                        {/* Left side: All + Categories */}

                        <div className="flex items-center gap-4 relative text-md">
                            {/* All Button */}
                            <button
                                onClick={() => {
                                    setDisplayMode("all");
                                    setSelectedCategory("all");
                                    setSelectedCategoryObj(null);
                                }}
                                className="px-2 py-2 relative text-gray-600 hover:text-[#3E7B27] transition-colors"
                            >
                                All
                                <span
                                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#3E7B27] transition-all duration-300 ${
                                        displayMode === "all"
                                            ? "scale-x-100"
                                            : "scale-x-0"
                                    } origin-left`}
                                ></span>
                            </button>

                            <div
                                className="relative inline-block"
                                onMouseEnter={() =>
                                    setShowCategoryDropdown(true)
                                }
                                onMouseLeave={() =>
                                    setShowCategoryDropdown(false)
                                }
                            >
                                <button className="flex items-center gap-2 px-2 py-2 relative text-gray-600 hover:text-[#3E7B27] transition-colors">
                                    <span>
                                        {selectedCategoryObj?.name ||
                                            "Categories"}
                                    </span>
                                    <ChevronDownIcon
                                        className={`h-4 w-4 text-gray-400 transform transition-transform duration-300 ${
                                            showCategoryDropdown
                                                ? "rotate-180"
                                                : "rotate-0"
                                        }`}
                                    />
                                    <span
                                        className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#3E7B27] transition-all duration-300 ${
                                            displayMode === "category"
                                                ? "scale-x-100"
                                                : "scale-x-0"
                                        } origin-left`}
                                    ></span>
                                </button>

                                {/* Dropdown */}
                                <div
                                    className={`absolute top-full left-0 w-46 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transform origin-top transition-all duration-200 
                                        ${
                                            showCategoryDropdown
                                                ? "scale-y-100 opacity-100"
                                                : "scale-y-0 opacity-0 pointer-events-none"
                                        }
                                        `}
                                >
                                    <div className="py-1">
                                        {loading ? (
                                            <div className="px-4 py-2 text-sm text-gray-400">
                                                Loading...
                                            </div>
                                        ) : categories.length === 0 ? (
                                            <div className="px-4 py-2 text-sm text-gray-500">
                                                No categories available
                                            </div>
                                        ) : (
                                            categories.map((category) => {
                                                const isSelected =
                                                    selectedCategoryObj?.id ===
                                                    category.id;
                                                return (
                                                    <button
                                                        key={category.id}
                                                        onClick={() =>
                                                            handleCategorySelect(
                                                                category
                                                            )
                                                        }
                                                        className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200
                                                            ${
                                                                isSelected
                                                                    ? "bg-green-50 text-green-800 font-semibold"
                                                                    : "text-gray-700 hover:bg-gray-100"
                                                            }
                                                        `}
                                                    >
                                                        {category.name}
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right side: Search + Sort + Add button */}
                        <div className="flex items-center gap-4">
                            {/* Search Bar */}
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search food..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-10 pr-4 py-2 bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
                                />
                            </div>

                            {/* Sort Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => setShowSortDropdown(true)}
                                onMouseLeave={() => setShowSortDropdown(false)}
                            >
                                <button className="flex items-center gap-2 px-4 py-2 bg-white shadow-sm rounded-lg hover:bg-gray-50 transition-colors">
                                    <span>
                                        {sortBy === "recent"
                                            ? "Recently Added"
                                            : sortBy === "most_rated"
                                            ? "Most Rated"
                                            : "Most Favorite"}
                                    </span>
                                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                                </button>

                                {showSortDropdown && (
                                    <div className="absolute top-full left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                        <div className="py-1">
                                            <button
                                                onClick={() => {
                                                    setSortBy("recent");
                                                    setShowSortDropdown(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Recently Added
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSortBy("most_rated");
                                                    setShowSortDropdown(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Most Rated
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSortBy("most_favorite");
                                                    setShowSortDropdown(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Most Favorite
                                            </button>
                                            <div className="border-t border-gray-200 my-1"></div>
                                            <button
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setSelectedCategory("all");
                                                    setSortBy("recent");
                                                    setDisplayMode("all");
                                                    setShowSortDropdown(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                Clear Filter
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Add New Food Button */}
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                <PlusIcon className="h-5 w-5" />
                                Add new food
                            </button>
                        </div>
                    </div>

                    {/* Food Cards Grid */}
                    <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {loading ? (
                            <div className="col-span-full flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            </div>
                        ) : filteredDishes.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No food items found
                            </div>
                        ) : (
                            filteredDishes.map((dish) => (
                                <CardV2
                                    key={dish.id}
                                    name={
                                        dish.name || dish.name_kh || "Food item"
                                    }
                                    categoryName={
                                        categories.find(
                                            (c) => c.id === dish.categoryId
                                        )?.name || "Uncategorized"
                                    }
                                    description={dish.description || ""}
                                    imgURL={dish.imageURL || ""}
                                    isMenuManagement={true}
                                    onEdit={() =>
                                        handleEditDish(Number(dish.id))
                                    }
                                    onDelete={() =>
                                        handleDeleteDish(Number(dish.id))
                                    }
                                    averageRating={dish.rating || 0}
                                    wishlistCount={
                                        Math.floor(Math.random() * 50) + 1
                                    } // Mock data
                                />
                            ))
                        )}
                    </div>

                    {/* Add New Food Modal */}
                    {showAddForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                                <h3 className="text-xl font-semibold mb-4">
                                    Add New Food
                                </h3>
                                <form
                                    onSubmit={handleAddDish}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            English Name
                                        </label>
                                        <input
                                            type="text"
                                            value={newDishForm.name || ""}
                                            onChange={(e) =>
                                                setNewDishForm({
                                                    ...newDishForm,
                                                    name:
                                                        e.target.value ||
                                                        undefined,
                                                })
                                            }
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Category *
                                        </label>
                                        <select
                                            value={newDishForm.categoryId || ""}
                                            onChange={(e) =>
                                                setNewDishForm({
                                                    ...newDishForm,
                                                    categoryId: e.target.value,
                                                })
                                            }
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            value={
                                                newDishForm.description || ""
                                            }
                                            onChange={(e) =>
                                                setNewDishForm({
                                                    ...newDishForm,
                                                    description: e.target.value,
                                                })
                                            }
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Image *
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Add Food
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowAddForm(false)
                                            }
                                            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </PageTransition>
            </main>
        </div>
    );
};

export default MenuManagement;
