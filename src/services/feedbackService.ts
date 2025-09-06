import { API_NO_AUTH } from "./axios";

export interface FeedbackItem {
    id: number;
    canteen?: number | null;
    system?: number | null;
    content: string;
    createdAt: string;
}

export interface FeedbackListResponse {
    success: boolean;
    items: FeedbackItem[];
    total: number;
    nextOffset?: number;
}

export interface CreateFeedbackPayload {
    canteen: number;
    system: number;
    content: string;
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
