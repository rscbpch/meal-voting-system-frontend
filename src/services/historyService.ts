import API from './axios';

export interface UserVote {
    id: number;
    dishId: number;
    Dish: {
        id: number;
        name: string;
        description: string;
        imageURL: string;
        categoryId: number;
    };
}

export interface PollDish {
    candidateDishId: number;
    dishId: number;
    dish: string;
    voteCount: number;
}

export interface selectedDishes {
    candidateDishId: number;
    dishId: number;
    dish: string;
    voteCount: number;
}

export interface VoteHistoryResponse {
    votePollId: number;
    mealDate: string;
    voteDate: string;
    userVote: UserVote | null;
    dishes?: PollDish[];
    selectedDishes?: selectedDishes[];
}
export const getVoteHistory = async (date?: string): Promise<VoteHistoryResponse> => {
    const url = date ? `votes/history?date=${date}` : `votes/history`;
    const res = await API.get<VoteHistoryResponse>(url);
    return res.data;
}