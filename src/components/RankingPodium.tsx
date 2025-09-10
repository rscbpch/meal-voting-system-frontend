import React, { useEffect, useState } from 'react';
import { getTopThreeToday } from '../services/resultService';

type TopItem = {
    name: string;
    description?: string;
    imageURL?: string | null;
    voteCount: number;
};

const RankingPodium: React.FC = () => {
    const [items, setItems] = useState<TopItem[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        getTopThreeToday()
            .then((res) => {
                if (!mounted) return;
                setItems(res.slice(0, 3));
            })
            .catch((e) => {
                console.error('RankingPodium load error', e);
                if (mounted) setError('Failed to load ranking');
            })
            .finally(() => { if (mounted) setLoading(false); });
        return () => { mounted = false; };
    }, []);

    if (loading) return <div className="p-6 text-center">Loading podium...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
    if (!items || items.length === 0) return <div className="p-6 text-center text-gray-500">No ranking available.</div>;

    // ensure exactly three slots (fill empty)
    const slots: (TopItem | null)[] = [null, null, null];
    items.forEach((it, i) => { slots[i] = it; });

    // podium heights and widths (left=2, center=1, right=3)
    const specs = [
        { height: 160, width: 160 }, // second
        { height: 240, width: 200 }, // first (center)
        { height: 120, width: 140 }, // third
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 pt-10 md:pt-10">
            {/* Top row: charts (grouped) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end py-6">
                {/* order: second (1), first (0), third (2) to place center tall */}
                <div className="flex justify-center" style={{ width: specs[1].width }}>
                    <div style={{ width: specs[1].width }}>
                        <div className="relative" style={{ width: specs[1].width }}>
                            <div className={`bg-[#386641] rounded-md w-full`} style={{ height: `${specs[0].height}px`, paddingTop: '64px' }}>
                            </div>
                            {slots[1] && slots[1].imageURL && (
                                <img src={slots[1]!.imageURL!} alt={slots[1]!.name} className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 object-cover rounded-full border-6 border-white shadow-xl bg-white z-10" />
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center" style={{ width: specs[1].width }}>
                    <div style={{ width: specs[1].width }}>
                        <div className="relative" style={{ width: specs[1].width }}>
                            <div className={`bg-[#386641] rounded-md w-full`} style={{ height: `${specs[1].height}px`, paddingTop: '64px' }}>
                            </div>
                            {slots[0] && slots[0].imageURL && (
                                <img src={slots[0]!.imageURL!} alt={slots[0]!.name} className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 object-cover rounded-full border-6 border-white shadow-xl bg-white z-10" />
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center" style={{ width: specs[1].width }}>
                    <div style={{ width: specs[1].width }}>
                        <div className="relative" style={{ width: specs[1].width }}>
                            <div className={`bg-[#386641] rounded-md w-full`} style={{ height: `${specs[2].height}px`, paddingTop: '64px' }}>
                            </div>
                            {slots[2] && slots[2].imageURL && (
                                <img src={slots[2]!.imageURL!} alt={slots[2]!.name} className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 object-cover rounded-full border-6 border-white shadow-xl bg-white z-10" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom row: names (grouped) - matches grid layout above */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                <div className="text-center" style={{ width: specs[1].width }}>
                    <div className="text-[24px] font-extrabold leading-none pb-[8px]">2</div>
                    <div className="font-bold">{slots[1]?.name ?? '—'}</div>
                    <div className="text-sm opacity-80">{slots[1] ? `${slots[1]!.voteCount} votes` : ''}</div>
                </div>

                <div className="text-center" style={{ width: specs[1].width }}>
                    <div className="text-[24px] font-extrabold leading-none pb-[8px]">1</div>
                    <div className="font-bold">{slots[0]?.name ?? '—'}</div>
                    <div className="text-sm opacity-80">{slots[0] ? `${slots[0]!.voteCount} votes` : ''}</div>
                </div>

                <div className="text-center" style={{ width: specs[1].width }}>
                    <div className="text-[24px] font-extrabold leading-none pb-[8px]">3</div>
                    <div className="font-bold">{slots[2]?.name ?? '—'}</div>
                    <div className="text-sm opacity-80">{slots[2] ? `${slots[2]!.voteCount} votes` : ''}</div>
                </div>
            </div>
        </div>
    );
};

export default RankingPodium;
