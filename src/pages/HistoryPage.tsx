import { useEffect, useState } from "react";
import { getVoteHistory, type VoteHistoryResponse } from "../services/historyService";
import LatestVote from "../components/LatestVote";
import ResultCard from "../components/ResultCard";
import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";
import DatePicker from "../components/DatePicker";
import Footer from "../components/Footer";
import { getUpcomingResults, type UpcomingResult } from "../services/resultService";
import Loading from "../components/Loading";

const HistoryPage = () => {
    const [history, setHistory] = useState<VoteHistoryResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [upcomingResults, setUpcomingResults] = useState<UpcomingResult | null>(null);

    useEffect(() => {
        setError(null);
        setLoading(true);
        Promise.all([
            getVoteHistory(selectedDate ? selectedDate : undefined),
            getUpcomingResults(),
        ])
            .then(([historyData, upcomingData]) => {
                setHistory(historyData);
                setUpcomingResults(upcomingData);
            })
            .catch ((err) => setError(err.message || "Failed to load data"))
            .finally(() => setLoading(false));
    }, [selectedDate]);

    return (
        <div>
            <Navbar />
            <div className="p-4 min-h-[60vh]">
                {loading ? (
                    <div className="flex justify-center items-center min-h-[300px] w-full">
                        <Loading />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 mt-10">{error}</div>
                ) : !history ? (
                    <div className="text-center mt-10">No history available.</div>
                ) : (
                    <PageTransition>
                        <div className="flex justify-between pt-4">
                            <h1 className="text-left text-[32px] font-bold text-2xl mb-6">History</h1>
                            <div className="relative inline-block">
                                <button
                                    className="mb-4 px-4 py-2 bg-[#FFFEFE] text-[#3A4038] shadow-md rounded"
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
                        <div>
                            <div className="text-[24px] font-bold mb-16">
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
                        <div>
                            <h2 className="text-xl font-semibold mt-10 mb-16 text-left text-[32px]">
                                Result
                            </h2>
                            {upcomingResults && Array.isArray(upcomingResults.dish) && upcomingResults.dish.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {upcomingResults.dish.map(dish => (
                                        <ResultCard
                                            key={dish.dishId}
                                            name={dish.Dish?.name}
                                            description={dish.Dish?.description || "No description available."}
                                            imgURL={dish.Dish?.imageURL || ""}
                                            votes={dish.voteCount}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 text-[14px] lg:text-base">
                                    Result hasn't been finalized yet.
                                </div>
                            )}
                        </div>
                    </PageTransition>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default HistoryPage;