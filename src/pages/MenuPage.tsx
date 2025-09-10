// import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Footer from "../components/Footer";
import ResultBanner from "../components/ResultBanner";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getDishes } from "../services/dishService";
import type { Dish } from "../services/dishService";
import { getTodayResult, voteForDish, updateVoteForDish, type CandidateDish } from "../services/resultService";
import { getUpcomingResults, type UpcomingResult } from "../services/resultService";
import { useMemo } from "react";

const Menu = () => {
    const [foods, setFoods] = useState<Dish[]>([]);
    const [candidate, setCandidate] = useState<CandidateDish[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [upcomingResults, setUpcomingResults] = useState<UpcomingResult[]>([]);
    const [todayError, setTodayError] = useState<string | null>(null);
    const [upcomingError, setUpcomingError] = useState<string | null>(null);
    const [votePollId, setVotePollId] = useState<number | null>(null);
    const [votedDishId, setVotedDishId] = useState<number | null>((null));
    // const [votedDishId, setVotedDishId] = useState<number | null>(null);
    useEffect(() => {
        // if (votedDishId !== null) {
        //     localStorage.setItem("votedDishId", String(votedDishId));
        // } else {
        //     localStorage.removeItem("votedDishId");
        // }
        getDishes()
            .then((res) => setFoods(res.items))
            .catch(() => setError("Failed to fetch dishes"));

        getTodayResult() 
            .then((res) => {
                setCandidate(res.dishes);
                setVotePollId(res.votePollId);

                const storedPollId = localStorage.getItem("votePollId");
                const storedDishId = localStorage.getItem("votedDishId");
                if (storedPollId && storedDishId && Number(storedPollId) === res.votePollId && storedDishId) {
                    setVotedDishId(Number(storedDishId));
                } else {
                    setVotedDishId(null);
                    localStorage.removeItem("votedDishId");
                    localStorage.setItem("votePollId", String(res.votePollId));
                }
                setLoading(false);
            })
            .catch(() => {
                setTodayError("Failed to fetch today's result");
                setLoading(false);
            });

        getUpcomingResults()
            .then((res: any) => {
                // backend may return an array or a single object. Normalize to an array of results.
                console.log("getUpcomingResults raw:", res);

                // prefer direct arrays
                if (Array.isArray(res)) {
                    setUpcomingResults(res);
                    return;
                }

                // response might be wrapped: { data: [...]} or { items: [...] }
                const wrapper = res?.data ?? res?.items ?? res?.upcoming ?? res?.results ?? res;

                if (!wrapper) {
                    setUpcomingResults([]);
                    return;
                }

                if (Array.isArray(wrapper)) {
                    setUpcomingResults(wrapper);
                } else if (typeof wrapper === 'object') {
                    // single result object -> wrap into array
                    setUpcomingResults([wrapper]);
                } else {
                    setUpcomingResults([]);
                }
            })
            .catch(() => setUpcomingError("Failed to fetch upcoming results"));
    }, [votedDishId]);

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
        try {
            if (votedDishId === null) {
                await voteForDish(dishId);
        } else {
                await updateVoteForDish(dishId);
            }
            setVotedDishId(dishId);
            const res = await getTodayResult();
            setCandidate(res.dishes);
            
            localStorage.setItem("votedDishId", String(dishId));
            if (votePollId !== null) {
                localStorage.setItem("votePollId", String(votePollId));
            }
    } catch (error: any) {
        if (
            error?.response?.data?.message &&
            error.response.data.message.includes("No existing vote found")
        ) {
            setVotedDishId(null);
            localStorage.removeItem("votedDishId");
            try {
                await voteForDish(dishId);
                setVotedDishId(dishId);
                const res = await getTodayResult();
                setCandidate(res.dishes);
                localStorage.setItem("votedDishId", String(dishId));
                if (votePollId !== null) {
                    localStorage.setItem("votePollId", String(votePollId));
                }
                alert("Your vote has been reset. Please vote again.");
            } catch (err: any) {
                alert(err?.response?.data?.message || "Failed to vote for dish");
            }
        } else {
            alert(error?.response?.data?.message || "Failed to vote for dish");
        }
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
                <div>
                    {(error || todayError || upcomingError) && (
                        <div className="flex justify-center items-center w-full my-8">
                            {error && <div className="text-red-500">{error}</div>}
                            {todayError && <div className="text-red-500">{todayError}</div>}
                            {upcomingError && <div className="text-red-500">{upcomingError}</div>}
                        </div>
                    )}
                    <div className="grid grid-cols-4 gap-x-6 gap-y-30 mb-10 p-10">
                        {loading && <div>Loading...</div>}
                        {!loading && !error && candidate.map(candidate => {
                            // const dishInfo = foods.find(dish => dish.id === candidate.dishId);
                            return (

                                // <Card
                                //     key={candidate.candidateDishId}
                                //     name={candidate.dish}
                                //     categoryId={Number(dishInfo?.categoryId) ?? 0}
                                //     description={dishInfo?.description ?? ""}
                                //     imgURL={dishInfo?.imageURL ?? ""}
                                //     initialVotes={candidate.voteCount}
                                //     disabled={votedCardId !== null && votedCardId !== candidate.candidateDishId}
                                //     onVote={() => handleVote(candidate.candidateDishId)}
                                //     onCancelVote={() => setVotedCardId(null)}
                                // />
                                <Card 
                                    key={candidate.dishId}
                                    name={candidate.name}
                                    categoryId={Number(candidate.categoryId) ?? 0}
                                    description={candidate.description ?? ""}
                                    imgURL={candidate.imageURL ?? ""}
                                    initialVotes={candidate.voteCount}
                                    hasVoted={votedDishId === candidate.dishId}
                                    disabled={false}
                                    onVote={() => handleVote(candidate.dishId)}
                                    // onCancelVote={() => handleCancelVote(candidate.dishId)}
                                />
                            );
                        })}
                    </div>
                </div>
                <Footer/>
            </div>
        </div>
        );
    };

export default Menu;