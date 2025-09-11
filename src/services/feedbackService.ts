import { API_NO_AUTH } from "./axios";

export interface FeedbackItem {
    id: number;
    canteen?: number | null;
    system?: number | null;
    food?: number | null;
    content: string;
    createdAt: string;
}

export interface FeedbackListResponse {
    success: boolean;
    items: FeedbackItem[];
    total: number;
    nextOffset?: number;
}

export interface DishFeedbackResponse {
    success: boolean;
    dishId: number;
    averageFoodRating: string | null;
    totalRatings: number;
    feedbacks: FeedbackItem[];
}

export interface CreateFeedbackPayload {
    canteen: number;
    system: number;
    content: string;
}

export interface CreateDishFeedbackPayload {
    food?: number;
    content?: string;
}

export const fetchFeedbacks = async (
    offset = 0,
    limit = 10
): Promise<FeedbackListResponse> => {
    try {
        const response = await API_NO_AUTH.get("/system-feedback", {
            params: { offset, limit },
        });
        return response.data as FeedbackListResponse;
    } catch (err: any) {
        const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err.message ||
            "Failed to fetch feedbacks";
        throw new Error(msg);
    }
};

export const createFeedback = async (
    payload: CreateFeedbackPayload
): Promise<{ success: boolean }> => {
    try {
        const response = await API_NO_AUTH.post("/system-feedback", payload, {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
            },
        });
        return response.data as { success: boolean };
    } catch (err: any) {
        const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err.message ||
            "Failed to submit feedback";
        throw new Error(msg);
    }
};

// Dish-specific feedback functions
export const fetchDishFeedbacks = async (
    dishId: number | string,
    offset = 0,
    limit = 10
): Promise<DishFeedbackResponse> => {
    try {
        console.log("API call to fetch dish feedbacks:", `/feedback/dish/${dishId}/all`);
        const response = await API_NO_AUTH.get(`/feedback/dish/${dishId}/all`, {
            params: { offset, limit },
        });
        console.log("Raw API response:", response.data);
        return response.data as DishFeedbackResponse;
    } catch (err: any) {
        console.error("API error:", err);
        const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err.message ||
            "Failed to fetch dish feedbacks";
        throw new Error(msg);
    }
};

export const createDishFeedback = async (
    dishId: number | string,
    payload: CreateDishFeedbackPayload
): Promise<{ success: boolean }> => {
    try {
        console.log("API call to create dish feedback:", `/feedback/dish/${dishId}`, payload);
        const response = await API_NO_AUTH.post(`/feedback/dish/${dishId}`, payload, {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
            },
        });
        console.log("Create feedback response:", response.data);
        return response.data as { success: boolean };
    } catch (err: any) {
        console.error("Create feedback API error:", err);
        const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err.message ||
            "Failed to submit dish feedback";
        throw new Error(msg);
    }
};
