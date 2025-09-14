import React, { useEffect, useState } from "react";
import { getTodayPoll } from "../services/staffBoardVotepollService";
import { finalizeVotePoll, getUpcomingResults, type UpcomingResultsResponse } from "../services/votePollService";
import CustomAlert from "./CustomAlert";

interface FoodRow {
    dishId: number | string;
    name: string;
    votes: number;
}

interface Props {
    items?: FoodRow[];
    title?: string;
}


const AllFoodsRank: React.FC<Props> = ({ items, title = "All Foods" }) => {
    const [data, setData] = useState<FoodRow[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<{ [dishId: string]: boolean }>({});
    const [finalized, setFinalized] = useState<boolean>(false);
    const [pollId, setPollId] = useState<number | string | null>(null);
    const [isVotingOpen, setIsVotingOpen] = useState<boolean>(true); // Track if voting is still open
    const [mealDate, setMealDate] = useState<string>("");
    const [upcomingResults, setUpcomingResults] = useState<UpcomingResultsResponse | null>(null);
    const [popup, setPopup] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'success' | 'error' | 'warning' | 'info';
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    });

    // Function to clear poll state
    const clearPollState = () => {
        localStorage.removeItem("poll_finalized");
        localStorage.removeItem("selected_dishes");
        localStorage.removeItem("current_poll_id");
        setFinalized(false);
        setIsVotingOpen(true);
        setSelected({});
        setUpcomingResults(null);
        console.log('Poll state cleared');
    };

    // Expose clear function to window for debugging
    React.useEffect(() => {
        (window as any).clearPollState = clearPollState;
        return () => {
            delete (window as any).clearPollState;
        };
    }, []);

    // Function to fetch upcoming results
    const fetchUpcomingResults = async () => {
        try {
            const results = await getUpcomingResults();
            setUpcomingResults(results);
            
            // Convert upcoming results to FoodRow format
            const rows: FoodRow[] = results.dish.map((d) => ({
                dishId: d.Dish.id,
                name: d.Dish.name || d.Dish.name_kh || `Dish ${d.Dish.id}`,
                votes: 0, // Finalized dishes don't have vote counts
            }));
            
            setData(rows);
            setFinalized(true);
            setIsVotingOpen(false);
            
            // Update localStorage with current poll ID
            localStorage.setItem("current_poll_id", results.votePollId.toString());
            localStorage.setItem("poll_finalized", "true");
            
            // Set selected dishes based on what was actually finalized
            const selectedMap: { [dishId: string]: boolean } = {};
            results.dish.forEach((d) => {
                if (d.isSelected) {
                    selectedMap[d.Dish.id.toString()] = true;
                }
            });
            setSelected(selectedMap);
            
            // Set meal date from results
            if (results.mealDate) {
                const date = new Date(results.mealDate);
                if (!isNaN(date.getTime())) {
                    const formattedDate = date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    setMealDate(formattedDate);
                }
            }
        } catch (error) {
            console.error('Error fetching upcoming results:', error);
            // If no upcoming results, clear the state and continue with normal flow
            clearPollState();
        }
    };

    // Load selected dishes and finalized state from localStorage
    useEffect(() => {
        // Load finalized state first
        const finalizedFlag = localStorage.getItem("poll_finalized") === "true";
        setFinalized(finalizedFlag);
        
        // Load current poll ID
        const storedPollId = localStorage.getItem("current_poll_id");
        if (storedPollId) {
            setPollId(storedPollId);
        }
        
        // If poll is finalized, voting is closed
        setIsVotingOpen(!finalizedFlag);
        
        // Only fetch upcoming results if we know the poll is finalized
        if (finalizedFlag) {
            fetchUpcomingResults();
        }
        
        // Load selected dishes from localStorage (only if not finalized)
        if (!finalizedFlag) {
            const selectedDishes = JSON.parse(localStorage.getItem("selected_dishes") || "[]");
            const selectedMap: { [dishId: string]: boolean } = {};
            selectedDishes.forEach((dishId: string) => { selectedMap[dishId] = true; });
            setSelected(selectedMap);
        }
    }, []);

    // Check for old poll data and clear if needed
    useEffect(() => {
        const checkForOldPollData = async () => {
            try {
                // Try to fetch current poll data
                const currentPoll = await getTodayPoll();
                const currentPollId = currentPoll?.votePollId?.toString();
                const storedPollId = localStorage.getItem("current_poll_id");
                
                // If we have a stored poll ID but it's different from current, clear old data
                if (storedPollId && currentPollId && storedPollId !== currentPollId) {
                    console.log(`Clearing old poll data: stored=${storedPollId}, current=${currentPollId}`);
                    clearPollState();
                }
            } catch (error) {
                console.error('Error checking for old poll data:', error);
            }
        };
        
        checkForOldPollData();
    }, []);

    useEffect(() => {
        if (items && items.length > 0) {
            setData(items.slice());
            return;
        }

        // If we have upcoming results and the poll is finalized, don't fetch the regular poll data
        if (upcomingResults && finalized) {
            return;
        }

        let mounted = true;
        setLoading(true);
        getTodayPoll()
            .then((res: any) => {
                const dishes = res?.dishes ?? [];
                if (!Array.isArray(dishes)) {
                    if (mounted) setData([]);
                    return;
                }

                // Update voting status based on poll status from API
                const pollStatus = res?.status;
                if (pollStatus) {
                    setIsVotingOpen(pollStatus === "open");
                }

                const rows: FoodRow[] = dishes.map((d: any) => ({
                    dishId: d.dishId ?? d.id,
                    name: d.name ?? d.dish ?? d.Dish?.name ?? `Dish ${d.dishId ?? d.id ?? ''}`,
                    votes: Number(d.voteCount ?? d.votes ?? 0) || 0,
                }));

                rows.sort((a, b) => b.votes - a.votes);
                if (mounted) setData(rows);
                // Save pollId for finalizeVotePoll
                if (res?.votePollId) {
                    const currentPollId = res.votePollId.toString();
                    const storedPollId = localStorage.getItem("current_poll_id");
                    
                    // Check if this is a different poll than what we had stored
                    if (storedPollId && storedPollId !== currentPollId) {
                        console.log(`New poll detected: ${storedPollId} -> ${currentPollId}. Clearing old state.`);
                        // Clear old poll state if this is a new poll
                        clearPollState();
                    }
                    
                    setPollId(res.votePollId);
                    // Update localStorage with current poll ID
                    localStorage.setItem("current_poll_id", currentPollId);
                    
                    // If this is a new poll, also clear the finalized state
                    if (storedPollId && storedPollId !== currentPollId) {
                        localStorage.removeItem("poll_finalized");
                        setFinalized(false);
                        setIsVotingOpen(true);
                    }
                }
                
                // Set meal date - debug what's available in the response
                console.log('API Response:', res);
                console.log('Available date fields:', {
                    mealDate: res?.mealDate,
                    voteDate: res?.voteDate
                });
                
                // Test date parsing with the exact format from your example
                const testDate = new Date("2025-09-11");
                console.log('Test date parsing "2025-09-11":', testDate, 'Valid:', !isNaN(testDate.getTime()));
                
                // Try different possible date fields
                const dateField = res?.mealDate || res?.voteDate;
                console.log('Selected date field:', dateField);
                
                if (dateField) {
                    const date = new Date(dateField);
                    console.log('Parsed date:', date);
                    console.log('Is valid date:', !isNaN(date.getTime()));
                    console.log('Date string:', date.toString());
                    
                    if (!isNaN(date.getTime())) {
                        const formattedDate = date.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                        console.log('Formatted date:', formattedDate);
                        setMealDate(formattedDate);
                    } else {
                        console.log('Invalid date, using fallback');
                        // Fallback to current date if parsing fails
                        const currentDate = new Date();
                        const formattedDate = currentDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                        setMealDate(formattedDate);
                    }
                } else {
                    console.log('No date field found, using current date');
                    // Fallback to current date if no date is available from API
                    const currentDate = new Date();
                    const formattedDate = currentDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    setMealDate(formattedDate);
                }

                // Filter selected dishes to only those in the current poll
                const validDishIds = new Set(rows.map(r => String(r.dishId)));
                const selectedDishes = JSON.parse(localStorage.getItem("selected_dishes") || "[]");
                const filteredSelected = selectedDishes.filter((dishId: string) => validDishIds.has(String(dishId)));
                const selectedMap: { [dishId: string]: boolean } = {};
                filteredSelected.forEach((dishId: string) => { selectedMap[dishId] = true; });
                setSelected(selectedMap);
                localStorage.setItem("selected_dishes", JSON.stringify(filteredSelected));
            })
            .catch((e) => {
                console.error('AllFoodsRank getTodayResult error', e);
                if (mounted) setError('Failed to load ranking');
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => { mounted = false; };
    }, [items, upcomingResults, finalized]);

    const display = data ?? items ?? [];

    // Handler for select button (toggle selection)
    const handleSelect = (dishId: number | string) => {
        // Check if voting is still open
        if (isVotingOpen) {
            setPopup({
                isOpen: true,
                title: "Voting Still Open",
                message: "You can only select dishes after voting is closed. Please wait for the voting period to end.",
                type: 'info'
            });
            return;
        }

        setSelected(prev => {
            const newSelected = { ...prev };
            if (newSelected[dishId]) {
                delete newSelected[dishId];
            } else {
                newSelected[dishId] = true;
            }
            // Save to localStorage
            localStorage.setItem("selected_dishes", JSON.stringify(Object.keys(newSelected)));
            return newSelected;
        });
    };

    // Handler for main submit button
    const handleFinalizeSubmit = async () => {
        // Check if voting is still open
        if (isVotingOpen) {
            setPopup({
                isOpen: true,
                title: "Voting Still Open",
                message: "You cannot finalize the poll while voting is still active. Please wait for the voting period to end before finalizing.",
                type: 'info'
            });
            return;
        }

        if (!pollId) {
            setPopup({
                isOpen: true,
                title: "Error",
                message: "Poll ID not found.",
                type: 'error'
            });
            return;
        }
        const selectedIds = Object.keys(selected).map(id => {
            const n = Number(id);
            return isNaN(n) ? id : n;
        });
        if (selectedIds.length === 0) {
            setPopup({
                isOpen: true,
                title: "No Selection",
                message: "Please select at least 3 dishes to submit.",
                type: 'warning'
            });
            return;
        }

        if (selectedIds.length < 3) {
            setPopup({
                isOpen: true,
                title: "Insufficient Selection",
                message: `You have selected ${selectedIds.length} dish(es). Please select at least 3 dishes to submit.`,
                type: 'warning'
            });
            return;
        }
        try {
            await finalizeVotePoll(pollId, selectedIds);
            setFinalized(true);
            setIsVotingOpen(false); // Close voting
            localStorage.setItem("poll_finalized", "true");
            
            // Save selected dishes to localStorage
            localStorage.setItem("selected_dishes", JSON.stringify(selectedIds));
            
            // Fetch the updated results after successful finalization
            await fetchUpcomingResults();
            
            setPopup({
                isOpen: true,
                title: "Success",
                message: "Poll has been successfully finalized! The finalized dishes are now displayed.",
                type: 'success'
            });
        } catch (err: any) {
            setPopup({
                isOpen: true,
                title: "Error",
                message: err.message || "Failed to finalize poll",
                type: 'error'
            });
        }
    };

    const closePopup = () => {
        setPopup(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">
                        {upcomingResults ? 'Finalized Dishes' : title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {mealDate || "Loading date..."}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        upcomingResults
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : isVotingOpen 
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                            : 'bg-green-100 text-green-800 border border-green-200'
                    }`}>
                        {upcomingResults ? 'Finalized' : isVotingOpen ? 'Voting Open' : 'Voting Closed'}
                    </div>
                    <div className="text-sm text-gray-500">
                        {display.length} {display.length === 1 ? 'item' : 'items'}
                    </div>
                </div>
            </div>
            
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#429818]"></div>
                    <span className="ml-3 text-gray-500">Loading...</span>
                </div>
            )}
            
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-700">{error}</span>
                    </div>
                </div>
            )}
            
            {!loading && !error && (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Rank
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Food Item
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Votes
                                </th>
                                {!upcomingResults && (
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">
                                        Action
                                        <div className="text-[10px] text-gray-400 font-normal mt-1">
                                            (Min 3 required)
                                        </div>
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {display.map((row, idx) => (
                                <tr 
                                    key={`${row.name}-${idx}`} 
                                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                                    }`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                idx === 0 ? 'bg-yellow-100 text-yellow-800' :
                                                idx === 1 ? 'bg-gray-100 text-gray-800' :
                                                idx === 2 ? 'bg-orange-100 text-orange-800' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                                {idx + 1}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                {row.name}
                                            </div>
                                            {upcomingResults && selected[row.dishId] && (
                                                <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Selected
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="text-sm font-semibold text-gray-900">
                                            {upcomingResults ? 'Finalized' : row.votes.toLocaleString()}
                                        </div>
                                    </td>
                                    {!upcomingResults && (
                                        <td className="px-6 py-4 whitespace-nowrap text-center w-40">
                                            <button
                                                className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 min-w-[100px] h-[36px] ${
                                                    selected[row.dishId] 
                                                        ? "bg-[#429818] text-white shadow-md hover:bg-[#35701e] hover:shadow-lg" 
                                                        : isVotingOpen
                                                        ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-300"
                                                } ${finalized ? 'opacity-50 cursor-not-allowed' : isVotingOpen ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                                disabled={finalized || isVotingOpen}
                                                onClick={() => handleSelect(row.dishId)}
                                            >
                                                {selected[row.dishId] ? (
                                                    <>
                                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        Selected
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                        Select
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Voting status message */}
            {isVotingOpen && !upcomingResults && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-blue-800">
                            <strong>Voting is still open.</strong> You can only select dishes after the voting period ends and the poll is finalized.
                        </p>
                    </div>
                </div>
            )}

            {/* Finalized results message */}
            {upcomingResults && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-green-800">
                            <strong>Poll has been finalized.</strong> The dishes below have been selected for the upcoming meal.
                        </p>
                    </div>
                </div>
            )}
            
            {/* Selection count and submit button - only show when not displaying finalized results */}
            {!upcomingResults && (
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">
                            {upcomingResults 
                                ? `${Object.keys(selected).length} finalized dishes`
                                : `${Object.keys(selected).length} of ${display.length} dishes selected`
                            }
                        </span>
                        {Object.keys(selected).length < 3 && !isVotingOpen && !upcomingResults && (
                            <span className="ml-2 text-orange-600">
                                (Minimum 3 required)
                            </span>
                        )}
                    </div>
                    <button
                        className={`inline-flex items-center px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                            finalized 
                                ? "bg-green-500 text-white shadow-md" 
                                : isVotingOpen
                                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                : "bg-[#429818] text-white hover:bg-[#35701e] hover:shadow-lg transform hover:-translate-y-0.5"
                        } ${finalized || isVotingOpen ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        disabled={finalized || isVotingOpen}
                        onClick={handleFinalizeSubmit}
                    >
                        {finalized ? (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Poll Finalized
                            </>
                        ) : isVotingOpen ? (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Wait for Voting to End
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Submit Selected ({Object.keys(selected).length})
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Custom Alert */}
            <CustomAlert
                isOpen={popup.isOpen}
                onClose={closePopup}
                title={popup.title}
                message={popup.message}
                type={popup.type}
                showCloseButton={true}
                autoClose={false}
            />
        </div>
    );
};

export default AllFoodsRank;
