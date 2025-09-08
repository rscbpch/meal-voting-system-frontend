import React, { useEffect, useState } from "react";
import { getTodayResult } from "../services/resultService";
import { getDishes, getCategories, type Dish, type Category } from "../services/dishService";

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

    useEffect(() => {
        let mounted = true;
        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                const [result, dishRes, catRes] = await Promise.all([
                    getTodayResult(),
                    getDishes(),
                    getCategories(),
                ]);
                if (!mounted) return;
                setStatus(result.status);
                const allDishes: Dish[] = dishRes.items;
                const allCategories: Category[] = catRes;
                const catNameMap = new Map<string|number, string>();
                allCategories.forEach(cat => catNameMap.set(cat.id, cat.name));
                const dishMap = new Map<number|string, Dish>();
                allDishes.forEach(d => dishMap.set(d.id, d));
                const catMap = new Map<string|number, {category: string, foods: GroupedData["foods"]}>();
                for (const c of result.dishes) {
                    const dish = dishMap.get(c.dishId);
                    const catId = dish?.categoryId ?? "uncategorized";
                    // Use category name from categories list if available
                    const catName = catNameMap.get(catId) || dish?.categoryName || "Uncategorized";
                    if (!catMap.has(catId)) catMap.set(catId, {category: catName, foods: []});
                    catMap.get(catId)!.foods.push({
                        candidateDishId: c.candidateDishId,
                        dishId: c.dishId,
                        name: dish?.name || c.dish,
                        voteCount: c.voteCount,
                        imgURL: dish?.imageURL || null,
                    });
                }
                setGrouped(Array.from(catMap, ([categoryId, {category, foods}]) => ({categoryId, category, foods})));
            } catch (err: any) {
                setError(err.message || "Failed to load voting data");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
        return () => { mounted = false; };
    }, []);

    // Find max vote for scaling
    const maxVote = Math.max(
        1,
        ...grouped.flatMap(g => g.foods.map(f => f.voteCount))
    );

    if (loading) return <div className="p-8 text-center">Loading voting data...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (status !== "open") return <div className="p-8 text-center text-gray-500">Voting is not open.</div>;
    if (grouped.length === 0) return <div className="p-8 text-center text-gray-500">No voting data available.</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Voting Graph</h3>
            <div className="overflow-x-auto">
                <div className="flex gap-12">
                    {grouped.map((cat, catIdx) => (
                        <div key={cat.categoryId} className="flex flex-col items-center min-w-[120px]">
                            <div className="mb-2 text-base font-semibold text-gray-700">{cat.category}</div>
                            <div className="flex flex-col gap-2 h-72 justify-end relative">
                                {cat.foods.map((food, foodIdx) => {
                                    const pct = Math.round((food.voteCount / maxVote) * 100);
                                    return (
                                        <div key={food.candidateDishId} className="flex flex-col items-center group">
                                            <div
                                                className="w-12 h-40 bg-gray-200 rounded-lg flex items-end relative cursor-pointer hover:bg-green-600 transition-colors"
                                                style={{ height: `${Math.max(40, pct * 2)}px` }}
                                                onMouseEnter={e => {
                                                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                                    setHovered({catIdx, foodIdx, x: rect.left + rect.width/2, y: rect.top});
                                                }}
                                                onMouseLeave={() => setHovered(null)}
                                            >
                                                <div className="w-full h-full" style={{ background: food.voteCount === maxVote ? '#43a047' : undefined, opacity: food.voteCount === maxVote ? 1 : 0.3, borderRadius: 8 }} />
                                            </div>
                                            <div className="mt-1 text-xs text-gray-600 text-center max-w-[80px] truncate">{food.name}</div>
                                        </div>
                                    );
                                })}
                                {/* Tooltip */}
                                {hovered && hovered.catIdx === catIdx && cat.foods[hovered.foodIdx] && (
                                    <div
                                        style={{ left: '100%', top: hovered.foodIdx * 60 + 10 }}
                                        className="absolute z-50 bg-white border rounded-md p-2 shadow-lg min-w-[120px] -translate-x-1/2 -translate-y-1/2"
                                    >
                                        <div className="flex items-center gap-2">
                                            {cat.foods[hovered.foodIdx].imgURL ? (
                                                <img src={cat.foods[hovered.foodIdx].imgURL!} alt="" className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-200" />
                                            )}
                                            <div>
                                                <div className="text-sm font-semibold">{cat.foods[hovered.foodIdx].name}</div>
                                                <div className="text-xs text-gray-500">
                                                    Total votes: <span className="font-medium text-green-600">{cat.foods[hovered.foodIdx].voteCount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VotingChart;