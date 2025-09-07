import { useState, useEffect } from "react";
import Sidebar from "../../components/SideBar";
import PageTransition from "../../components/PageTransition";
import CardV2 from "../../components/CardV2";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import CreateDishModal from "../../features/dish/CreateDishModal";
import {
    getDishes,
    getCategories,
} from "../../services/dishService";
import type {
    Dish,
    Category,
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

    const handleDishCreated = async () => {
        // Refresh dishes list after a new dish is created
        try {
            const dishesData = await getDishes({ sort: sortBy });
            setDishes(dishesData.items);
        } catch (error) {
            console.error("Error refreshing dishes:", error);
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

    // handle pagination
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const limit = 12; // items per page
    // Determine if filter/search is applied
    const isFiltered = searchQuery.trim() !== "" || selectedCategory !== "all";

    // Determine total items and total pages for pagination
    const paginationTotal = isFiltered ? filteredDishes.length : total;
    const paginationTotalPages = Math.ceil(paginationTotal / limit);

    // Determine the dishes to display on the current page
    const displayedDishes = isFiltered
        ? filteredDishes.slice((currentPage - 1) * limit, currentPage * limit)
        : dishes;

    const fetchDishes = async (page: number) => {
        try {
            setLoading(true);
            const offset = (page - 1) * limit;
            const res = await getDishes({ limit, offset });

            if (res.success) {
                setDishes(res.items);
                setTotal(res.total);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDishes(currentPage);
    }, [currentPage]);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 bg-[#F6FFE8] ">
                <PageTransition>
                    {/* Main Title with Shadow */}
                    <div className="sticky bg-white shadow-sm p-6 mb-6">
                        {/* <div className="sticky top-0 bg-white shadow-sm p-6 mb-6 z-10"> */}
                        <h1 className="text-2xl font-semibold text-[#3A4038]">
                            Menu Management
                        </h1>
                    </div>

                    {/* Food Title with Count */}
                    <div className="px-6 mb-6 flex items-center gap-4 font-semibold text-[#3A4038] text-xl">
                        <h2>Food</h2>
                        <div className="bg-[#A1DB7A] bg-opacity-0 pt-1 p-2 rounded-md">
                            {
                                loading
                                    ? "..."
                                    : searchQuery || selectedCategory !== "all"
                                    ? filteredDishes.length // show filtered count
                                    : total // show total from backend
                            }
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
                                <Loading className="m-10" />
                            </div>
                        ) : displayedDishes.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No food items found
                            </div>
                        ) : (
                            displayedDishes.map((dish) => (
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
                                    // isMenuManagement={true}
                                    isWishlist={true}
                                    onEdit={() =>
                                        handleEditDish(Number(dish.id))
                                    }
                                    onDelete={() =>
                                        handleDeleteDish(Number(dish.id))
                                    }
                                    averageRating={dish.rating || 0}
                                    wishlistCount={
                                        1
                                    }
                                />
                            ))
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
                </PageTransition>
            </main>
        </div>
    );
};

export default MenuManagement;
