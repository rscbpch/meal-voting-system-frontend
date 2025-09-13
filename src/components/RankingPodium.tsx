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
        { height: 240, width: 160 }, // first (center)
        { height: 120, width: 160 }, // third
    ];

    return (
        <div className="max-w-5xl mx-auto md:pt-10">
            {/* Desktop/tablet podium */}
            <div className="hidden sm:grid grid-cols-3 gap-6 items-end py-6">
                {/* ...your existing podium grid code here... */}
                {/* (keep your original grid code for sm and up) */}
                <div className="flex justify-center" style={{ width: specs[1].width }}>
                    <div style={{ width: specs[1].width }}>
                        <div className="relative" style={{ width: specs[1].width }}>
                            <div className={`bg-[#386641] rounded-md w-full`} style={{ height: `${specs[0].height}px`, paddingTop: '64px' }} />
                            {slots[1] && slots[1].imageURL && (
                                <img src={slots[1]!.imageURL!} alt={slots[1]!.name} className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 object-cover rounded-full border-6 border-white shadow-xl bg-white z-10" />
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center" style={{ width: specs[1].width }}>
                    <div style={{ width: specs[1].width }}>
                        <div className="relative" style={{ width: specs[1].width }}>
                            <div className={`bg-[#386641] rounded-md w-full`} style={{ height: `${specs[1].height}px`, paddingTop: '64px' }} />
                            {slots[0] && slots[0].imageURL && (
                                <img src={slots[0]!.imageURL!} alt={slots[0]!.name} className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 object-cover rounded-full border-6 border-white shadow-xl bg-white z-10" />
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center" style={{ width: specs[1].width }}>
                    <div style={{ width: specs[1].width }}>
                        <div className="relative" style={{ width: specs[1].width }}>
                            <div className={`bg-[#386641] rounded-md w-full`} style={{ height: `${specs[2].height}px`, paddingTop: '64px' }} />
                            {slots[2] && slots[2].imageURL && (
                                <img src={slots[2]!.imageURL!} alt={slots[2]!.name} className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 object-cover rounded-full border-6 border-white shadow-xl bg-white z-10" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden sm:grid grid-cols-3 gap-6 mt-2">
                {/* ...your existing bottom row code for sm and up... */}
                <div className="text-center" style={{ width: specs[1].width }}>
                    <div className=" text-[24px] sm:text-[30px] md:text-[36px] font-extrabold leading-none pb-[8px]">2</div>
                    <div className="text-sm opacity-80">
                        {slots[1]
                        ? `${slots[1]!.voteCount} ${slots[1]!.voteCount > 1 ? 'votes' : 'vote'}`
                        : ''}
                    </div>
                    <div className="font-semibold text-[16px] leading-tight ">{slots[1]?.name ?? '—'}</div>
                </div>
                <div className="text-center" style={{ width: specs[1].width }}>
                    <div className=" text-[24px] sm:text-[30px] md:text-[36px] font-extrabold leading-none pb-[8px]">1</div>
                    <div className="text-sm opacity-80">
                        {slots[0]
                        ? `${slots[0]!.voteCount} ${slots[0]!.voteCount > 1 ? 'votes' : 'vote'}`
                        : ''}
                    </div>
                    <div className="font-semibold text-[16px] leading-tight ">{slots[0]?.name ?? '—'}</div>
                </div>
                <div className="text-center" style={{ width: specs[1].width }}>
                    <div className=" text-[24px] sm:text-[30px] md:text-[36px] font-extrabold leading-none pb-[8px]">3</div>
                    <div className="text-sm opacity-80">
                        {slots[2]
                        ? `${slots[2]!.voteCount} ${slots[2]!.voteCount > 1 ? 'votes' : 'vote'}`
                        : ''}
                    </div>
                    <div className="font-semibold text-[16px] leading-tight ">{slots[2]?.name ?? '—'}</div>
                </div>
            </div>

            {/* Mobile list layout */}
            <div className="flex flex-col gap-2 sm:hidden">
                {[0, 1, 2].map((idx) => (
                    <div
                        key={idx}
                        className="flex items-center bg-white rounded-lg shadow p-3 min-h-[80px] flex-shrink flex-grow"
                    >
                        {/* Ranking */}
                        <div className="text-xl font-extrabold w-6 text-center">{idx + 1}</div>
                        {/* Food image */}
                        <div className="mx-2 flex-shrink-0">
                            {slots[idx] && slots[idx]?.imageURL ? (
                                <img
                                    src={slots[idx]!.imageURL!}
                                    alt={slots[idx]?.name}
                                    className="w-12 h-12 object-cover rounded-full border-2 border-white shadow bg-white"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                    <span className="text-lg">—</span>
                                </div>
                            )}
                        </div>
                        {/* Food name */}
                        <div className="text-[14px] text-gray-800 max-h-[42px] max-w-[178px] overflow-hidden">{slots[idx]?.name ?? '—'}</div>
                        {/* Gap */}
                        <div className="w-4" />
                        {/* Vote count */}
                        <div className="text-sm text-gray-600 min-w-[48px] text-right">
                            {slots[idx]
                                ? `${slots[idx]!.voteCount} ${slots[idx]!.voteCount > 1 ? 'votes' : 'vote'}`
                                : ''}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RankingPodium;
