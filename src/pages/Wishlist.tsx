import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";
import { FiHeart } from "react-icons/fi";
import { useEffect, useState } from "react";
import CardV2 from "../components/CardV2";
import Pagination from "../components/Pagination";
import { getMostWishedDishes, getCategories } from "../services/dishService";
import Loading from "../components/Loading";
import type { Dish, Category } from "../services/dishService";
import { fetchAllWishes } from "../services/wishService";
import type { WishData } from "../services/wishService";


const Wishlist = () => {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [wishes, setWishes] = useState<WishData[]>([]);
    const limit = 10; // items per page


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
    }, [currentPage]);

    const totalPages = Math.ceil(total / limit);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div>
            <Navbar />
            <PageTransition>
                <main className="min-h-screen mx-auto p-6 bg-[#F6FFE8]">
                    <div>
                        <div>
                            <h2 className="text-[20px] font-bold">Your wishlist</h2>
                        </div>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 flex flex-col items-center justify-center">
                            <div className="bg-white rounded-lg flex flex-col items-center justify-center w-full min-h-[320px]">
                                <div className="flex flex-col items-center justify-center w-full">
                                    <div className="flex flex-col items-center">
                                        <div className="bg-[#F6FFE8] rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                            <FiHeart className="text-3xl text-[#4B8F29]" />
                                        </div>
                                        <h3 className="text-2xl font-semibold text-gray-700 mb-1 text-center">Sign in to access to your wishlist</h3>
                                        <p className="text-gray-500 text-center mb-6">where you can pick your favorite dish</p>
                                        <button className="bg-[#4B8F29] hover:bg-[#35701e] text-white font-semibold py-2 px-8 rounded-lg transition-colors duration-200">Sign in</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Food cards grid below the wishlist box */}
                    <div className="mt-8">
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
                                <div>
                                    <h2 className="text-[20px] font-bold">All menu</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
                                    {(Array.isArray(dishes) ? dishes.slice((currentPage - 1) * limit, currentPage * limit) : []).map((dish, idx) => {
                                        // Find category name from categories list if not present in dish
                                        const categoryName = dish.categoryName || categories.find(cat => String(cat.id) === String(dish.categoryId))?.name || "";
                                        // Find wish count for this dish
                                        const wishCount = wishes.find(w => w.dishId === Number(dish.id))?.totalWishes || 0;
                                        // Continuous ranking across pages
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
                                                ranking={ranking}
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
            </PageTransition>
        </div>
    );
};

export default Wishlist;