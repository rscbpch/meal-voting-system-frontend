import API from "./axios";

export interface CandidateDish {
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
export interface UpcomingResult {
    votePollId: number;
    mealDate: string;
    voteDate: string;
    status: string;
    dish: CandidateDish[];
}

export const getTodayResult = async (): Promise<TodayResult> => {
    const res = await API.get<TodayResult>("/results/today");
    return res.data;
}

export const getUpcomingResults = async (): Promise<UpcomingResult[]> => {
    const res = await API.get<UpcomingResult[]>("/results/upcoming");
    return res.data;
};