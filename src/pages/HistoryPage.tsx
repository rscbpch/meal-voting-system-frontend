import { useEffect, useState } from "react";
import { getVoteHistory, type VoteHistoryResponse } from "../services/historyService";
import { getDishes, type Dish } from "../services/dishService";
import LatestVote from "../components/LatestVote";

const HistoryPage = () => {
    const [history, setHistory] = useState<VoteHistoryResponse | null>(null);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([getVoteHistory(), getDishes()])
            .then(([historyData, dishesData]) => {
                setHistory(historyData);
                setDishes(dishesData.items);
            })
            .catch ((err) => setError(err.message || "Failed to load data"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center mt-10">Loading...</div>
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>

    if (!history) {
        return <div className="text-center mt-10">No history available.</div>
    }

    const userDish = history.userVote
        ? dishes.find(dish => dish.id === history.userVote!.dishId)
        : null;

    return (
        <div>
            <h1 className="text-center font-bold text-2xl mb-6">Your Latest Vote</h1>
            {history.userVote ? (
                <LatestVote
                    key={history.userVote.id}
                    name={userDish?.name || history.userVote.Dish.name}
                    id={history.userVote.dishId}
                    description={userDish?.description || ""}
                    category={userDish?.categoryId ? Number(userDish.categoryId) : 0}
                    totalVote={0}
                    votedAt={history.voteDate}
                    imgURL={userDish?.imageURL || ""}
                />
            ) : (
                <div className="text-center text-gray-500">You have not voted yet.</div>
            )}
            <h2 className="text-xl font-semibold mt-10 mb-4 text-center">Poll Results</h2>
            {history.dishes && (
                <div>
                    {history.dishes.map(dish => (
                        <div key={dish.candidateDishId} className="mb-2 text-center">
                            <span className="font-bold">{dish.dish}</span>
                        </div>
                    ))}
                </div>
            )}
            {history.selectedDishes && (
                <div>
                    <h3>Selected Dishes</h3>
                    {history.selectedDishes.map(sel => {
                        const dish = dishes.find(d => d.id === sel.dishId);
                        return (
                            <div key={sel.dishId} className="mb-2 text-center">
                                <span className="font-bold">{dish?.name || sel.dishId}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;