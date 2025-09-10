// import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Footer from "../components/Footer";
import ResultBanner from "../components/ResultBanner";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getDishes } from "../services/dishService";
import type { Dish } from "../services/dishService";
import { getTodayResult, voteForDish, cancelVote, type CandidateDish } from "../services/resultService";
import { getUpcomingResults, type UpcomingResult } from "../services/resultService";

const Menu = () => {
    const [foods, setFoods] = useState<Dish[]>([]);
    const [candidate, setCandidate] = useState<CandidateDish[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [upcomingResults, setUpcomingResults] = useState<UpcomingResult[]>([]);
    const [todayError, setTodayError] = useState<string | null>(null);
    const [upcomingError, setUpcomingError] = useState<string | null>(null);
    const [votedCardId, setVotedCardId] = useState<number | null>(() => {
        const stored = localStorage.getItem("votedCardId");
        return stored ? Number(stored) : null;
    });
    useEffect(() => {
        if (votedCardId !== null) {
            localStorage.setItem("votedCardId", String(votedCardId));
        } else {
            localStorage.removeItem("votedCardId");
        }
        getDishes()
            .then((res) => setFoods(res.items))
            .catch(() => setError("Failed to fetch dishes"));

        getTodayResult() 
            .then((res) => {
                setCandidate(res.dishes);
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
    }, [votedCardId]);

    const upcomingBannerItems = (() => {
        if (!upcomingResults || upcomingResults.length === 0) return [];
        const first = upcomingResults[0] as any;
        // swagger shows `dish` array where each item has Dish { id, name }
        const candidates: any[] = first?.dish ?? first?.dishes ?? first?.items ?? first?.data ?? [];
        if (!Array.isArray(candidates) || candidates.length === 0) return [];
        // prefer selected dishes (isSelected === true). If none are selected, show nothing.
        const selected = candidates.filter((c: any) => c.isSelected === true);
        if (!selected || selected.length === 0) return [];

    return selected.map((candidate: any) => {
            // candidate may be shape: { id, votePollId, dishId, isSelected, Dish: { id, name }, voteCount? }
            const dishId = candidate.dishId ?? candidate.Dish?.id ?? candidate.dish?.id ?? null;
            const dishName = candidate.Dish?.name ?? candidate.dish ?? candidate.name ?? "";
            const dishInfo = foods.find((dish) => dish.id === dishId) as any;
            const voteCount = candidate.voteCount ?? candidate.votes ?? 0;
            return {
                title: dishName,
                subtitle: `Selected`,
                description: dishInfo?.description ?? "",
                imgSrc: dishInfo?.imageURL ?? dishInfo?.imageUrl ?? "",
                voteCount: voteCount,
            };
    });
    })();

    const handleVote = async (dishId: number) => {
        if (votedCardId !== null) return; 
            try {
                console.log("Voting for dish:", dishId);
                await voteForDish(dishId);
                setCandidate(prev => 
                    prev.map(c => {
                        const id = (c as any).candidateDishId ?? c.dishId;
                        if (id === dishId) return { ...c, voteCount: (c.voteCount ?? 0) + 1};
                        return c;
                    })
                );
                setVotedCardId(dishId);
            } catch (error) {
                console.error("Failed to vote for dish:", error);
            }
    };
    const handleCancelVote = async (dishId: number) => {
        try {
        await cancelVote(dishId);
        setCandidate(prev =>
            prev.map(c => {
            const id = (c as any).candidateDishId ?? c.dishId;
            if (id === dishId) return { ...c, voteCount: Math.max(0, (c.voteCount ?? 1) - 1) };
            return c;
            })
        );
        setVotedCardId(null);
        } catch (err) {
        console.error("cancel vote failed", err);
        }
    };

    // Show only today's candidate dishes in the menu
    // const candidateCards = candidate.map(candidate => {
    //     const dishInfo = foods.find(dish => dish.id === candidate.dishId);
    //     return {
    //         key: candidate.candidateDishId,
    //         name: candidate.dish,
    //         categoryId: Number(dishInfo?.categoryId) ?? 0,
    //         description: dishInfo?.description ?? "",
    //         imgURL: dishInfo?.imageURL ?? "",
    //         initialVotes: candidate.voteCount,
    //         disabled: votedCardId != null,
    //         onVote: () => handleVote(candidate.candidateDishId),
    //     };
    // });

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
                    {error && <div className="text-red-500">{error}</div>}
                    {todayError && <div className="text-red-500">{todayError}</div>}
                    {upcomingError && <div className="text-red-500">{upcomingError}</div>}
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
                                disabled={votedCardId !== null && votedCardId !== candidate.dishId}
                                onVote={() => handleVote(candidate.dishId)}
                                onCancelVote={() => handleCancelVote(candidate.dishId)}
                            />
                        );
                    })}
                </div>
                <Footer/>
            </div>
        </div>
    );
};

export default Menu;