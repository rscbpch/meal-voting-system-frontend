import API from "./axios";
import { BACKEND_URL } from "./axios";

export interface CandidateDish {
    dish: string | undefined;
    candidateDishId: number;
    dishId: number;
    name: string;
    name_kh?: string;
    description?: string;
    description_kh?: string;
    imageURL?: string;
    categoryId?: number;
    voteCount: number;
}
export interface TodayResult {
    votePollId: number;
    mealDate: string;
    voteDate: string;
    status: string;
    dishes: CandidateDish[];
}
export interface UpcomingDish {
    id: number;
    votePollId: number;
    dishId: number;
    isSelected: boolean;
    Dish: {
        id: number;
        name: string;
    };
    // some backends may include a vote count; make optional
    voteCount?: number;
}

export interface UpcomingResult {
    votePollId: number;
    mealDate: string;
    voteDate: string;
    status: string;
    dish: UpcomingDish[];
}

export interface TodayVoteResponse {
    votePollId: number;
    voteDate: string;
    userVote?: {
        id: number;
        votePollId: number;
        dishId: number;
        userId: number;
        Dish: {
            id: number;
            name: string;
            name_kh?: string;
        };
    };
    candidateDishes?: Array<{
        id: number;
        dishId: number;
        name: string;
        name_kh?: string;
    }>
}

export const getTodayVote = async (): Promise<TodayVoteResponse | null> => {
    try {
        const res = await fetch("/api/votes/today", {
            method: "GET",
            credentials: "include",
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        return null;
    }
}
export const getTodayResult = async (): Promise<TodayResult> => {
    const res = await API.get<TodayResult>("/results/today");
    return res.data;
}

export const getUpcomingResults = async (): Promise<UpcomingResult[]> => {
    const res = await API.get<UpcomingResult[]>("/results/upcoming");
    return res.data;
};

export const getTopThreeToday = async (): Promise<Array<{name: string; description?: string; imageURL?: string | null; voteCount: number;}>> => {
    const res = await getTodayResult();
    const dishes = Array.isArray(res?.dishes) ? res.dishes.slice() : [];
    if (dishes.length === 0) return [];

    dishes.sort((a, b) => (Number(b.voteCount ?? 0) - Number(a.voteCount ?? 0)));

    return dishes.slice(0, 3).map(d => ({
        name: d.name ?? d.dish ?? `Dish ${d.dishId ?? ''}`,
        description: d.description ?? undefined,
        imageURL: d.imageURL ?? null,
        voteCount: Number(d.voteCount ?? 0),
    }));
};

export const voteForDish = async (dishId: number) => {
    const res = await fetch(`${BACKEND_URL}/votes`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ dishId }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();  
};

export const getHighestVotedDish = async (): Promise<CandidateDish | null> => {
    const res = await getTodayResult();
    const dishes = res?.dishes ?? [];
    if (!Array.isArray(dishes) || dishes.length === 0) return null;

    let top = dishes[0];
    let topVotes = Number(top.voteCount ?? 0);
    for (let i = 1; i < dishes.length; i++) {
        const d = dishes[i];
        const v = Number(d.voteCount ?? 0);
        if (v > topVotes) {
            top = d;
            topVotes = v;
        }
    }
    return top ?? null;
};

export const updateVoteForDish = async (dishId: number) => {
    const res = await fetch("/api/votes", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ dishId }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};


