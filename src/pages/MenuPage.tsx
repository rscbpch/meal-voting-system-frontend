import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Footer from "../components/Footer";
import ResultBanner from "../components/ResultBanner";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getDishes } from "../services/dishService";
import type { Dish } from "../services/dishService";
import { getTodayResult, voteForDish, updateVoteForDish, type CandidateDish, getTodayVote } from "../services/resultService";
import { getUpcomingResults, type UpcomingResult } from "../services/resultService";
import { useMemo } from "react";

const Menu = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [foods, setFoods] = useState<Dish[]>([]);
    const [candidate, setCandidate] = useState<CandidateDish[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [upcomingResults, setUpcomingResults] = useState<UpcomingResult[]>([]);
    const [todayError, setTodayError] = useState<string | null>(null);
    const [upcomingError, setUpcomingError] = useState<string | null>(null);
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

        getDishes()
            .then((res) => setFoods(res.items))
            .catch(() => setError("Failed to fetch dishes"));

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

        getUpcomingResults()
            .then((res: any) => {
                if (Array.isArray(res)) {
                    setUpcomingResults(res);
                    return;
                }
                const wrapper = res?.data ?? res?.items ?? res?.upcoming ?? res?.results ?? res;
                if (!wrapper) return setUpcomingResults([]);
                if (Array.isArray(wrapper)) setUpcomingResults(wrapper);
                else if (typeof wrapper === "object") setUpcomingResults([wrapper]);
                else setUpcomingResults([]);
            })
            .catch(() => setUpcomingError("Failed to fetch upcoming results"));
    }, []); 
    // useEffect(() => {
    //     if (votedDishId !== null) {
    //         localStorage.setItem("votedDishId", String(votedDishId));
    //     } else {
    //         localStorage.removeItem("votedDishId");
    //     }
    // }, [votedDishId]);

    const upcomingBannerItems = useMemo(() => {
        if (!upcomingResults || upcomingResults.length === 0) return [];
        if (!foods || foods.length === 0) return [];
        const first = upcomingResults[0] as any;
        const candidates: any[] = first?.dish ?? first?.dishes ?? first?.items ?? first?.data ?? [];
        if (!Array.isArray(candidates) || candidates.length === 0) return [];
        const selected = candidates.filter((c: any) => c.isSelected === true);
        if (!selected || selected.length === 0) return [];

    return selected.map((candidate: any) => {
            // candidate may be shape: { id, votePollId, dishId, isSelected, Dish: { id, name }, voteCount? }
            const dishId = candidate.dishId ?? candidate.Dish?.id ?? candidate.dish?.id ?? null;
            const dishName = candidate.Dish?.name ?? candidate.dish ?? candidate.name ?? "";
            const dishInfo = foods.find((dish) => dish.id == dishId) as any;
            const voteCount = candidate.voteCount ?? candidate.votes ?? 0;
            return {
                title: dishName,
                subtitle: `Selected`,
                description: dishInfo?.description ?? "",
                imgSrc: dishInfo?.imageURL ?? dishInfo?.imageUrl ?? candidate.Dish?.imageURL ?? "",
                voteCount: voteCount,
            };
        });
    },[upcomingResults, foods]);

    const handleVote = async (dishId: number) => {
        if (!isLoggedIn) {
            navigate('/sign-in');
            return;
        }

        const vote = await getTodayVote();
        const currentUserId = vote?.userVote?.userId;
        const votedUserId = localStorage.getItem("votedUserId");
        console.log("vote:", vote, "currentUserId:", currentUserId, "votedUserId:", votedUserId);

        if (
            votedUserId &&
            String(currentUserId) !== votedUserId
        ) {
            alert("You have already voted today.");
            return;
        }
        try {
            if (votedDishId === null) {
                await voteForDish(dishId);
                if (!votedUserId && currentUserId) {
                    localStorage.setItem("votedUserId", String(currentUserId));
                }
            } else {
                await updateVoteForDish(dishId);
            }
            if (currentUserId) {
                localStorage.setItem("votedUserId", String(currentUserId));
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
            <div>
                <div className="mb-20">
                    <Navbar/>
                </div>
                <div>
                    {/* Show upcoming result in the banner */}
                    <ResultBanner items={upcomingBannerItems} />
                </div>
                <div>
                    <h1 className="text-[48px] font-bold p-5 mb-10 ml-5">Menu</h1>
                </div>
                    <div className="grid grid-cols-4 gap-x-6 gap-y-30 mb-10 p-10">
                        {loading && <div>Loading...</div>}
                        {!loading && !error && candidate.map(candidate => (
                            <Card 
                                key={candidate.dishId}
                                name={candidate.name}
                                categoryId={Number(candidate.categoryId) ?? 0}
                                description={candidate.description ?? ""}
                                imgURL={candidate.imageURL ?? ""}
                                initialVotes={candidate.voteCount}  
                                hasVoted={Number(votedDishId) === Number(candidate.dishId)}
                                disabled={
                                    !!localStorage.getItem("votedUserId") &&
                                    String(localStorage.getItem("votedUserId")) !== String(todayVote?.userVote?.userId)
                                } // show button for everyone
                                onVote={() => {
                                    if (!isLoggedIn) {
                                        navigate("/sign-in");
                                        return;
                                    }
                                    handleVote(candidate.dishId);
                                }}
                            />
                        ))}
                    </div>
                <div>
                    {(error || todayError || upcomingError) && (
                        <div className="flex justify-center items-center w-full my-8">
                            {error && <div className="text-red-500">{error}</div>}
                            {todayError && <div className="text-red-500">{todayError}</div>}
                            {upcomingError && <div className="text-red-500">{upcomingError}</div>}
                        </div>
                    )}

                    {/* Only show menu and voting if logged in */}
                    {/* {isLoggedIn && (
                        <>
                            <div>
                                <h1 className="text-[48px] font-bold p-5 mb-10 ml-5">Menu</h1>
                            </div>
                            <div className="grid grid-cols-4 gap-x-6 gap-y-30 mb-10 p-10">
                                {loading && <div>Loading...</div>}
                                {!loading && !error && candidate.map(candidate => (
                                    <Card 
                                        key={candidate.dishId}
                                        name={candidate.name}
                                        categoryId={Number(candidate.categoryId) ?? 0}
                                        description={candidate.description ?? ""}
                                        imgURL={candidate.imageURL ?? ""}
                                        initialVotes={candidate.voteCount}
                                        hasVoted={votedDishId === candidate.dishId}
                                        disabled={!isLoggedIn}
                                        onVote={() => handleVote(candidate.dishId)}
                                    />
                                ))}
                            </div>
                        </>
                    )} */}
                </div>
                <Footer/>
            </div>
        </div>
    );
}
export default Menu;