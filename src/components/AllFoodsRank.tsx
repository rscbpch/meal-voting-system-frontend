import React, { useEffect, useState } from "react";
import { getTodayResult, type TodayResult } from "../services/resultService";

interface FoodRow {
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

    useEffect(() => {
        if (items && items.length > 0) {
            setData(items.slice());
            return;
        }

        let mounted = true;
        setLoading(true);
        getTodayResult()
            .then((res: TodayResult | any) => {
                const dishes = res?.dishes ?? [];
                if (!Array.isArray(dishes)) {
                    if (mounted) setData([]);
                    return;
                }

                const rows: FoodRow[] = dishes.map((d: any) => ({
                    name: d.dish ?? d.Dish?.name ?? `Dish ${d.dishId ?? d.id ?? ''}`,
                    votes: Number(d.voteCount ?? d.votes ?? 0) || 0,
                }));

                rows.sort((a, b) => b.votes - a.votes);
                if (mounted) setData(rows);
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
                        </tr>
                    </thead>
                    <tbody>
                        {display.map((row, idx) => (
                            <tr key={`${row.name}-${idx}`} className="border-t">
                                <td className="py-3 text-sm text-gray-600 w-16">{idx + 1}</td>
                                <td className="py-3 text-sm text-gray-700">{row.name}</td>
                                <td className="py-3 text-sm text-gray-700 text-right">{row.votes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AllFoodsRank;
