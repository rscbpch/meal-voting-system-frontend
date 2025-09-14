import { useNavigate } from "react-router-dom";
import FoodCard from "../components/CardV2";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { getTodayResult, voteForDish, updateVoteForDish, type CandidateDish, getTodayVote } from "../services/resultService";
import PageTransition from "../components/PageTransition";

const Menu = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    // const [foods, setFoods] = useState<Dish[]>([]);
    const [candidate, setCandidate] = useState<CandidateDish[]>([]);
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
        // const token = localStorage.getItem("token");
        // setIsLoggedIn(!!token);
        setVotedDishId(null);
        setIsLoggedIn(!!localStorage.getItem("token"));
        setLoading(true);

        // getDishes()
        //     .then((res) => setFoods(res.items))
        //     .catch(() => setError("Failed to fetch dishes"));

        getTodayResult()
            .then((res) => {
                setCandidate(res.dishes);
                // setVotePollId(res.votePollId);

                getTodayVote().then((vote) => {
                    setTodayVote(vote);
                    if (vote && vote.votePollId === res.votePollId && vote.userVote) {
                        setVotedDishId(vote.userVote.dishId);
                        // localStorage.setItem("votedDishId", String(vote.userVote.dishId));
                        // localStorage.setItem("votePollId", String(vote.userVote.votePollId));
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

        // getUpcomingResults()
        //     .then((res: any) => {
        //         if (Array.isArray(res)) {
        //             setUpcomingResults(res);
        //             return;
        //         }
        //         const wrapper = res?.data ?? res?.items ?? res?.upcoming ?? res?.results ?? res;
        //         if (!wrapper) return setUpcomingResults([]);
        //         if (Array.isArray(wrapper)) setUpcomingResults(wrapper);
        //         else if (typeof wrapper === "object") setUpcomingResults([wrapper]);
        //         else setUpcomingResults([]);
        //     })
        //     .catch(() => setUpcomingError("Failed to fetch upcoming results"));
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
            setCandidate(todayResult.dishes);
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
                        <div className="grid grid-cols-4 gap-x-6 gap-y-30 mb-10 p-10">
                            {loading && (
                                <div className="flex justify-center items-center w-full col-span-4 py-10">
                                    <Loading />
                                </div>
                            )}
                            {!loading && candidate.map(candidate => {
                                const user = JSON.parse(localStorage.getItem("user") || "{}");
                                const currentUserId = user.id;
                                const votedUserId = localStorage.getItem("votedUserId");
                                // Disable voting if device has voted with a different user
                                const votingDisabled = !!votedUserId && votedUserId !== currentUserId;

                                return (
                                    <FoodCard
                                        key={candidate.dishId}
                                        name={candidate.name}
                                        dishId={candidate.dishId}
                                        categoryName={candidate.categoryName ?? ""}
                                        description={candidate.description ?? ""}
                                        imgURL={candidate.imageURL ?? ""}
                                        initialVotes={candidate.voteCount}
                                        disabled={votingDisabled}
                                        isVote={true}
                                        onVote={() => {
                                            if (!isLoggedIn) {
                                                navigate("/sign-in");
                                                return;
                                            }
                                            handleVote(candidate.dishId);
                                        }}
                                        currentVoteCount={candidate.voteCount}
                                    />
                                );
                            })}
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
        </div>
    );
}
export default Menu;