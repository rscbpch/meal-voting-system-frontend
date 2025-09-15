import { useNavigate } from "react-router-dom";
import FoodCard from "../components/CardV2";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getCategories } from "../services/dishService";
import Loading from "../components/Loading";
import { getTodayResult, updateVoteForDish, getTodayVote, voteForDish } from "../services/resultService";
import PageTransition from "../components/PageTransition";
import type { Dish as BaseDish, Category } from "../services/dishService";
import FoodDetailsPopup from "../components/FoodDetailsPopup";
import CanteenPick from "../components/CanteenPick";
import { useAuth } from "../context/AuthContext";

// Locally extend Dish to include voteCount for this page
type Dish = BaseDish & { voteCount?: number };

const Menu = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [limit, setLimit] = useState(12);

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

    const [loading, setLoading] = useState(true);
    const [todayError, setTodayError] = useState<string | null>(null);
    const [votedDishId, setVotedDishId] = useState<number | null>(null);
    const [alreadyVotedPopup, setAlreadyVotedPopup] = useState(false);
    const [changeVotePopup, setChangeVotePopup] = useState(false);
    const [pendingVoteDishId, setPendingVoteDishId] = useState<number | null>(null);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

    useEffect(() => {
        setVotedDishId(null);
        setLoading(true);

        // Fetch today's dishes and vote info
        Promise.all([getTodayResult(), getTodayVote()])
            .then(([result, vote]) => {
                // Map CandidateDish[] to Dish[] with voteCount
                const mappedDishes = (result.dishes || []).map((c) => ({
                    id: c.dishId,
                    name: c.name,
                    description: c.description,
                    imageURL: c.imageURL,
                    categoryId: c.categoryId,
                    categoryName: c.categoryName,
                    voteCount: c.voteCount,
                }));
                setDishes(mappedDishes);
                
                // Set vote information from backend
                if (vote && vote.votePollId === result.votePollId && vote.userVote) {
                    setVotedDishId(vote.userVote.dishId);
                } else {
                    setVotedDishId(null);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setTodayError("Failed to fetch today's result");
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch(() => {});
    }, []);

    const handleVote = async (dishId: number) => {
        if (!isAuthenticated || !user) {
            navigate('/sign-in');
            return;
        }

        // If no vote yet (first vote), allow
        if (!votedDishId) {
            await performVote(dishId, true);
            return;
        }

        // If user has already voted for a different dish, show confirmation popup
        if (votedDishId && votedDishId !== dishId) {
            setPendingVoteDishId(dishId);
            setChangeVotePopup(true);
            return;
        }

        // If user tries to vote again for the same dish, just allow
        await performVote(dishId, false);
    };

    // Helper to perform the vote or update
    // performVote: isFirstVote = true if this is the first vote (no votedDishId yet)
    const performVote = async (dishId: number, isFirstVote = false) => {
        try {
            // Use POST for first vote, PUT for vote update
            if (isFirstVote) {
                await voteForDish(dishId);
            } else {
                await updateVoteForDish(dishId);
            }

            // Refresh vote status and results from backend
            const [newVote, todayResult] = await Promise.all([getTodayVote(), getTodayResult()]);
            if (newVote && newVote.userVote) {
                setVotedDishId(newVote.userVote.dishId);
            } else {
                setVotedDishId(null);
            }
            
            // Update dishes after voting
            const mappedDishes = (todayResult.dishes || []).map((c) => ({
                id: c.dishId,
                name: c.name,
                description: c.description,
                imageURL: c.imageURL,
                categoryId: c.categoryId,
                categoryName: c.categoryName,
                voteCount: c.voteCount,
            }));
            setDishes(mappedDishes);
        } catch (error: any) {
            // Show already voted popup if backend returns status 403
            if (error?.status === 403 || error?.response?.status === 403) {
                setAlreadyVotedPopup(true);
            } else {
                alert(error?.message || "Failed to vote. Please try again.");
            }
            console.error("Vote error:", error);
        }
    };
    

    return (
        <div>
            <Navbar/>
            <PageTransition>
                <main className="min-h-screen mx-auto pt-10 pb-16 px-4 sm:px-6 lg:px-14 bg-[#F6FFE8]">
                    <div className="mb-8">
                        <CanteenPick />
                    </div>
                    <div>
                        <h2 className="text-[20px] font-bold mb-4">Vote poll</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-2 md:gap-6 w-full">
                        {loading && (
                            <div className="flex justify-center items-center w-full col-span-4 py-10">
                                <Loading />
                            </div>
                        )}
                        {!loading && dishes.slice(0, limit).map(dish => {
                            // Voting is now controlled by backend - no need for localStorage checks
                            // The backend will handle vote validation and prevent duplicate votes
                            const categoryName = categories.find(cat => String(cat.id) === String(dish.categoryId))?.name || dish.categoryName || "";
                            const dishIdNum = typeof dish.id === 'string' ? parseInt(dish.id, 10) : dish.id;
                            return (
                                <FoodCard
                                    key={dishIdNum}
                                    name={dish.name}
                                    dishId={dishIdNum}
                                    categoryName={categoryName}
                                    description={dish.description ?? ""}
                                    imgURL={dish.imageURL ?? ""}
                                    initialVotes={dish.voteCount}
                                    disabled={false} // Backend handles vote validation
                                    isVote={true}
                                    onVote={() => {
                                        if (!isAuthenticated || !user) {
                                            navigate("/sign-in");
                                            return;
                                        }
                                        handleVote(dishIdNum);
                                    }}
                                    currentVoteCount={dish.voteCount}
                                    currentVoteDishId={votedDishId}
                                    onViewDetails={() => {
                                        setSelectedDish(dish);
                                        setShowDetailsPopup(true);
                                    }}
                                />
                            );
                        })}
                        {/* Food Details Popup */}
                        <FoodDetailsPopup
                            isOpen={showDetailsPopup}
                            onClose={() => setShowDetailsPopup(false)}
                            dish={selectedDish}
                            isVoter={true}
                        />
                    </div>
                    <div>
                        {todayError && (
                            <div className="flex justify-center items-center w-full my-8">
                                <div className="text-red-500">{todayError}</div>
                            </div>
                        )}
                    </div>
                </main>
            </PageTransition>
            <Footer/>
            {/* Already voted popup */}
            {alreadyVotedPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 flex flex-col items-center">
                        <h3 className="text-lg font-semibold mb-2 text-center">Already voted</h3>
                        <p className="text-sm text-gray-600 mb-4 text-center">
                            You have already voted today on this device.
                        </p>
                        <div className="flex justify-end w-full">
                            <button
                                onClick={() => setAlreadyVotedPopup(false)}
                                className="px-4 py-2 text-sm rounded-md bg-[#429818] text-white hover:bg-[#367A14] ml-auto"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Change vote confirmation popup */}
            {changeVotePopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-xs w-full flex flex-col items-center">
                        <div className="text-lg font-semibold mb-4 text-center">You have already voted. Do you want to change your vote to this dish?</div>
                        <div className="flex gap-4 mt-2">
                            <button
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                                onClick={() => {
                                    setChangeVotePopup(false);
                                    setPendingVoteDishId(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-6 py-2 bg-[#429818] text-white rounded hover:bg-[#367A14] transition"
                                onClick={async () => {
                                    if (pendingVoteDishId) {
                                        setChangeVotePopup(false);
                                        await performVote(pendingVoteDishId, false);
                                        setPendingVoteDishId(null);
                                    }
                                }}
                            >
                                Yes, change vote
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Menu;