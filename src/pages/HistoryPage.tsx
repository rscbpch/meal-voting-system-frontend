import { useEffect, useState } from "react";
import { getVoteHistory, type VoteHistoryResponse } from "../services/historyService";
import { getDishes, type Dish } from "../services/dishService";
import { getTodayResult, type CandidateDish } from "../services/resultService";
import LatestVote from "../components/LatestVote";
import ResultBanner from "../components/ResultBanner";
import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";
import DatePicker from "../components/DatePicker";

const HistoryPage = () => {
    const [history, setHistory] = useState<VoteHistoryResponse | null>(null);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [result, setResult] = useState<CandidateDish[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getVoteHistory(selectedDate ? selectedDate : undefined),
            getDishes(),
            getTodayResult()// You may need to create a getResultByDate service
        ])
            .then(([historyData, dishesData, resultData]) => {
                setHistory(historyData);
                setDishes(dishesData.items);
                setResult(resultData?.dishes ?? null);
            })
            .catch ((err) => setError(err.message || "Failed to load data"))
            .finally(() => setLoading(false));
    }, [selectedDate]);

    if (loading) return <div className="text-center mt-10">Loading...</div>
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>
    if (!history) return <div className="text-center mt-10">No history available.</div>

    // Find the user's voted dish info
    // const userDish = history.userVote
    //     ? dishes.find(dish => dish.id === history.userVote!.dishId)
    //     : null;

    const userDishVotes = history.dishes
        ? history.dishes.find(d => d.dishId === history.userVote?.dishId)?.voteCount ?? 1
        : 1;

    // Prepare result banner items (like in your ResultBanner)
    const resultBannerItems = result && dishes.length > 0
        ? result.map(candidate => {
            const dishInfo = dishes.find(d => d.id === candidate.dishId);
            return {
                title: dishInfo?.name || candidate.name,
                subtitle: "Selected",
                description: dishInfo?.description || candidate.description || "",
                imgSrc: dishInfo?.imageURL || candidate.imageURL || "",
                voteCount: candidate.voteCount,
            };
        })
        : [];

    return (
        <div>
            <Navbar />
            <PageTransition>
                <div></div>
            </PageTransition>
            <div className="flex justify-between">
                <h1 className="text-left text-[32px] font-bold text-2xl mb-6">History</h1>
                <button 
                    className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
                    onClick={() => setShowDatePicker(true)}
                >
                    Pick a Date
                </button>
                <DatePicker 
                    selectedDate={selectedDate}
                    onDateSelect={date => {
                        setSelectedDate(date);
                        setShowDatePicker(false);
                    }}
                    showDatePicker={showDatePicker}
                    onClose={() => setShowDatePicker(false)}
                />
                {selectedDate && (
                    <div className="mb-4 text-gray-600">
                        Showing result for: <span className="font-semibold">{new Date(selectedDate).toLocaleDateString()}</span>
                    </div>
                )}
                <h2 className="text-lg font-semibold mb-2">Your Pick:</h2>
                {history.userVote ? (
                    <LatestVote
                        key={history.userVote.id}
                        name={history.userVote.Dish.name}
                        id={history.userVote.dishId}
                        description={history.userVote.Dish.description || ""}
                        categoryId={history.userVote.Dish.categoryId ?? 0}
                        totalVote={userDishVotes}
                        votedAt={history.voteDate}
                        imgURL={history.userVote.Dish.imageURL || ""}
                    />
                ) : (
                    <div className="text-center text-gray-500">You have not voted yet.</div>
                )}

                <h2 className="text-xl font-semibold mt-10 mb-4 text-center">Result</h2>
                {resultBannerItems.length > 0 ? (
                    <ResultBanner items={resultBannerItems} />
                ) : (
                    <div className="text-center text-gray-500">Result not available yet.</div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;