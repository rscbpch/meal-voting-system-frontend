import { useState, useEffect } from "react";
import Sidebar from "../../components/SideBar";
import PageTransition from "../../components/PageTransition";
import CardV2 from "../../components/CardV2";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import CreateDishModal from "../../features/dish/CreateDishModal";
import EditDishModal from "../../features/dish/EditDishModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import FoodDetailsPopup from "../../components/FoodDetailsPopup";
import {
    getDishes,
    getCategories,
    deleteDish,
} from "../../services/dishService";
import type { Dish, Category } from "../../services/dishService";
import { fetchAllWishes } from "../../services/wishService";
import type { WishData } from "../../services/wishService";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const MenuManagement = () => {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [wishes, setWishes] = useState<WishData[]>([]);
    const [loading, setLoading] = useState(true);
    const [dishesLoading, setDishesLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedCategoryObj, setSelectedCategoryObj] =
        useState<Category | null>(null);
    const [sortBy, setSortBy] = useState<
        "recent" | "most_rated" | "most_favorite"
    >("recent");
    const [displayMode, setDisplayMode] = useState<"all" | "category">("all");
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingDish, setEditingDish] = useState<Dish | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingDish, setDeletingDish] = useState<Dish | null>(null);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [deletingDishId, setDeletingDishId] = useState<number | null>(null);
    const [animateCards, setAnimateCards] = useState(false);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category.id.toString());
        setSelectedCategoryObj(category);
        setDisplayMode("category");
        setShowCategoryDropdown(false);
        setCurrentPage(1); // Reset to first page when filtering
    };
    // Fetch categories when component mounts (like FoodForVoter)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const categoriesData = await getCategories();
                setCategories(categoriesData);
                console.log("Categories loaded:", categoriesData);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Fetch wishes separately
    useEffect(() => {
        const fetchWishesData = async () => {
            try {
                const wishesData = await fetchAllWishes();
                setWishes(wishesData.dishes);
                console.log("Wishes loaded:", wishesData.dishes);
            } catch (error) {
                console.error("Error fetching wishes:", error);
            }
        };
        fetchWishesData();
    }, []);

    // Filter dishes based on search only (category filtering is now done on backend)
    const filteredDishes = dishes.filter((dish) => {
        const matchesSearch =
            dish.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dish.name_kh?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    // Handle "All" category selection
    const handleAllCategorySelect = () => {
        setDisplayMode("all");
        setSelectedCategory("all");
        setSelectedCategoryObj(null);
        setCurrentPage(1); // Reset to first page
    };

    const handleDishCreated = async () => {
        // Simply refresh the current page without complex navigation
        try {
            // Just refresh current page data
            const offset = (currentPage - 1) * limit;
            const categoryId = selectedCategory !== "all" ? selectedCategory : undefined;
            const dishesData = await getDishes({ 
                limit, 
                offset, 
                sort: sortBy,
                categoryId: categoryId
            });
            
            setDishes(dishesData.items);
            setTotal(dishesData.total);
        } catch (error) {
            console.error("Error refreshing dishes:", error);
        }
    };

    const handleDishUpdated = async () => {
        // Refresh dishes list after a dish is updated
        try {
            // Just refresh current page data
            const offset = (currentPage - 1) * limit;
            const categoryId = selectedCategory !== "all" ? selectedCategory : undefined;
            const dishesData = await getDishes({ 
                limit, 
                offset, 
                sort: sortBy,
                categoryId: categoryId
            });
            
            setDishes(dishesData.items);
            setTotal(dishesData.total);
        } catch (error) {
            console.error("Error refreshing dishes:", error);
        }
    };

    // Edit and Delete handlers for menu management
    const handleEditDish = (dishId: number) => {
        const dishToEdit = dishes.find((dish) => Number(dish.id) === dishId);
        if (dishToEdit) {
            setEditingDish(dishToEdit);
            setShowEditForm(true);
        }
    };

    const handleDeleteDish = (dishId: number) => {
        const dishToDelete = dishes.find((dish) => Number(dish.id) === dishId);
        if (dishToDelete) {
            setDeletingDish(dishToDelete);
            setShowDeleteModal(true);
        }
    };

    const handleViewDetails = (dishId: number) => {
        const dishToView = dishes.find((dish) => Number(dish.id) === dishId);
        if (dishToView) {
            setSelectedDish(dishToView);
            setShowDetailsPopup(true);
        }
    };

    // Calculate favorite count for selected dish
    const getFavoriteCount = (dishId: number) => {
        return wishes.filter(wish => Number(wish.dishId) === Number(dishId)).length;
    };

    const confirmDeleteDish = async () => {
        if (!deletingDish) return;

        try {
            setDeletingDishId(Number(deletingDish.id));
            await deleteDish(deletingDish.id);

            // Remove the deleted dish from the current list immediately (no transitions)
            setDishes(prevDishes => 
                prevDishes.filter(dish => Number(dish.id) !== Number(deletingDish.id))
            );
            
            // Update total count
            const newTotal = total - 1;
            setTotal(newTotal);

            // Check if current page becomes empty after deletion
            const newTotalPages = Math.ceil(newTotal / limit);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                // If current page is now beyond the total pages, go to the last page
                setCurrentPage(newTotalPages);
            } else if (newTotal === 0) {
                // If no items left, stay on page 1
                setCurrentPage(1);
            } else {
                // If we're still on a valid page, refresh the current page data
                // This ensures we get fresh data from the server
                fetchDishes(currentPage);
            }

            // No alert - just close modal after successful deletion
        } catch (error) {
            console.error("Error deleting dish:", error);
            // Re-throw error so modal can handle it
            throw error;
        } finally {
            setDeletingDishId(null);
            setDeletingDish(null);
        }
    };

    // handle pagination
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const limit = 12; // items per page
    // Determine if search filter is applied (category filtering is now done on backend)
    const isSearchFiltered = searchQuery.trim() !== "";
    
    // Check if we're currently searching (to disable animations)
    const isSearching = searchQuery.trim() !== "";

    // Determine total items and total pages for pagination
    // For search: use filtered results length, for category: use backend total
    const paginationTotal = isSearchFiltered ? filteredDishes.length : total;
    const paginationTotalPages = Math.ceil(paginationTotal / limit);

    // Determine the dishes to display on the current page
    const displayedDishes = isSearchFiltered
        ? filteredDishes.slice((currentPage - 1) * limit, currentPage * limit)
        : dishes;

    const fetchDishes = async (page: number) => {
        try {
            setDishesLoading(true);
            const offset = (page - 1) * limit;
            
            // Determine if we should filter by category
            const categoryId = selectedCategory !== "all" ? selectedCategory : undefined;
            
            const res = await getDishes({ 
                limit, 
                offset, 
                sort: sortBy,
                categoryId: categoryId
            });

            if (res.success) {
                setDishes(res.items);
                setTotal(res.total);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setDishesLoading(false);
        }
    };

    // Fetch dishes when page changes, sort changes, or category changes
    useEffect(() => {
        fetchDishes(currentPage);
    }, [currentPage, sortBy, selectedCategory]);

    // Trigger animation when dishes are loaded and not loading
    useEffect(() => {
        if (!dishesLoading && dishes.length > 0) {
            setAnimateCards(true);
        }
    }, [dishesLoading, dishes]);

    return (
        <div className="flex min-h-screen ">
            <Sidebar />
            <main className="flex-1 ml-64 bg-[#F6FFE8] pb-20">
                <PageTransition>
                    {/* Main Title with Shadow */}
                    <div className="sticky bg-white shadow-sm p-6 mb-6">
                        {/* <div className="sticky top-0 bg-white shadow-sm p-6 mb-6 z-10"> */}
                        <h1 className="text-2xl font-semibold text-[#3A4038]">
                            Menu Management
                        </h1>
                    </div>

                    {/* Food Title with Count */}
                    <div className="px-6 mb-6 flex items-center gap-4 font-semibold text-[#5A6058] text-lg">
                        <h2 className="text-xl text-[#3A4038]">Food</h2>
                        <div className="bg-[#D4F0C1] bg-opacity-0 px-3 rounded-2xl">
                            {
                                dishesLoading
                                    ? "..."
                                    : isSearchFiltered
                                    ? filteredDishes.length // show search filtered count
                                    : total // show total from backend (includes category filtering)
                            }
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="p-6 mb-10 flex items-center justify-between pb-0 pt-0">
                        {/* Left side: All + Categories */}

                        <div className="flex items-center gap-4 relative text-md">
                            {/* All Button */}
                            <button
                                onClick={handleAllCategorySelect}
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
                                    className="pl-10 pr-4 py-2 bg-white rounded-lg shadow-sm focus:outline-none focus:border-[#429818]  focus:ring-1 focus:ring-[#429818]  w-64"
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
                                                    setSortBy("recent");
                                                    setShowSortDropdown(false);
                                                    handleAllCategorySelect();
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
                                className="flex items-center gap-2 bg-[#429818] text-white px-4 py-2 rounded-lg hover:bg-[#3E7B27] transition-colors font-medium"
                            >
                                <PlusIcon className="h-5 w-5" />
                                Add new food
                            </button>
                        </div>
                    </div>

                    {/* Food Cards Grid */}
                    <div className="px-6 pb-10">
                        {dishesLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <Loading className="m-10" />
                            </div>
                        ) : displayedDishes.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No food items found
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {displayedDishes.map((dish, index) => (
                                    <div
                                        key={dish.id}
                                        className={
                                            animateCards && !isSearching && !dishesLoading
                                                ? "animate-fade-in-up"
                                                : "opacity-100"
                                        }
                                        style={{
                                            animationDelay: animateCards && !isSearching && !dishesLoading
                                                ? `${index * 100}ms`
                                                : "0ms",
                                            animationFillMode: "both",
                                        }}
                                    >
                                        <CardV2
                                            name={
                                                dish.name ||
                                                dish.name_kh ||
                                                "Food item"
                                            }
                                            categoryName={
                                                categories.find(
                                                    (c) =>
                                                        c.id === dish.categoryId
                                                )?.name || "Uncategorized"
                                            }
                                            description={dish.description || ""}
                                            imgURL={dish.imageURL || ""}
                                            isMenuManagement={true}
                                            onEdit={() =>
                                                handleEditDish(Number(dish.id))
                                            }
                                            onDelete={() =>
                                                handleDeleteDish(
                                                    Number(dish.id)
                                                )
                                            }
                                            onViewDetails={() =>
                                                handleViewDetails(Number(dish.id))
                                            }
                                            isDeleting={
                                                deletingDishId ===
                                                Number(dish.id)
                                            }
                                            averageFoodRating={dish.averageFoodRating || 0}
                                            totalWishes={dish.totalWishes || 0}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Pagination */}
                    {paginationTotalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={paginationTotalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                            showPrevNext
                            maxVisiblePages={5}
                        />
                    )}

                    {/* Add New Food Modal */}
                    <CreateDishModal
                        isOpen={showAddForm}
                        onClose={() => setShowAddForm(false)}
                        categories={categories}
                        onDishCreated={handleDishCreated}
                    />

                    {/* Edit Food Modal */}
                    <EditDishModal
                        isOpen={showEditForm}
                        onClose={() => {
                            setShowEditForm(false);
                            setEditingDish(null);
                        }}
                        categories={categories}
                        dish={editingDish}
                        onDishUpdated={handleDishUpdated}
                    />

                    {/* Delete Confirmation Modal */}
                    <DeleteConfirmationModal
                        isOpen={showDeleteModal}
                        onClose={() => {
                            setShowDeleteModal(false);
                            setDeletingDish(null);
                        }}
                        onConfirm={confirmDeleteDish}
                        dish={deletingDish}
                        isDeleting={deletingDishId === Number(deletingDish?.id)}
                    />

                    {/* Food Details Popup */}
                    <FoodDetailsPopup
                        isOpen={showDetailsPopup}
                        onClose={() => {
                            setShowDetailsPopup(false);
                            setSelectedDish(null);
                        }}
                        dish={selectedDish}
                        isVoter={false} // Staff members are not voters
                        favoriteCount={selectedDish ? getFavoriteCount(Number(selectedDish.id)) : 0}
                        totalWishes={selectedDish?.totalWishes}
                    />
                </PageTransition>
            </main>
        </div>
    );
};

export default MenuManagement;
