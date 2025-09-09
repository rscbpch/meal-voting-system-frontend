import React, { useEffect, useState } from "react";
import { getTopThreeToday } from "../services/resultService";

type TopItem = {
    name: string;
    description?: string;
    imageURL?: string | null;
    voteCount: number;
};

const RankingCard: React.FC = () => {
    const [items, setItems] = useState<TopItem[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        getTopThreeToday()
            .then(res => {
                if (!mounted) return;
                setItems(res);
            })
            .catch(e => {
                console.error('RankingCard getTopThreeToday error', e);
                if (mounted) setError('Failed to load top foods');
            })
            .finally(() => { if (mounted) setLoading(false); });
        return () => { mounted = false; };
    }, []);

    if (loading) return <div className="p-6 bg-white rounded-lg shadow-sm">Loading top foods...</div>;
    if (error) return <div className="p-6 bg-white rounded-lg shadow-sm text-red-500">{error}</div>;
    if (!items || items.length === 0) return <div className="p-6 bg-white rounded-lg shadow-sm text-gray-500">No ranking available.</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((it, idx) => (
                <div key={`${it.name}-${idx}`} className="bg-white rounded-lg p-6 shadow-md flex flex-col items-start">
                    <div className="w-full flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            {it.imageURL ? (
                                <img src={it.imageURL} alt={it.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-200" />
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="text-lg font-semibold text-gray-800">{it.name}</div>
                            <div className="text-sm text-gray-500 mt-1">{it.description ?? ''}</div>
                        </div>
                        <div className="text-sm text-gray-700 font-medium">{it.voteCount} votes</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RankingCard;