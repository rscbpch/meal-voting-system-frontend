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
    dishId: number;
    name: string;
    name_kh?: string;
    ingredient?: string;
    ingredients_kh?: string;
    description?: string;
    description_kh?: string;
    imageURL?: string;
    categoryId?: number;
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
    status: string; // "open", "close", "finalized", "pending"
    userVote: UserVote | null;
    dishes?: PollDish[]; // For open/close polls - dishes with vote counts
    selectedDishes?: SelectedDish[]; // For finalized polls - selected dishes
}
export const getVoteHistory = async (date?: string): Promise<VoteHistoryResponse> => {
    const url = date ? `votes/history?date=${date}` : `votes/history`;
    const res = await API.get<VoteHistoryResponse>(url);
    return res.data;
}