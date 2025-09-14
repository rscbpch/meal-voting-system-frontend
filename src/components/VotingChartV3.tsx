import React, { useEffect, useState, useCallback } from "react";
import { getTodayPoll } from "../services/staffBoardVotepollService";
import { getCategories, type Category } from "../services/dishService";

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

type HoverState = {
    catIdx: number;
    foodIdx: number;
    x: number;
    y: number;
};

const VotingChartV3: React.FC = () => {
    const [status, setStatus] = useState<string>("");
    const [grouped, setGrouped] = useState<GroupedData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hovered, setHovered] = useState<HoverState | null>(null);
    const [maxVote, setMaxVote] = useState<number>(0);
    const [, setCategories] = useState<Category[]>([]);
    const [votingDate, setVotingDate] = useState<string>("");

    // Color palette for different categories - based on main color #429818
    const categoryColors = [
        '#429818', // Main green
        '#2E6B12', // Darker green
        '#5CB832', // Lighter green
        '#1F4A0C', // Dark green
        '#7DD047', // Light green
        '#8AE55C', // Very light green
        '#1A3D08', // Very dark green
        '#9FF570', // Bright light green
    ];

    const getCategoryColor = (index: number) => {
        const colorIndex = index % categoryColors.length;
        return categoryColors[colorIndex];
    };

    const fetchData = useCallback(async () => {
        try {
            setError(null);
            
            // Fetch both poll data and categories
            const [result, categoriesData] = await Promise.all([
                getTodayPoll(),
                getCategories()
            ]);
            
            setStatus(result.status);
            setCategories(categoriesData);
            
            // Set voting date - debug what's available in the response
            console.log('VotingChartV3 API Response:', result);
            console.log('Available date fields:', {
                mealDate: result?.mealDate,
                voteDate: result?.voteDate
            });
            
            // Try different possible date fields
            const dateField = result?.voteDate || result?.mealDate;
            if (dateField) {
                const date = new Date(dateField);
                if (!isNaN(date.getTime())) {
                    const formattedDate = date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    setVotingDate(formattedDate);
                }
            } else {
                // Fallback to current date if no date is available from API
                const currentDate = new Date();
                const formattedDate = currentDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                setVotingDate(formattedDate);
                console.log('VotingChartV3 using current date as fallback:', formattedDate);
            }

            // Group dishes by category
            const catMap = new Map<string, { category: string; foods: GroupedData["foods"] }>();
            
            for (const dish of result.dishes) {
                const catId = String(dish.categoryId ?? "uncategorized");
                
                // Find the real category name from the fetched categories
                const realCategory = categoriesData.find(cat => String(cat.id) === String(dish.categoryId));
                const catName = realCategory?.name || 
                               (dish as any).categoryName || 
                               (dish as any).category?.name || 
                               (dish.categoryId ? `Category ${dish.categoryId}` : "Uncategorized");
                
                if (!catMap.has(catId)) {
                    catMap.set(catId, { category: catName, foods: [] });
                }
                
                catMap.get(catId)!.foods.push({
                    candidateDishId: (dish as any).candidateDishId ?? dish.dishId,
                    dishId: dish.dishId,
                    name: dish.name || (dish as any).dish || "",
                    voteCount: dish.voteCount ?? 0,
                    imgURL: dish.imageURL ?? null,
                });
            }

            // Sort foods within each category by vote count (descending)
            const sortedGrouped = Array.from(catMap, ([categoryId, { category, foods }]) => ({
                categoryId,
                category,
                foods: foods.sort((a, b) => b.voteCount - a.voteCount)
            })).sort((a, b) => {
                // Sort categories by total votes
                const aTotal = a.foods.reduce((sum, food) => sum + food.voteCount, 0);
                const bTotal = b.foods.reduce((sum, food) => sum + food.voteCount, 0);
                return bTotal - aTotal;
            });

            setGrouped(sortedGrouped);

            // Calculate max vote for dynamic scaling
            const allVotes = sortedGrouped.flatMap(g => g.foods.map(f => f.voteCount));
            const newMaxVote = Math.max(1, ...allVotes);
            setMaxVote(newMaxVote);
        } catch (err: any) {
            setError(err.message || "Failed to load voting data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let mounted = true;
        
        const loadData = async () => {
            setLoading(true);
            await fetchData();
        };

        loadData();

        // Set up real-time polling every 5 seconds
        const interval = setInterval(async () => {
            if (mounted) {
                await fetchData();
            }
        }, 5000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [fetchData]);

    // Chart configuration
    const CHART_HEIGHT = 400;
    const BAR_WIDTH = 35;

    // Calculate dynamic scale - ensure it starts from 0 with even spacing
    const TICK_COUNT = 5;
    const topTick = Math.max(10, Math.ceil(maxVote / 10) * 10);
    const step = topTick / TICK_COUNT;
    const ticks = Array.from({ length: TICK_COUNT + 1 }, (_, i) => 
        Math.round(topTick - i * step)
    );

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="inline-flex items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading voting data...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-500">
                <div className="text-lg font-medium mb-2">Error Loading Data</div>
                <div className="text-sm">{error}</div>
                <button 
                    onClick={fetchData}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (status === "closed" || status === "finalized") {
        return (
            <div className="p-8 text-center text-gray-500">
                <div className="text-lg font-medium mb-2">Voting Not Available</div>
                <div className="text-sm">Voting is currently {status}</div>
            </div>
        );
    }

    if (grouped.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                <div className="text-lg font-medium mb-2">No Data Available</div>
                <div className="text-sm">No voting data available at the moment</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Live Voting Results</h3>
                        {votingDate && (
                            <p className="text-sm text-gray-600 mt-1">
                                {votingDate}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center text-sm text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        Live Updates
                    </div>
                </div>
                
                {/* Category Legend */}
                <div className="mt-4 flex flex-wrap gap-4">
                    {grouped.map((category, catIdx) => {
                        const categoryColor = getCategoryColor(catIdx);
                        
                        return (
                            <div key={category.categoryId} className="flex items-center gap-2">
                                <div 
                                    className="w-4 h-4 rounded-sm"
                                    style={{ backgroundColor: categoryColor }}
                                ></div>
                                <span className="text-sm font-medium text-gray-700">
                                    {category.category}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className="p-6">
                <div className="flex">
                        {/* Y-axis */}
                        <div className="flex-shrink-0 w-16">
                            <div style={{ height: CHART_HEIGHT }} className="relative">
                                {ticks.map((tick, idx) => {
                                    const top = (idx / (ticks.length - 1)) * 100;
                                    return (
                                        <div 
                                            key={idx} 
                                            className="absolute text-xs text-gray-500 font-medium w-full text-right pr-2"
                                            style={{ 
                                                top: `${top}%`,
                                                transform: 'translateY(-50%)'
                                            }}
                                        >
                                            {tick}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Chart area */}
                        <div className="flex-1 ml-4">
                            {/* Chart bars area - fixed height */}
                            <div style={{ height: CHART_HEIGHT }} className="relative">
                                {/* Grid lines */}
                                {ticks.map((_, idx) => {
                                    const top = (idx / (ticks.length - 1)) * 100;
                                    return (
                                        <div
                                            key={idx}
                                            style={{ top: `${top}%` }}
                                            className="absolute left-0 right-0 border-t border-gray-100 pointer-events-none"
                                        />
                                    );
                                })}

                                {/* Chart content */}
                                <div className="flex items-end h-full pr-8">
                                    {grouped.map((category, catIdx) => {
                                        const categoryColor = getCategoryColor(catIdx);
                                        
                                        return (
                                            <div key={category.categoryId} className="flex flex-col items-center h-full">
                                                {/* Bars container - uses full chart height */}
                                                <div className="flex gap-2 items-end justify-center relative px-4 h-full">
                                                    {category.foods.map((food, foodIdx) => {
                                                        const percentage = Math.min(100, (food.voteCount / topTick) * 100);
                                                        const isHovered = !!(hovered && hovered.catIdx === catIdx && hovered.foodIdx === foodIdx);
                                                        
                                                        return (
                                                            <div key={food.candidateDishId} className="flex flex-col items-center group relative">
                                                                {food.voteCount > 0 && (
                                                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 whitespace-nowrap z-10">
                                                                        {food.voteCount}
                                                                    </div>
                                                                )}
                                                                <div
                                                                    className="relative rounded-t-md cursor-pointer transition-all duration-300 ease-out hover:shadow-lg"
                                                                    style={{
                                                                        width: `${BAR_WIDTH}px`,
                                                                        height: `${(percentage / 100) * CHART_HEIGHT}px`,
                                                                        backgroundColor: isHovered ? categoryColor : `${categoryColor}CC`,
                                                                        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                                                        boxShadow: isHovered ? `0 4px 12px ${categoryColor}40` : 'none',
                                                                    }}
                                                                    onMouseEnter={(e) => {
                                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                                        setHovered({
                                                                            catIdx,
                                                                            foodIdx,
                                                                            x: rect.left + rect.width / 2,
                                                                            y: rect.top
                                                                        });
                                                                    }}
                                                                    onMouseLeave={() => setHovered(null)}
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tooltip - positioned absolutely to prevent layout issues */}
                {hovered && grouped[hovered.catIdx]?.foods[hovered.foodIdx] && (
                    <div 
                        className="fixed z-50 bg-white border border-gray-200 rounded-lg p-4 shadow-xl min-w-[220px] pointer-events-none"
                        style={{
                            left: `${hovered.x - 110}px`,
                            top: `${hovered.y - 120}px`,
                        }}
                    >
                        <div className="flex items-center gap-3">
                            {grouped[hovered.catIdx].foods[hovered.foodIdx].imgURL ? (
                                <img
                                    src={grouped[hovered.catIdx].foods[hovered.foodIdx].imgURL!}
                                    alt=""
                                    className="w-12 h-12 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">No Image</span>
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="font-semibold text-gray-800 mb-1">
                                    {grouped[hovered.catIdx].foods[hovered.foodIdx].name}
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                    {grouped[hovered.catIdx].category}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div 
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: getCategoryColor(hovered.catIdx) }}
                                    ></div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {grouped[hovered.catIdx].foods[hovered.foodIdx].voteCount} votes
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

    );
};

export default VotingChartV3;
