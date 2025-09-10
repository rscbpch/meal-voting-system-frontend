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

export const voteForDish = async (candidateDishId: number) => {
    return API.post("/votes", { candidateDishId });
};

export const cancelVote = async (candidateDishId: number) => {
    return API.put("/votes", { candidateDishId });
}

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