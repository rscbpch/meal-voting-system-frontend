import API from "./axios";

export interface WishData {
    dishId: number;
    name: string;
    imageUrl: string;
    categoryId: number;
    categoryName: string;
    totalWishes: number;
}

export interface WishListResponse {
    dishes: WishData[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

// Type for a user's own wish
export interface UserWish {
    dishId: number;
    dishName: string;
    dishNameKh: string;
    image: string;
    description: string;
    descriptionKh: string;
    categoryId: number;
    categoryName: string;
    updatedAt: string;
}

// Fetch all wishes from the correct API endpoint
export const fetchAllWishes = async (): Promise<WishListResponse> => {
    try {
        const res = await API.get("/wishes/all");
        return res.data;
    } catch (err: any) {
        const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Failed to fetch wishes";
        throw new Error(msg);
    }
};

// Get total wishes for each dish as a map { dishId: totalWishes }
export const getTotalWishesMap = (wishes: WishData[]): Record<number, number> => {
    const map: Record<number, number> = {};
    wishes.forEach(wish => {
        map[wish.dishId] = wish.totalWishes;
    });
    return map;
};

// Helper function to get wish count for a specific dish
export const getWishCountForDish = (wishes: WishData[], dishId: number): number => {
    const wish = wishes.find(w => w.dishId === dishId);
    return wish ? wish.totalWishes : 0;
};

// Update the current user's wish (change the wished dish)
export const updateUserWish = async (dishId: number): Promise<UserWish> => {
    try {
        const res = await API.put("/wishes", { dishId });
        // The API returns the updated wish object
        return res.data;
    } catch (err: any) {
        const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err.message ||
            "Failed to update user wish";
        throw new Error(msg);
    }
};

const USER_WISHES_KEY = "user_wishes";

// Fetch current user's wishes and store in localStorage
export const fetchAndStoreUserWishes = async (): Promise<UserWish[]> => {
    try {
        const res = await API.get("/wishes/mine");
        // The API may return a single wish or an array; normalize to array
        const wishes: UserWish[] = Array.isArray(res.data)
            ? res.data
            : res.data
                ? [res.data]
                : [];
        localStorage.setItem(USER_WISHES_KEY, JSON.stringify(wishes));
        return wishes;
    } catch (err: any) {
        // On error, clear local storage for user wishes
        localStorage.removeItem(USER_WISHES_KEY);
        const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err.message ||
            "Failed to fetch user wishes";
        throw new Error(msg);
    }
};

// Get user wishes from localStorage
export const getUserWishesFromStorage = (): UserWish[] => {
    const wishes = localStorage.getItem(USER_WISHES_KEY);
    if (!wishes) return [];
    try {
        return JSON.parse(wishes);
    } catch {
        return [];
    }
};