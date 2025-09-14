import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageTransition from "../../components/PageTransition";
import { FiHeart } from "react-icons/fi";
import { useEffect, useState } from "react";
import CardV2 from "../../components/CardV2";
import Pagination from "../../components/Pagination";
import { getMostWishedDishes, getCategories } from "../../services/dishService";
import Loading from "../../components/Loading";
import type { Dish, Category } from "../../services/dishService";
import { fetchAllWishes, fetchAndStoreUserWishes, attemptUpdateUserWish } from "../../services/wishService";
import FoodDetailsPopup from "../../components/FoodDetailsPopup";
import type { WishData, UserWish } from "../../services/wishService";
import { getProfile } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
    const navigate = useNavigate();
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [wishes, setWishes] = useState<WishData[]>([]);
    const [userWish, setUserWish] = useState<UserWish | null>(null);
    // Modal / popup state
    const [showConfirm, setShowConfirm] = useState(false);
    const [showCooldown, setShowCooldown] = useState(false);
    const [cooldownRemaining, setCooldownRemaining] = useState<number | null>(null);
    const [pendingWish, setPendingWish] = useState<{ dishId: number; name: string } | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [limit, setLimit] = useState(12);
    // Food details popup state
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
    const [selectedDishTotalWishes, setSelectedDishTotalWishes] = useState<number | null>(null);

    // Update limit based on screen size (grid columns)
    useEffect(() => {
        function updateLimit() {
            const width = window.innerWidth;
            // Tailwind breakpoints: xl:1280px, lg:1024px, md:768px
            if (width >= 1280) {
                setLimit(15); // 5 columns
            } else if (width >= 1024) {
                setLimit(12); // 3 columns (lg)
            } else if (width >= 768) {
                setLimit(12); // 3 columns (md)
            } else {
                setLimit(10); // fallback for mobile
            }
        }
        updateLimit();
        window.addEventListener('resize', updateLimit);
        return () => window.removeEventListener('resize', updateLimit);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [dishRes, catRes, wishRes] = await Promise.all([
                    getMostWishedDishes(),
                    getCategories(),
                    fetchAllWishes(),
                ]);
                setDishes(dishRes.items);
                setTotal(dishRes.total);
                setCategories(catRes);
                setWishes(wishRes.dishes);
            } catch (err: any) {
                setError(err.message || "Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        const checkAuthAndFetchWish = async () => {
            try {
                const user = await getProfile();
                setIsLoggedIn(!!user);
                if (user) {
                    // Fetch user wish from API and set state directly
                    const wishes = await fetchAndStoreUserWishes();
                    setUserWish(wishes[0] || null);
                } else {
                    setUserWish(null);
                }
            } catch {
                setIsLoggedIn(false);
                setUserWish(null);
            }
        };
        checkAuthAndFetchWish();
    }, [currentPage]);

    const totalPages = Math.ceil(total / limit);

    // Handler to update wishes and user wish after a wish change
    const handleWishChange = async () => {
        // Refetch wishes and update userWish state from API
        const wishRes = await fetchAllWishes();
        setWishes(wishRes.dishes);
        // Fetch user wish from API and set state directly
        try {
            const wishes = await fetchAndStoreUserWishes();
            setUserWish(wishes[0] || null);
        } catch {
            setUserWish(null);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };


    // Helper to check cooldown status for a dish change
    const checkCooldownStatus = async (dishId: number) => {
        // Use attemptUpdateUserWish, but do not change the wish if not confirmed
        const result = await attemptUpdateUserWish(dishId);
        if (result.status === 403 && result.cooldownRemaining !== undefined) {
            setCooldownRemaining(result.cooldownRemaining);
            setShowCooldown(true);
            setShowConfirm(false);
            setPendingWish(null);
            return false;
        }
        // If not in cooldown, do not change wish yet, just allow confirmation
        return true;
    };

    // Parent handler for wishlist click from card
    const handleWishlistClick = async (dishId: number, name: string) => {
        if (!isLoggedIn) {
            navigate('/sign-in');
            return;
        }
        // If already the current wish, ignore
        if (userWish?.dishId === dishId) return;
        setPendingWish({ dishId, name });
        // If user has an existing different wish, check cooldown first
        if (userWish && userWish.dishId && userWish.dishId !== dishId) {
            const canChange = await checkCooldownStatus(dishId);
            if (canChange) {
                setShowConfirm(true);
            }
        } else {
            // Directly attempt wish update (first wish) respecting cooldown
            confirmWishChange(dishId);
        }
    };

    const confirmWishChange = async (dishId: number) => {
        setActionLoading(true);
        // We already checked cooldown before showing confirmation, so just update
        const result = await attemptUpdateUserWish(dishId);
        if (result.success) {
            await handleWishChange();
            setShowConfirm(false);
            setPendingWish(null);
        } else if (result.status === 403 && result.cooldownRemaining !== undefined) {
            // Edge case: cooldown just started between check and confirm
            setCooldownRemaining(result.cooldownRemaining);
            setShowCooldown(true);
            setShowConfirm(false);
        } else {
            alert(result.message || 'Failed to update wish');
            setShowConfirm(false);
        }
        setActionLoading(false);
    };

    // Live countdown for cooldown popup
    useEffect(() => {
        let timer: number | null = null;
        if (showCooldown && cooldownRemaining !== null) {
            timer = window.setInterval(() => {
                setCooldownRemaining(prev => {
                    if (prev === null) return null;
                    if (prev <= 1) {
                        setShowCooldown(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timer !== null) clearInterval(timer);
        };
    }, [showCooldown, cooldownRemaining]);

    return (
        <div>
            <Navbar />
            <PageTransition>
                <main className="min-h-screen mx-auto pt-10 pb-16 px-4 sm:px-6 lg:px-14 bg-[#F6FFE8]">
                    <div>
                        <div>
                            <h2 className="text-[20px] font-bold mb-4">Your wishlist</h2>
                        </div>
                        {/* Show user wish card if logged in */}
                        {isLoggedIn === true ? (
                            <div>
                                {userWish && userWish.dishId && userWish.dishId !== null && userWish.Dish !== null ? (
                                    (() => {
                                        const dishName = userWish.dishName || userWish.name || "-";
                                        const categoryName = userWish.categoryName || categories.find(cat => String(cat.id) === String(userWish.categoryId))?.name || "-";
                                        const description = userWish.description || "No description available.";
                                        const wishCount = wishes.find(w => w.dishId === userWish.dishId)?.totalWishes || 0;
                                        const sortedWishes = [...wishes].sort((a, b) => b.totalWishes - a.totalWishes);
                                        const ranking = sortedWishes.findIndex(w => w.dishId === userWish.dishId) + 1;
                                        const fallbackImg = '/src/assets/LogoGreen.svg';
                                        const imgSrc = userWish.image && userWish.image.trim() !== "" ? userWish.image : fallbackImg;

                                        return (
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-1 md:p-2 flex flex-col items-center justify-center h-full">
                                                <div 
                                                    className="bg-white rounded-[10px] flex flex-col items-center justify-center w-full h-fill min-h-[100px] md:min-h-[180px]"
                                                    onClick={() => {
                                                        setSelectedDish(userWish.Dish);
                                                        setSelectedDishTotalWishes(wishes.find(w => w.dishId === userWish.dishId)?.totalWishes || 0);
                                                        setShowDetailsPopup(true);
                                                    }}
                                                >
                                                    <div className="flex flex-col md:flex-row items-center justify-between w-full h-full p-3 md:p-6">
                                                        <div className="flex flex-row w-full gap-4 py-4 items-center max-h-[88px] md:max-h-[140px]">
                                                            <img
                                                                src={imgSrc}
                                                                alt={userWish.dishName || "Favorite Dish"}
                                                                className="w-16 h-16 md:w-28 md:h-28 object-cover rounded-full border-2 border-[#E6F4D7] shadow-md"
                
                                                            />
                                                            <div className="flex flex-col ml-3 md:ml-6 gap-1 md:gap-2 w-full sm:max-w-[210px] md:max-w-[700px]">
                                                                {/* food info */}
                                                                <h3 className="text-[12px] md:text-[18px] lg:text-[22px] font-bold text-gray-800 max-h-[42px] md:max-h-[54px] md:max-w-[700px]">
                                                                    {dishName}
                                                                </h3>
                                                                <span className="hidden md:block bg-gray-100 text-gray-600 text-[10px] px-1 py-0.5 md:text-[12px] md:px-2 md:py-1 rounded font-medium w-fit">
                                                                    {categoryName}
                                                                </span>
                                                                <p className="hidden md:block text-gray-500 text-[14px] max-h-[22px] max-w-[700px] truncate overflow-hidden whitespace-nowrap">
                                                                    {description}
                                                                </p>
                                                                
                                                                {/* ranking and wish counts on sm */}
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="md:hidden bg-gray-100 text-gray-600 text-[10px] px-1 py-0.5 md:text-[12px] md:px-2 md:py-1 rounded font-medium w-fit">
                                                                        {categoryName}
                                                                    </span>
                                                                    <div className="flex items-center gap-2 md:hidden min-h-[20px]">
                                                                        {/* ranking */}
                                                                        <div className="flex items-center gap-1 pr-3 border-r border-gray-300 h-4">
                                                                            <svg 
                                                                                className="w-3 h-3 md:w-4 md:h-4" 
                                                                                viewBox="0 0 14 23" 
                                                                                fill="none" 
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                            >
                                                                                <path d="M7.73937 7.16312L7.22312 6.13617C7.13781 5.95785 6.87094 5.9514 6.77687 6.13617L6.26063 7.16312L5.11656 7.32425C4.91313 7.35433 4.82562 7.6014 4.97656 7.74964L5.80781 8.54457L5.61094 9.6639C5.58031 9.86371 5.79031 10.0184 5.97844 9.92601L7.00437 9.3932L8.02375 9.91742C8.21187 10.0098 8.42406 9.85511 8.39125 9.65531L8.19438 8.53597L9.02563 7.74964C9.17438 7.60355 9.08906 7.35648 8.88562 7.32425L7.74156 7.16312H7.73937ZM5.6 11.5008C5.21281 11.5008 4.9 11.808 4.9 12.1883V16.3133C4.9 16.6936 5.21281 17.0008 5.6 17.0008H8.4C8.78719 17.0008 9.1 16.6936 9.1 16.3133V12.1883C9.1 11.808 8.78719 11.5008 8.4 11.5008H5.6ZM0.7 12.8758C0.312812 12.8758 0 13.183 0 13.5633V16.3133C0 16.6936 0.312812 17.0008 0.7 17.0008H3.5C3.88719 17.0008 4.2 16.6936 4.2 16.3133V13.5633C4.2 13.183 3.88719 12.8758 3.5 12.8758H0.7ZM9.8 14.9383V16.3133C9.8 16.6936 10.1128 17.0008 10.5 17.0008H13.3C13.6872 17.0008 14 16.6936 14 16.3133V14.9383C14 14.558 13.6872 14.2508 13.3 14.2508H10.5C10.1128 14.2508 9.8 14.558 9.8 14.9383Z" fill="#D6D6D6" />
                                                                            </svg>
                                                                            <p className="text-[12px] md:text-[16px] font-semibold text-[#367A14]">
                                                                                {ranking}
                                                                            </p>
                                                                        </div>

                                                                        {/* wish count */}
                                                                        <div className="flex flex-row gap-1 text-[#A2A2A2]  text-[12px] md:text-[16px] font-medium">
                                                                            <svg 
                                                                                className="w-4 h-4"
                                                                                viewBox="0 0 40 40" 
                                                                                fill="none"
                                                                            >
                                                                                <path
                                                                                    d="M20 36s-1.45-1.32-3.6-3.13C10.2 28.13 4 22.6 4 16.5 4 11.36 8.36 7 13.5 7c2.54 0 4.99 1.19 6.5 3.09C21.51 8.19 23.96 7 26.5 7 31.64 7 36 11.36 36 16.5c0 6.1-6.2 11.63-12.4 16.37C21.45 34.68 20 36 20 36z"
                                                                                    fill="#A3D47C"
                                                                                />
                                                                            </svg>
                                                                            <p>
                                                                                {wishCount.toLocaleString()} 
                                                                                {wishCount === 1 
                                                                                    ? "like" 
                                                                                    : "likes"}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="md:hidden flex items-center justify-end ml-auto">
                                                                <svg 
                                                                    width="40" height="40" 
                                                                    viewBox="0 0 40 40" 
                                                                    fill="none"
                                                                >
                                                                    <path
                                                                        d="M20 36s-1.45-1.32-3.6-3.13C10.2 28.13 4 22.6 4 16.5 4 11.36 8.36 7 13.5 7c2.54 0 4.99 1.19 6.5 3.09C21.51 8.19 23.96 7 26.5 7 31.64 7 36 11.36 36 16.5c0 6.1-6.2 11.63-12.4 16.37C21.45 34.68 20 36 20 36z"
                                                                        fill="#A3D47C"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        </div>

                                                        {/* ranking and wish counts on md */}
                                                        <div className="hidden md:flex flex-col min-w-[140px] h-full justify-between gap-y-10">
                                                            {/* green heart */}
                                                            <div className="flex items-center justify-end">
                                                                <svg 
                                                                    width="40" height="40" 
                                                                    viewBox="0 0 40 40" 
                                                                    fill="none"
                                                                >
                                                                    <path
                                                                        d="M20 36s-1.45-1.32-3.6-3.13C10.2 28.13 4 22.6 4 16.5 4 11.36 8.36 7 13.5 7c2.54 0 4.99 1.19 6.5 3.09C21.51 8.19 23.96 7 26.5 7 31.64 7 36 11.36 36 16.5c0 6.1-6.2 11.63-12.4 16.37C21.45 34.68 20 36 20 36z"
                                                                        fill="#A3D47C"
                                                                    />
                                                                </svg>
                                                            </div>

                                                            <div className="flex justify-end w-full">
                                                                <div className="flex flex-row items-center gap-2 mt-2">
                                                                    {/* ranking */}
                                                                    <div className="flex items-center gap-1 pr-4 border-r border-gray-300 h-4">
                                                                        <svg 
                                                                            className="w-6 h-6 lg:w-4 lg:h-4" 
                                                                            viewBox="0 0 14 23" 
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <path d="M7.73937 7.16312L7.22312 6.13617C7.13781 5.95785 6.87094 5.9514 6.77687 6.13617L6.26063 7.16312L5.11656 7.32425C4.91313 7.35433 4.82562 7.6014 4.97656 7.74964L5.80781 8.54457L5.61094 9.6639C5.58031 9.86371 5.79031 10.0184 5.97844 9.92601L7.00437 9.3932L8.02375 9.91742C8.21187 10.0098 8.42406 9.85511 8.39125 9.65531L8.19438 8.53597L9.02563 7.74964C9.17438 7.60355 9.08906 7.35648 8.88562 7.32425L7.74156 7.16312H7.73937ZM5.6 11.5008C5.21281 11.5008 4.9 11.808 4.9 12.1883V16.3133C4.9 16.6936 5.21281 17.0008 5.6 17.0008H8.4C8.78719 17.0008 9.1 16.6936 9.1 16.3133V12.1883C9.1 11.808 8.78719 11.5008 8.4 11.5008H5.6ZM0.7 12.8758C0.312812 12.8758 0 13.183 0 13.5633V16.3133C0 16.6936 0.312812 17.0008 0.7 17.0008H3.5C3.88719 17.0008 4.2 16.6936 4.2 16.3133V13.5633C4.2 13.183 3.88719 12.8758 3.5 12.8758H0.7ZM9.8 14.9383V16.3133C9.8 16.6936 10.1128 17.0008 10.5 17.0008H13.3C13.6872 17.0008 14 16.6936 14 16.3133V14.9383C14 14.558 13.6872 14.2508 13.3 14.2508H10.5C10.1128 14.2508 9.8 14.558 9.8 14.9383Z" fill="#D6D6D6" />
                                                                        </svg>
                                                                        <p className="text-[14px] lg:text-[16px] font-semibold text-[#367A14]">
                                                                            {ranking}
                                                                        </p>
                                                                    </div>
                                                                    {/* wish count */}
                                                                    <div className="text-[#A2A2A2] text-[14px] lg:text-[16px] font-medium pl-3">
                                                                        <p>
                                                                            {wishCount.toLocaleString()} 
                                                                            {wishCount === 1 
                                                                                    ? "like" 
                                                                                    : "likes"}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()
                                ) : (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 flex flex-col items-center justify-center">
                                        <div className="bg-white rounded-lg flex flex-col items-center justify-center w-full min-h-[240px] md:min-h-[320px]">
                                            <div className="flex flex-col items-center justify-center w-full">
                                                <div className="flex flex-col items-center">
                                                    <div className="bg-[#F6FFE8] rounded-full w-10 h-10 md:w-16 md:h-16 flex items-center justify-center m-1 md:mb-4">
                                                        <FiHeart className="text-[18px] md:text-3xl text-[#4B8F29]" />
                                                    </div>
                                                    <h3 className="text-[18px] md:text-2xl font-semibold text-gray-700 md:mb-1 text-center">Your wishlist is empty!</h3>
                                                    <p className="text-[14px] md:text-[16px] text-gray-500 text-center mb-6">Select your favorite dish, only one favorite allowed</p>
                                                    <button 
                                                        className="bg-[#4B8F29] hover:bg-[#35701e] text-white font-semibold py-2 px-8 rounded-lg transition-colors duration-200"
                                                        onClick={() => {
                                                            const menuSection = document.getElementById('menu');
                                                            if (menuSection) {
                                                                menuSection.scrollIntoView({ behavior: 'smooth' });
                                                            }
                                                        }}
                                                    >
                                                        Pick your dish
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : isLoggedIn === false ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 flex flex-col items-center justify-center">
                                <div className="bg-white rounded-lg flex flex-col items-center justify-center w-full min-h-[240px] md:min-h-[320px]">
                                    <div className="flex flex-col items-center justify-center w-full">
                                        <div className="flex flex-col items-center">
                                            <div className="bg-[#F6FFE8] rounded-full w-10 h-10 md:w-16 md:h-16 flex items-center justify-center m-1 md:mb-4">
                                                <FiHeart className="text-[18px] md:text-3xl text-[#4B8F29]" />
                                            </div>
                                            <h3 className="text-[18px] md:text-2xl font-semibold text-gray-700 md:mb-1 text-center">Sign in to access to your wishlist</h3>
                                            <p className="text-[14px] md:text-[16px] text-gray-500 text-center mb-6">where you can pick your favorite dish</p>
                                            <button 
                                                className="bg-[#4B8F29] hover:bg-[#35701e] text-white font-semibold py-2 px-8 rounded-lg transition-colors duration-200"
                                                onClick={() => navigate('/sign-in')}
                                            >
                                                Sign in
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div className="mt-6" id="menu">
                        {loading ? (
                            <div className="flex justify-center items-center min-h-[300px] w-full">
                                <Loading className="" />
                            </div>
                        ) : error ? (
                            <div className="text-red-500 py-10 text-center">{error}</div>
                        ) : dishes.length === 0 ? (
                            <div className="py-10 text-gray-500 text-center">No dishes found.</div>
                        ) : (
                            <>
                                <div className="my-4">
                                    <h2 className="text-[20px] font-bold">All menu</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-2 md:gap-6 w-full">
                                    {(Array.isArray(dishes) ? dishes.slice((currentPage - 1) * limit, currentPage * limit) : []).map((dish, idx) => {
                                        const categoryName = dish.categoryName || categories.find(cat => String(cat.id) === String(dish.categoryId))?.name || "";
                                        const wishCount = wishes.find(w => w.dishId === Number(dish.id))?.totalWishes || 0;
                                        const ranking = (currentPage - 1) * limit + idx + 1;

                                        return (
                                            <CardV2
                                                key={dish.id}
                                                name={dish.name}
                                                dishId={Number(dish.id)}
                                                categoryName={categoryName}
                                                description={dish.description || ""}
                                                imgURL={dish.imageURL || "https://via.placeholder.com/150"}
                                                isWishlist={true}
                                                wishlistCount={wishCount}
                                                totalWishes={wishCount}
                                                ranking={ranking}
                                                currentWishDishId={userWish?.dishId ?? null}
                                                onWishlistClick={handleWishlistClick}
                                                onViewDetails={() => {
                                                    setSelectedDish(dish);
                                                    setSelectedDishTotalWishes(wishCount);
                                                    setShowDetailsPopup(true);
                                                }}
                                            />
                                        );
                                    })}
                                </div>

                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        )}
                    </div>
                </main>
                {/* Confirmation Modal */}
                {showConfirm && pendingWish && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                        <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
                            <h3 className="text-lg font-semibold mb-2">Change your wish?</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                You can only wish once per hour. Are you sure you want to change your wish to <span className="font-medium">{pendingWish.name}</span>?
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => { setShowConfirm(false); setPendingWish(null); }}
                                    className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
                                    disabled={actionLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => confirmWishChange(pendingWish.dishId)}
                                    className="px-4 py-2 text-sm rounded-md bg-[#4B8F29] text-white hover:bg-[#35701e] disabled:opacity-60"
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? 'Updating...' : 'Yes, Change'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Cooldown Modal */}
                {showCooldown && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                        <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
                            <h3 className="text-lg font-semibold mb-2">Cooldown active</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                You can only wish once per hour.<br />
                                {cooldownRemaining !== null && cooldownRemaining > 0 && (
                                    <span>
                                        Please wait <span className="font-semibold text-[#4B8F29]">
                                        {Math.floor(cooldownRemaining / 60)}m {cooldownRemaining % 60}s
                                        </span> before wishing again.
                                    </span>
                                )}
                                {cooldownRemaining === 0 && (
                                    <span className="text-green-600 font-semibold">You can now change your wish!</span>
                                )}
                            </p>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => { setShowCooldown(false); setPendingWish(null); }}
                                    className="px-4 py-2 text-sm rounded-md bg-[#4B8F29] text-white hover:bg-[#35701e]"
                                >
                                    Got it
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            {/* Food Details Popup */}
            <FoodDetailsPopup
                isOpen={showDetailsPopup}
                onClose={() => setShowDetailsPopup(false)}
                dish={selectedDish}
                isVoter={true}
                totalWishes={selectedDishTotalWishes}
            />
            </PageTransition>
            <Footer />
        </div>
    );
};

export default Wishlist;