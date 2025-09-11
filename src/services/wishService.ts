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
