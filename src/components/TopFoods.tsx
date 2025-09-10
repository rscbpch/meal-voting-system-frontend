import React, { useEffect, useState } from "react";
import { getTodayPoll } from "../services/votepollService";

interface FoodItem {
    name: string;
    votes: number;
    color?: string;
}

interface Props {
    items?: FoodItem[];
    title?: string;
}

const defaultColors = ["#2F7A1F", "#4FAF2B", "#8AD34A", "#C7E89F"];

const Donut: React.FC<{ items: FoodItem[] }> = ({ items }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;

    const total = items.reduce((s, i) => s + Math.max(0, i.votes), 0) || 1;

    let offset = 0;

    return (
        <svg width={160} height={160} viewBox="0 0 120 120" aria-hidden>
            <g transform="translate(60,60)">
                {items.map((it, idx) => {
                    const value = Math.max(0, it.votes);
                    const portion = value / total;
                    const dash = portion * circumference;
                    const stroke = it.color ?? defaultColors[idx % defaultColors.length];
                    const segment = (
                        <circle
                            key={idx}
                            r={radius}
                            cx={0}
                            cy={0}
                            fill="transparent"
                            stroke={stroke}
                            strokeWidth={18}
                            strokeDasharray={`${dash} ${circumference - dash}`}
                            strokeDashoffset={-offset}
                            strokeLinecap="butt"
                            transform="rotate(-90)"
                        />
                    );
                    offset += dash;
                    return segment;
                })}
                <circle r={radius - 18 / 2} fill="#fff" />
            </g>
        </svg>
    );
};

const TopFoods: React.FC<Props> = ({ items, title = "Top 4 Food" }) => {
    const [data, setData] = useState<FoodItem[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // If caller provided explicit items, use them and skip fetching
        if (items && items.length > 0) {
            setData(items.slice(0, 4));
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

                const arr: FoodItem[] = dishes.map((d: any, idx: number) => ({
                    // prefer explicit `name` from backend, then legacy fields
                    name: d.name ?? d.dish ?? d.Dish?.name ?? `Dish ${d.dishId ?? d.id ?? idx}`,
                    votes: Number(d.voteCount ?? d.votes ?? 0) || 0,
                    color: defaultColors[idx % defaultColors.length]
                }));

                arr.sort((a, b) => b.votes - a.votes);
                if (mounted) setData(arr.slice(0, 4));
            })
            .catch((e) => {
                console.error("TopFoods getTodayResult error", e);
                if (mounted) setError("Failed to load top foods");
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => { mounted = false; };
    }, [items]);

    const display = data ?? [];

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            {loading && <div className="text-sm text-gray-500">Loading...</div>}
            {error && <div className="text-sm text-red-500">{error}</div>}
            {!loading && !error && (
                <div className="flex gap-6 items-center">
                    <Donut items={display} />
                    <div className="flex-1">
                        <ul className="space-y-3">
                            {display.map((s, idx) => (
                                <li key={`${s.name}-${idx}`} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span style={{ width: 12, height: 12, background: s.color ?? defaultColors[idx % defaultColors.length], borderRadius: 6, display: 'inline-block' }} />
                                        <span className="text-sm">{s.name}</span>
                                    </div>
                                    <div className="text-sm font-semibold">{s.votes} votes</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopFoods;
