// import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Footer from "../components/Footer";
import ResultBanner from "../components/ResultBanner";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getDishes } from "../services/dishService";
import type { Dish } from "../services/dishService";
import { getTodayResult, type CandidateDish } from "../services/resultService";
import { getUpcomingResults, type UpcomingResult } from "../services/resultService";

const Menu = () => {
    const [foods, setFoods] = useState<Dish[]>([]);
    const [candidate, setCandidate] = useState<CandidateDish[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [votedCardId, setVotedCardId] = useState<number | null>(null);
    const [upcomingResults, setUpcomingResults] = useState<UpcomingResult[]>([]);

    useEffect(() => {
        getDishes()
            .then((res) => setFoods(res.items))
            .catch(() => setError("Failed to fetch dishes"));

        getTodayResult() 
            .then((res) => {
                setCandidate(res.dishes);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to fetch today's result");
                setLoading(false);
            });

        getUpcomingResults()
            .then((res) => setUpcomingResults(res))
            .catch(() => setError("Failed to fetch upcoming results"));
    }, []);

    const upcomingBannerItems =
        upcomingResults.length > 0 && upcomingResults[0].dishes
            ? upcomingResults[0].dishes.map(candidate => {
                const dishInfo = foods.find(dish => dish.id === candidate.dishId);
                return {
                    title: candidate.dish,
                    subtitle: `Upcoming`,
                    description: dishInfo?.description ?? "",
                    imgSrc: dishInfo?.imageURL ?? "",
                };
            })
            : [];

    const handleVote = (id: number) => {
        if (votedCardId === null) {
            setVotedCardId(id);
        }
    };

    // Show only today's candidate dishes in the menu
    const candidateCards = candidate.map(candidate => {
        const dishInfo = foods.find(dish => dish.id === candidate.dishId);
        return {
            key: candidate.candidateDishId,
            name: candidate.dish,
            categoryId: Number(dishInfo?.categoryId) ?? 0,
            description: dishInfo?.description ?? "",
            imgURL: dishInfo?.imageURL ?? "",
            initialVotes: candidate.voteCount,
            disabled: votedCardId != null,
            onVote: () => handleVote(candidate.candidateDishId),
        };
    });

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
                    {!loading && !error && candidateCards.map(cardProps => (
                        <Card {...cardProps} />
                    ))}
                </div>
                <Footer/>
            </div>
        </div>
    );
};

export default Menu;