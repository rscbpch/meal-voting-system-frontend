import React, { useEffect, useState } from "react";
import { getHighestVotedPollDish } from "../services/votepollService";
import { getTodayPoll } from "../services/votepollService";

type GroupedData = {
    category: string;
    categoryId: string | number;
    foods: Array<{
        candidateDishId: number;
        dishId: number;
        name: string;
        voteCount: number;
        imgURL?: string | null;
    }>;
};

const VotingChart: React.FC = () => {
    const [status, setStatus] = useState<string>("");
    const [grouped, setGrouped] = useState<GroupedData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hovered, setHovered] = useState<{catIdx: number; foodIdx: number; x: number; y: number} | null>(null);
    const [highestVote, setHighestVote] = useState<number | null>(null);

    useEffect(() => {
        let mounted = true;
        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                const result = await getTodayPoll();
                if (!mounted) return;
                setStatus(result.status);

                const catMap = new Map<string, {category: string, foods: GroupedData["foods"]}>();
                for (const c of result.dishes) {
                    const catId = String(c.categoryId ?? "uncategorized");
                    const catName = c.categoryId ? `Category ${c.categoryId}` : "Uncategorized";
                    if (!catMap.has(catId)) catMap.set(catId, {category: catName, foods: []});
                    catMap.get(catId)!.foods.push({
                        candidateDishId: (c as any).candidateDishId ?? c.dishId,
                        dishId: c.dishId,
                        name: c.name || (c as any).dish || "",
                        voteCount: c.voteCount ?? 0,
                        imgURL: c.imageURL ?? null,
                    });
                }
                setGrouped(Array.from(catMap, ([categoryId, {category, foods}]) => ({categoryId, category, foods})));
                // fetch highest voted dish separately (service helper)
                try {
                    const top = await getHighestVotedPollDish();
                    if (mounted) setHighestVote(top ? Number(top.voteCount ?? 0) : 0);
                } catch (e) {
                    // non-fatal: leave highestVote as null so we fallback to grouped-derived max
                }
            } catch (err: any) {
                setError(err.message || "Failed to load voting data");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
        return () => { mounted = false; };
    }, []);

    // Chart sizing and scaling
    const CHART_HEIGHT = 288; // px
    const derivedMax = Math.max(
        1,
        ...grouped.flatMap(g => g.foods.map(f => f.voteCount))
    );

    // prefer the service-provided highest vote when available
    const maxVote = Math.max(derivedMax, highestVote ?? 0);

    // compute topTick so it is a multiple of 10 (min 10) and then divide into 5 segments
    const TICK_COUNT = 5; // will show topTick, topTick - step, ..., 0 (5 segments)
    let topTick = Math.max(10, Math.ceil(maxVote / 10) * 10);
    const step = topTick / TICK_COUNT;
    const ticks = Array.from({ length: TICK_COUNT + 1 }, (_, i) => Math.max(0, Math.round(topTick - i * step)));


    if (loading) return <div className="p-8 text-center">Loading voting data...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (status !== "open") return <div className="p-8 text-center text-gray-500">Voting is not open.</div>;
    if (grouped.length === 0) return <div className="p-8 text-center text-gray-500">No voting data available.</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Voting Graph</h3>
            <div className="overflow-x-auto">
                <div className="flex">
                    {/* Left axis */}
                    <div className="flex-shrink-0 pr-4">
                        <div style={{ height: CHART_HEIGHT }} className="flex flex-col justify-between items-end text-sm text-gray-400">
                            {ticks.map((t, idx) => (
                                <div key={idx} className="w-16 text-right">{t}</div>
                            ))}
                        </div>
                    </div>

                    {/* Chart area */}
                    <div className="flex-1">
                        <div style={{ height: CHART_HEIGHT }} className="relative">
                            {/* grid lines */}
                            {ticks.map((_, idx) => {
                                const top = (idx / ticks.length) * 100;
                                return (
                                    <div key={idx} style={{ top: `${top}%` }} className="absolute left-0 right-0 border-t border-gray-100 pointer-events-none" />
                                );
                            })}

                            <div className="flex gap-12 items-end h-full overflow-x-auto pr-6">
                                {grouped.map((cat, catIdx) => (
                                    <div key={cat.categoryId} className="flex flex-col items-center min-w-[160px]">
                                        <div className="flex flex-row gap-3 items-end w-full justify-center">
                                            {cat.foods.map((food, foodIdx) => {
                                                const pct = Math.min(100, Math.round((food.voteCount / topTick) * 100));
                                                const isHovered = !!(hovered && hovered.catIdx === catIdx && hovered.foodIdx === foodIdx);
                                                const baseColor = '#e9e9e9';
                                                const fillColor = isHovered ? '#43a047' : baseColor;
                                                return (
                                                    <div key={food.candidateDishId} className="flex flex-col items-center">
                                                        <div
                                                            className="w-8 rounded-lg cursor-pointer transition-all"
                                                            style={{ height: `${(pct/100) * CHART_HEIGHT}px`, background: fillColor }}
                                                            onMouseEnter={e => {
                                                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                                                setHovered({catIdx, foodIdx, x: rect.left + rect.width/2, y: rect.top});
                                                            }}
                                                            onMouseLeave={() => setHovered(null)}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>


                                        {/* tooltip centered above hovered bar within category */}
                                        {hovered && hovered.catIdx === catIdx && cat.foods[hovered.foodIdx] && (
                                            <div className="relative w-full flex justify-center -mt-4">
                                                <div className="bg-white border rounded-md p-2 shadow-lg min-w-[160px]">
                                                    <div className="flex items-center gap-2">
                                                        {cat.foods[hovered.foodIdx].imgURL ? (
                                                            <img src={cat.foods[hovered.foodIdx].imgURL!} alt="" className="w-10 h-10 rounded-full object-cover" />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-gray-200" />
                                                        )}
                                                        <div>
                                                            <div className="text-sm font-semibold">{cat.foods[hovered.foodIdx].name}</div>
                                                            <div className="text-xs text-gray-500">Total votes: <span className="font-medium text-green-600">{cat.foods[hovered.foodIdx].voteCount}</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-3 text-sm text-gray-600 text-center w-full truncate">{cat.category}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VotingChart;