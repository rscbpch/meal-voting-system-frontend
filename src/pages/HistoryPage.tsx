import { useEffect, useState } from "react";
import { getVoteHistory, type VoteHistoryResponse } from "../services/historyService";
import LatestVote from "../components/LatestVote";
import ResultCard from "../components/ResultCard";
import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";
import DatePicker from "../components/DatePicker";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

const HistoryPage = () => {
    const [history, setHistory] = useState<VoteHistoryResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        setError(null);
        setLoading(true);
        getVoteHistory(selectedDate ? selectedDate : undefined)
            .then((historyData) => {
                setHistory(historyData);
            })
            .catch((err) => setError(err.message || "Failed to load data"))
            .finally(() => setLoading(false));
    }, [selectedDate]);

    return (
        <div>
            <Navbar />
            <PageTransition>
                <main className="min-h-screen mx-auto pt-10 pb-16 px-4 sm:px-6 lg:px-14 bg-[#F6FFE8]">
                    <div>
                        {loading ? (
                            <div className="flex justify-center items-center min-h-[300px] w-full">
                                <Loading />
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-500 mt-10">{error}</div>
                        ) : !history ? (
                            <div className="text-center mt-10">No history available.</div>
                        ) : (
                            <>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 mb-6">
                                    <h1 className="text-[20px] sm:text-[24px] lg:text-[32px] font-bold mb-4 sm:mb-0">History</h1>
                                    <div className="relative inline-block">
                                        <button
                                            className="px-4 py-2 bg-[#FFFEFE] text-[#3A4038] shadow-md rounded text-sm sm:text-base"
                                            onClick={() => setShowDatePicker(true)}
                                        >
                                            Pick a Date
                                        </button>
                                        {showDatePicker && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setShowDatePicker(false)}
                                                    aria-label="Close date picker"
                                                />
                                                <div className="absolute z-50 -left-31 mt-2">
                                                    <DatePicker
                                                        selectedDate={selectedDate}
                                                        onDateSelect={date => {
                                                            setSelectedDate(date);
                                                            setShowDatePicker(false);
                                                        }}
                                                        showDatePicker={showDatePicker}
                                                        onClose={() => setShowDatePicker(false)}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Your Pick */}
                                <div className="mb-8">
                                    <div className="text-[18px] sm:text-[20px] lg:text-[24px] font-bold mb-8 sm:mb-12 lg:mb-16">
                                        <p>
                                            Your <span className="text-[#429818]">Pick</span>
                                        </p>
                                    </div>
                                    {history.userVote ? (
                                        <LatestVote
                                            key={history.userVote.id}
                                            name={history.userVote.Dish.name}
                                            id={history.userVote.dishId}
                                            description={history.userVote.Dish.description || ""}
                                            totalVote={
                                                history.dishes?.find(d => d.dishId === history.userVote?.dishId)?.voteCount ?? 1
                                            }
                                            votedAt={history.userVote.updatedAt || history.userVote.createdAt}
                                            imgURL={history.userVote.Dish.imageURL || ""}
                                        />
                                    ) : (
                                        <div className="text-center text-gray-500">You have not voted yet.</div>
                                    )}
                                </div>

                                {/* Result Section */}
                                <div className="mt-6">
                                    <div className="my-4">
                                        <h2 className="text-[18px] sm:text-[20px] lg:text-[24px] font-bold">
                                            Result
                                        </h2>
                                        {history.mealDate && (
                                            <p className="text-gray-600 text-sm mb-2">
                                                {new Date(history.mealDate).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        )}
                                    </div>
                                    
                                    {/* Display results based on poll status */}
                                    {history.selectedDishes && history.selectedDishes.length > 0 ? (
                                        // Finalized poll - show selected dishes
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                            {history.selectedDishes.map(dish => (
                                                <ResultCard
                                                    key={dish.dishId}
                                                    name={dish.Dish?.name}
                                                    description={dish.Dish?.description || "No description available."}
                                                    imgURL={dish.Dish?.imageURL || ""}
                                                    votes={0} // Selected dishes don't have vote counts in finalized polls
                                                />
                                            ))}
                                        </div>
                                    ) : history.dishes && history.dishes.length > 0 ? (
                                        // Open/close poll - show top 5 dishes with vote counts
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                            {history.dishes.slice(0, 5).map(dish => (
                                                <ResultCard
                                                    key={dish.dishId}
                                                    name={dish.dish}
                                                    description="No description available."
                                                    imgURL=""
                                                    votes={dish.voteCount}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        // Pending poll - no results yet
                                        <div className="text-center text-gray-500 text-[14px] lg:text-base">
                                            Vote poll is pending. Results will be available once voting begins.
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </PageTransition>
            <Footer />
        </div>
    );
};

export default HistoryPage;