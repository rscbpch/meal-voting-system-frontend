import { useEffect, useState } from "react";
import { getVoteHistory, type VoteHistoryResponse } from "../services/historyService";
// import { getDishes, type Dish } from "../services/dishService";
// import { getTodayResult, type CandidateDish } from "../services/resultService";
import LatestVote from "../components/LatestVote";
import ResultCard from "../components/ResultCard";
import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";
import DatePicker from "../components/DatePicker";
import Footer from "../components/Footer";
import { getUpcomingResults, type UpcomingResult } from "../services/resultService";


// const mockHistory = {
//     votePollId: 1,
//     mealDate: "2025-09-15T00:00:00.000Z",
//     voteDate: "2025-09-14T00:00:00.000Z",
//     userVote: {
//         id: 101,
//         dishId: 63,
//         Dish: {
//             id: 63,
//             name: "Steam Fish with Egg and Pork",
//             description: "Steam prama fish with egg and pork",
//             imageURL: "https://pub-26c75c3ff0b349439d5f6ea652b128d8.r2.dev/dishes/1757594741548_cm85dn4bn000003l64ibfew28.jpg",
//             categoryId: 5,
//         }
//     },
//     dishes: [
//         { candidateDishId: 1, dishId: 63, dish: "Steam Fish with Egg and Pork", voteCount: 5 },
//         { candidateDishId: 2, dishId: 54, dish: "Pork Leg and Winter Melon Soup", voteCount: 2 },
//     ]
// };

// const mockDishes = [
//     {
//         id: 63,
//         name: "Steam Fish with Egg and Pork",
//         description: "Steam prama fish with egg and pork",
//         imageURL: "https://pub-26c75c3ff0b349439d5f6ea652b128d8.r2.dev/dishes/1757594741548_cm85dn4bn000003l64ibfew28.jpg",
//         categoryId: 5,
//     },
//     {
//         id: 54,
//         name: "Pork Leg and Winter Melon Soup",
//         description: "Simmering pork leg until it becomes tender",
//         imageURL: "https://pub-26c75c3ff0b349439d5f6ea652b128d8.r2.dev/dishes/1757402359576_leg.png",
//         categoryId: 1,
//     }
// ];

// const mockResult = [
//     {
//         dish: "Steam Fish with Egg and Pork",
//         candidateDishId: 1,
//         dishId: 63,
//         name: "Steam Fish with Egg and Pork",
//         description: "Steam prama fish with egg and pork",
//         imageURL: "https://pub-26c75c3ff0b349439d5f6ea652b128d8.r2.dev/dishes/1757594741548_cm85dn4bn000003l64ibfew28.jpg",
//         categoryId: 5,
//         voteCount: 5,
//     },
//     {
//         dish: "Steam Fish with Egg and Pork",
//         candidateDishId: 1,
//         dishId: 63,
//         name: "Steam Fish with Egg and Pork",
//         description: "Steam prama fish with egg and pork",
//         imageURL: "https://pub-26c75c3ff0b349439d5f6ea652b128d8.r2.dev/dishes/1757594741548_cm85dn4bn000003l64ibfew28.jpg",
//         categoryId: 5,
//         voteCount: 5,
//     },
//     {
//         dish: "Steam Fish with Egg and Pork",
//         candidateDishId: 1,
//         dishId: 63,
//         name: "Steam Fish with Egg and Pork Steam prama fish with egg and pork",
//         description: "Steam prama fish with egg and pork.Steam prama fish with egg and pork.Steam prama fish with egg and pork.Steam prama fish with egg and pork.Steam prama fish with egg and pork.Steam prama fish with egg and pork",
//         imageURL: "https://pub-26c75c3ff0b349439d5f6ea652b128d8.r2.dev/dishes/1757594741548_cm85dn4bn000003l64ibfew28.jpg",
//         categoryId: 5,
//         voteCount: 5,
//     },
// ];

const HistoryPage = () => {
    const [history, setHistory] = useState<VoteHistoryResponse | null>(null);
    // const [dishes, setDishes] = useState<Dish[]>([]);
    // const [result, setResult] = useState<CandidateDish[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [upcomingResults, setUpcomingResults] = useState<UpcomingResult | null>(null);

    useEffect(() => {
        // setHistory(mockHistory);
        // setDishes(mockDishes);
        // setResult(mockResult);
        // setLoading(false);
        // Uncomment below to fetch real data
        setError(null);
        setLoading(true);
        Promise.all([
            getVoteHistory(selectedDate ? selectedDate : undefined),
            // getDishes(),
            // getTodayResult(),
            getUpcomingResults(),
        ])
            .then(([historyData, upcomingData]) => {
                setHistory(historyData);
                // setDishes(dishesData.items);
                // setResult(resultData?.dishes ?? null);
                setUpcomingResults(upcomingData);
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
    return (
        <div className="">
            <Navbar />
            <div className="p-4">
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
                        {/* <DatePicker 
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
                        )} */}
                    </div>
                    <div>
                        <div className="text-[24px] font-bold mb-16">
                            <p>Your <span className="text-[#429818]">Pick</span></p>
                        </div>
                        {history.userVote ? (
                            <LatestVote
                                key={history.userVote.id}
                                name={history.userVote.Dish.name}
                                id={history.userVote.dishId}
                                description={history.userVote.Dish.description || ""}
                                totalVote={userDishVotes}
                                votedAt={history.userVote.updatedAt || history.userVote.createdAt}
                                imgURL={history.userVote.Dish.imageURL || ""}
                            />
                        ) : (
                            <div className="text-center text-gray-500">You have not voted yet.</div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mt-10 mb-16 text-left text-[32px]">Result</h2>
                        {upcomingResults && Array.isArray(upcomingResults.dish) && upcomingResults.dish.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {upcomingResults.dish.map((dish) =>
                                    <ResultCard
                                        key={dish.dishId}
                                        name={dish.Dish?.name}
                                        description={dish.Dish?.description || "No description available."}
                                        imgURL={dish.Dish?.imageURL || ""}
                                        votes={dish.voteCount}
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 text-[14px] lg:text-base">
                                Result hasn't been finalized yet.
                            </div>
                        )}
                    </div>
                </PageTransition>
            </div>
            <Footer/>
        </div>    
        );
    };

export default HistoryPage;