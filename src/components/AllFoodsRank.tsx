import React, { useEffect, useState } from "react";
import { getTodayPoll } from "../services/staffBoardVotepollService";
import { finalizeVotePoll } from "../services/votePollService";

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

    // Load selected dishes and finalized state from localStorage
    useEffect(() => {
        const selectedDishes = JSON.parse(localStorage.getItem("selected_dishes") || "[]");
        const selectedMap: { [dishId: string]: boolean } = {};
        selectedDishes.forEach((dishId: string) => { selectedMap[dishId] = true; });
        setSelected(selectedMap);
        const finalizedFlag = localStorage.getItem("poll_finalized") === "true";
        setFinalized(finalizedFlag);
    }, []);

    useEffect(() => {
        if (items && items.length > 0) {
            setData(items.slice());
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

                const rows: FoodRow[] = dishes.map((d: any) => ({
                    dishId: d.dishId ?? d.id,
                    name: d.name ?? d.dish ?? d.Dish?.name ?? `Dish ${d.dishId ?? d.id ?? ''}`,
                    votes: Number(d.voteCount ?? d.votes ?? 0) || 0,
                }));

                rows.sort((a, b) => b.votes - a.votes);
                if (mounted) setData(rows);
                // Save pollId for finalizeVotePoll
                if (res?.votePollId) setPollId(res.votePollId);

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
    }, [items]);

    const display = data ?? items ?? [];

    // Handler for select button (toggle selection)
    const handleSelect = (dishId: number | string) => {
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
        if (!pollId) {
            alert("Poll ID not found.");
            return;
        }
        const selectedIds = Object.keys(selected).map(id => {
            const n = Number(id);
            return isNaN(n) ? id : n;
        });
        if (selectedIds.length === 0) {
            alert("Please select at least one dish to submit.");
            return;
        }
        try {
            await finalizeVotePoll(pollId, selectedIds);
            setFinalized(true);
            localStorage.setItem("poll_finalized", "true");
        } catch (err: any) {
            alert(err.message || "Failed to finalize poll");
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            {loading && <div className="text-sm text-gray-500">Loading...</div>}
            {error && <div className="text-sm text-red-500">{error}</div>}
            {!loading && !error && (
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-sm text-gray-400">
                            <th className="py-2">Rank</th>
                            <th className="py-2">Food</th>
                            <th className="py-2 text-right">Votes</th>
                            <th className="py-2 text-center">Submit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {display.map((row, idx) => (
                            <tr key={`${row.name}-${idx}`} className="border-t">
                                <td className="py-3 text-sm text-gray-600 w-16">{idx + 1}</td>
                                <td className="py-3 text-sm text-gray-700">{row.name}</td>
                                <td className="py-3 text-sm text-gray-700 text-right">{row.votes}</td>
                                <td className="py-3 text-center">
                                    <button
                                        className={`px-4 py-1 rounded ${selected[row.dishId] ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-blue-100"}`}
                                        disabled={finalized}
                                        onClick={() => handleSelect(row.dishId)}
                                    >
                                        {selected[row.dishId] ? "Selected" : "Select"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {/* Main submit button */}
            <div className="flex justify-end mt-4">
                <button
                    className={`px-6 py-2 rounded font-semibold ${finalized ? "bg-green-500 text-white" : "bg-[#429818] text-white hover:bg-[#35701e]"}`}
                    disabled={finalized}
                    onClick={handleFinalizeSubmit}
                >
                    {finalized ? "Poll Finalized" : "Submit Selected"}
                </button>
            </div>
        </div>
    );
};

export default AllFoodsRank;
