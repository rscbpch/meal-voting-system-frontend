import API from './axios';

export interface UserVote {
    id: number;
    votePollId: number;
    dishId: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
    Dish: {
        id: number;
        name: string;
        description?: string;
        imageURL?: string;
    };
}

export interface PollDish {
    candidateDishId: number;
    dishId: number;
    dish: string;
    voteCount: number;
}

export interface SelectedDish {
    id: number;
    votePollId: number;
    dishId: number;
    isSelected: boolean;
    Dish: {
        id: number;
        name: string;
        description?: string;
        imageURL?: string;
    };
}

export interface VoteHistoryResponse {
    votePollId: number;
    mealDate: string;
    voteDate: string;
    userVote: UserVote | null;
    dishes?: PollDish[]; // For open/close polls - top 5 dishes with vote counts
    selectedDishes?: SelectedDish[]; // For finalized polls - selected dishes
}
export const getVoteHistory = async (date?: string): Promise<VoteHistoryResponse> => {
    const url = date ? `votes/history?date=${date}` : `votes/history`;
    const res = await API.get<VoteHistoryResponse>(url);
    return res.data;
}