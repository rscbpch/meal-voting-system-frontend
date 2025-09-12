import API from "./axios";

export interface Category {
    id: number | string;
    name: string;
}

export interface Dish {
    id: number | string;
    name: string;
    name_kh?: string | null;
    description?: string | null;
    description_kh?: string | null;
    ingredient?: string | null;
    ingredient_kh?: string | null;
    price?: number | null;
    imageURL?: string | null;
    rating?: number | null;
    averageFoodRating?: number | null;
    totalWishes?: number | null;
    totalRatingCount?: number | null;
    favoritesCount?: number | null;
    categoryId?: number | string | null;
    categoryName?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface DishListResponse {
    success: boolean;
    items: Dish[];
    total: number;
    nextOffset?: number | null;
}

export interface GetDishesParams {
    offset?: number;
    limit?: number;
    q?: string; // search query
    categoryId?: number | string;
    sort?: "recent" | "most_rated" | "most_favorite";
}

export interface CreateDishForm {
    name?: string;
    name_kh: string;
    categoryId: number | string;
    ingredient?: string;
    ingredient_kh?: string;
    description?: string;
    description_kh?: string;
    image: File; // required by backend (req.file)
}

export type UpdateDishForm = Partial<Omit<CreateDishForm, "image_kh">> & {
    image?: File;
};

export const getDishes = async (
    params: GetDishesParams = {}
): Promise<DishListResponse> => {
    const { categoryId, limit, offset, sort } = params;
    try {
        let res;
        
        // Use specific endpoints for most-rated and most-favorited when those filters are selected
        if (sort === "most_rated") {
            try {
                console.log('Using most-rated endpoint with params:', { limit, offset });
                res = await API.get(`/dishes/most-rated`, {
                    params: { limit, offset },
                });
                console.log('Most-rated response:', res.status, res.data);
            } catch (error: any) {
                console.error('Most-rated endpoint failed, falling back to regular endpoint:', error);
                // Fallback to regular endpoint if specific endpoint fails
                res = await API.get(`/dishes`, { 
                    params: { limit, offset, sort: "most_rated" } 
                });
            }
        } else if (sort === "most_favorite") {
            try {
                console.log('Using most-favorited endpoint with params:', { limit, offset });
                res = await API.get(`/dishes/most-favorited`, {
                    params: { limit, offset },
                });
                console.log('Most-favorited response:', res.status, res.data);
            } catch (error: any) {
                console.error('Most-favorited endpoint failed, falling back to regular endpoint:', error);
                // Fallback to regular endpoint if specific endpoint fails
                res = await API.get(`/dishes`, { 
                    params: { limit, offset, sort: "most_favorite" } 
                });
            }
        } else {
            // Use regular endpoints for recent and other sorts
            res = categoryId
                ? await API.get(`/dishes/category/${categoryId}`, {
                      params: { limit, offset, sort },
                  })
                : await API.get(`/dishes`, { params: { limit, offset, sort } });
        }

        // Handle different response structures
        const rawItems: any[] = res.data?.items || res.data?.data || [];
        const total: number = res.data?.total || rawItems.length;
        const nextOffset: number | null = res.data?.nextOffset ?? null;

        // Map backend field names to frontend field names with proper validation
        const items: Dish[] = rawItems.map(item => {
            // Ensure we have valid data for required fields
            const mappedItem = {
                ...item,
                // Map backend field names to frontend expected names with fallbacks
                averageFoodRating: item.averageRating !== undefined ? Number(item.averageRating) : 
                                 item.averageFoodRating !== undefined ? Number(item.averageFoodRating) : 0,
                totalRatingCount: item.ratingCount !== undefined ? Number(item.ratingCount) : 
                                item.totalRatingCount !== undefined ? Number(item.totalRatingCount) : 0,
                totalWishes: item.wishCount !== undefined ? Number(item.wishCount) : 
                           item.totalWishes !== undefined ? Number(item.totalWishes) : 0,
                // Ensure required fields have fallbacks
                name: item.name || 'Unknown Dish',
                categoryName: item.categoryName || 'Uncategorized',
                imageURL: item.imageURL || '',
                description: item.description || ''
            };
            
            console.log('Mapped item:', {
                id: mappedItem.id,
                name: mappedItem.name,
                averageFoodRating: mappedItem.averageFoodRating,
                totalRatingCount: mappedItem.totalRatingCount,
                totalWishes: mappedItem.totalWishes
            });
            
            return mappedItem;
        });

        return { success: true, items, total, nextOffset };
    } catch (err: any) {
        console.error('Error in getDishes:', {
            sort,
            categoryId,
            limit,
            offset,
            error: err,
            status: err?.response?.status,
            data: err?.response?.data
        });
        
        const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err.message ||
            "Failed to fetch dishes";
        throw new Error(msg);
    }
};

// Check if dish names already exist
export const checkDishNames = async (
    name: string,
    name_kh: string,
    excludeId?: number | string
): Promise<{ nameExists: boolean; nameKhExists: boolean; existingDish?: Dish }> => {
    try {
        // Get all dishes to check for duplicates
        const response = await getDishes({ limit: 1000 }); // Get a large number to check all dishes
        const dishes = response.items;
        
        const nameExists = dishes.some(dish => 
            dish.name?.toLowerCase() === name.toLowerCase() && 
            dish.id !== excludeId
        );
        
        const nameKhExists = dishes.some(dish => 
            dish.name_kh?.toLowerCase() === name_kh.toLowerCase() && 
            dish.id !== excludeId
        );
        
        const existingDish = dishes.find(dish => 
            (dish.name?.toLowerCase() === name.toLowerCase() || 
             dish.name_kh?.toLowerCase() === name_kh.toLowerCase()) && 
            dish.id !== excludeId
        );
        
        return { nameExists, nameKhExists, existingDish };
    } catch (err: any) {
        console.error("Error checking dish names:", err);
        // If we can't check, return false to allow submission (server will catch duplicates)
        return { nameExists: false, nameKhExists: false };
    }
};

// Fetch categories
export const getCategories = async (): Promise<Category[]> => {
    try {
        const res = await API.get("/categories");
        const items: Category[] = res.data?.items || res.data?.data || [];
        return items;
    } catch (err: any) {
        const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err.message ||
            "Failed to fetch categories";
        throw new Error(msg);
    }
};

export const createDish = async (form: CreateDishForm): Promise<Dish> => {
    try {
        const fd = new FormData();

        if (form.name) fd.append("name", form.name);
        fd.append("name_kh", form.name_kh);
        fd.append("categoryId", String(Number(form.categoryId)));
        if (form.ingredient) fd.append("ingredient", form.ingredient);
        if (form.ingredient_kh) fd.append("ingredient_kh", form.ingredient_kh);
        if (form.description) fd.append("description", form.description);
        if (form.description_kh)
            fd.append("description_kh", form.description_kh);

        if (form.image) {
            fd.append("imageFile", form.image);
        }

        const res = await API.post("/dishes", fd, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        console.log("Dish create response:", res.data);

        return res.data?.dish || res.data?.data || res.data;
    } catch (err: any) {
        console.error("Create dish error:", err);
        
        // Handle specific error cases
        if (err?.response?.status === 409) {
            // Duplicate name error
            const errorMsg = err?.response?.data?.error || 
                           err?.response?.data?.message || 
                           "A dish with this name or Khmer name already exists. Please choose a different name.";
            throw new Error(errorMsg);
        }
        
        const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err.message ||
            "Failed to create dish";
        throw new Error(msg);
    }
};

// Update a dish
export const updateDish = async (
    id: number | string,
    form: UpdateDishForm
): Promise<{ message: string }> => {
    try {
        const fd = new FormData();
        if (form.name !== undefined) fd.append("name", String(form.name));
        if (form.name_kh !== undefined)
            fd.append("name_kh", String(form.name_kh));
        if (form.description !== undefined)
            fd.append("description", String(form.description));
        if (form.description_kh !== undefined)
            fd.append("description_kh", String(form.description_kh));
        if (form.ingredient !== undefined)
            fd.append("ingredient", String(form.ingredient));
        if (form.ingredient_kh !== undefined)
            fd.append("ingredient_kh", String(form.ingredient_kh));
        if (form.categoryId !== undefined)
            fd.append("categoryId", String(form.categoryId));
        if (form.image) fd.append("image", form.image);

        const res = await API.put(`/dishes/${id}`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return { message: res.data?.message || "Dish updated successfully" };
    } catch (err: any) {
        console.error("Update dish error:", err);
        
        // Handle specific error cases
        if (err?.response?.status === 409) {
            // Duplicate name error
            const errorMsg = err?.response?.data?.error || 
                           err?.response?.data?.message || 
                           "A dish with this name or Khmer name already exists. Please choose a different name.";
            throw new Error(errorMsg);
        }
        
        const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err.message ||
            "Failed to update dish";
        throw new Error(msg);
    }
};

// Delete a dish
export const deleteDish = async (
    id: number | string
): Promise<{ message: string }> => {
    try {
        const res = await API.delete(`/dishes/${id}`);
        return { message: res.data?.message || "Dish deleted successfully" };
    } catch (err: any) {
        const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err.message ||
            "Failed to delete dish";
        throw new Error(msg);
    }
};

// Fetch dishes with the most wishes (most favorited)
export const getMostWishedDishes = async (): Promise<DishListResponse> => {
    try {
        // Set a large limit to fetch all dishes
        const res = await API.get("/dishes/most-favorited", { params: { limit: 1000 } });
        const items: Dish[] = res.data?.items || [];
        const total: number = typeof res.data?.total === 'number' ? res.data.total : items.length;
        const nextOffset: number | null = typeof res.data?.nextOffset === 'number' ? res.data.nextOffset : null;
        return { success: true, items, total, nextOffset };
    } catch (err: any) {
        const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err.message ||
            "Failed to fetch most wished dishes";
        throw new Error(msg);
    }
};
