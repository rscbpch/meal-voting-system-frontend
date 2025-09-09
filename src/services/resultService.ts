import API from "./axios";

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

export const getTodayResult = async (): Promise<TodayResult> => {
    const res = await API.get<TodayResult>("/results/today");
    return res.data;
}

export const getUpcomingResults = async (): Promise<UpcomingResult[]> => {
    const res = await API.get<UpcomingResult[]>("/results/upcoming");
    return res.data;
};

/**
 * Return the dish with the highest voteCount from the active today's result.
 * Returns null when there is no open/available poll or no dishes.
 */
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