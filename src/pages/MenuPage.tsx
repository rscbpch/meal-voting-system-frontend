import { useNavigate } from "react-router-dom";
import FoodCard from "../components/CardV2";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getCategories } from "../services/dishService";
import Loading from "../components/Loading";
import { getTodayResult, voteForDish, updateVoteForDish, getTodayVote } from "../services/resultService";
import PageTransition from "../components/PageTransition";
import Pagination from "../components/Pagination";
import type { Dish as BaseDish, Category } from "../services/dishService";

// Locally extend Dish to include voteCount for this page
type Dish = BaseDish & { voteCount?: number };

const Menu = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [limit, setLimit] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(dishes.length / limit);

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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState<string | null>(null);
    // const [upcomingResults, setUpcomingResults] = useState<UpcomingResult[]>([]);
    const [todayError, setTodayError] = useState<string | null>(null);
    // const [upcomingError, setUpcomingError] = useState<string | null>(null);
    // const [votePollId, setVotePollId] = useState<number | null>(null);
    const [votedDishId, setVotedDishId] = useState<number | null>((null));
    const [todayVote, setTodayVote] = useState<any>(null);
    // const [votedDishId, setVotedDishId] = useState<number | null>(null);

    useEffect(() => {
        setVotedDishId(null);
        setIsLoggedIn(!!localStorage.getItem("token"));
        setLoading(true);

        // Fetch today's dishes and vote info
        getTodayResult()
            .then((res) => {
                // Map CandidateDish[] to Dish[] with voteCount
                const mappedDishes = (res.dishes || []).map((c) => ({
                    id: c.dishId,
                    name: c.name,
                    description: c.description,
                    imageURL: c.imageURL,
                    categoryId: c.categoryId,
                    categoryName: c.categoryName,
                    voteCount: c.voteCount,
                }));
                setDishes(mappedDishes);
                getTodayVote().then((vote) => {
                    setTodayVote(vote);
                    if (vote && vote.votePollId === res.votePollId && vote.userVote) {
                        setVotedDishId(vote.userVote.dishId);
                    } else {
                        setVotedDishId(null);
                    }
                    setLoading(false);
                });
            })
            .catch(() => {
                setTodayError("Failed to fetch today's result");
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch(() => {});
    }, []);

    // const upcomingBannerItems = useMemo(() => {
    //     if (!upcomingResults || upcomingResults.length === 0) return [];
    //     if (!foods || foods.length === 0) return [];
    //     const first = upcomingResults[0] as any;
    //     const candidates: any[] = first?.dish ?? first?.dishes ?? first?.items ?? first?.data ?? [];
    //     if (!Array.isArray(candidates) || candidates.length === 0) return [];
    //     const selected = candidates.filter((c: any) => c.isSelected === true);
    //     if (!selected || selected.length === 0) return [];

    //     return selected.map((candidate: any) => {
    //         // candidate may be shape: { id, votePollId, dishId, isSelected, Dish: { id, name }, voteCount? }
    //         const dishId = candidate.dishId ?? candidate.Dish?.id ?? candidate.dish?.id ?? null;
    //         const dishName = candidate.Dish?.name ?? candidate.dish ?? candidate.name ?? "";
    //         const dishInfo = foods.find((dish) => dish.id == dishId) as any;
    //         const voteCount = candidate.voteCount ?? candidate.votes ?? 0;
    //         return {
    //             title: dishName,
    //             subtitle: `Selected`,
    //             description: dishInfo?.description ?? "",
    //             imgSrc: dishInfo?.imageURL ?? dishInfo?.imageUrl ?? candidate.Dish?.imageURL ?? "",
    //             voteCount: voteCount,
    //         };
    //     });
    // },[upcomingResults, foods]);

    const handleVote = async (dishId: number) => {
        if (!isLoggedIn) {
            navigate('/sign-in');
            return;
        }

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const currentUserId = user.id;
        const votedUserId = localStorage.getItem("votedUserId");
        // console.log("vote:", vote, "currentUserId:", currentUserId, "votedUserId:", votedUserId);

        if (votedDishId && votedUserId !== currentUserId) {
            alert("You have already voted. You can only vote once per vote poll.");
            return;
        }
        try {
            if (!todayVote?.userVote) {
                await voteForDish(dishId);
                localStorage.setItem("votedUserId", currentUserId);
            } else {
                await updateVoteForDish(dishId);
            }

            const [newVote, todayResult] = await Promise.all([getTodayVote(), getTodayResult()]);
            setTodayVote(newVote);
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
            alert(error?.message || "Failed to vote. Please try again.");
            console.error("Vote error:", error);
        }
    };
    

    return (
        <div>
            <Navbar/>
            <PageTransition>
                <main className="min-h-screen mx-auto pt-10 pb-16 px-4 sm:px-6 lg:px-14 bg-[#F6FFE8]">
                    <div>
                        <h2 className="text-[20px] font-bold">Vote poll</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-2 md:gap-6 w-full">
                        {loading && (
                            <div className="flex justify-center items-center w-full col-span-4 py-10">
                                <Loading />
                            </div>
                        )}
                        {!loading && dishes.slice((currentPage - 1) * limit, currentPage * limit).map(dish => {
                            const user = JSON.parse(localStorage.getItem("user") || "{}");
                            const currentUserId = user.id;
                            const votedUserId = localStorage.getItem("votedUserId");
                            const votingDisabled = !!votedUserId && votedUserId !== currentUserId;
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
                                    disabled={votingDisabled}
                                    isVote={true}
                                    onVote={() => {
                                        if (!isLoggedIn) {
                                            navigate("/sign-in");
                                            return;
                                        }
                                        handleVote(dishIdNum);
                                    }}
                                    currentVoteCount={dish.voteCount}
                                />
                            );
                        })}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
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
        </div>
    );
}
export default Menu;