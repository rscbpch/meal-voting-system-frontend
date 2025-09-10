import API from "./axios";

export interface VotePollRequest {
  mealDate: string;
  dishIds: (number | string)[];
}

export interface VotePollResponse {
  success: boolean;
  message: string;
  data?: {
    id: number | string;
    mealDate: string;
    dishIds: (number | string)[];
    createdAt: string;
    updatedAt: string;
  };
}

export interface PendingVotePollResponse {
  votePollId: number | string;
  mealDate: string;
  voteDate: string;
  status: string;
  dishes: {
    dishId: number | string;
    name: string;
    name_kh: string;
    description: string;
    description_kh: string;
    imageURL: string;
    categoryId: number | string;
    voteCount: number;
  }[];
}

/**
 * Submit a food poll for a specific meal date
 * @param votePollData - The vote poll data containing mealDate and dishIds
 * @returns Promise<VotePollResponse>
 */
export const submitVotePoll = async (votePollData: VotePollRequest): Promise<VotePollResponse> => {
  try {
    const response = await API.post("/polls", votePollData);
    console.log("API response:", response);
    console.log("Response data:", response.data);
    
    // Ensure the response has the expected structure
    const responseData = response.data;
    if (responseData && typeof responseData === 'object') {
      // If the response doesn't have a success property, assume it's successful
      if (responseData.success === undefined) {
        responseData.success = true;
      }
      return responseData;
    }
    
    // If response.data is not an object, wrap it
    return {
      success: true,
      message: "Vote poll submitted successfully",
      data: responseData
    };
  } catch (error: any) {
    console.error("Error submitting vote poll:", error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to submit vote poll"
    );
  }
};

/**
 * Get pending vote poll for a specific date
 * @param date - Optional date string in YYYY-MM-DD format. If not provided, uses current date
 * @returns Promise<PendingVotePollResponse>
 */
export const getPendingVotePoll = async (date?: string): Promise<PendingVotePollResponse> => {
  try {
    const params = date ? { date } : {};
    const response = await API.get("/polls/pending", { params });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching pending vote poll:", error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to fetch pending vote poll"
    );
  }
};

/**
 * Delete a vote poll by ID
 * @param votePollId - The ID of the vote poll to delete
 * @returns Promise<VotePollResponse>
 */
export const deleteVotePoll = async (votePollId: number | string): Promise<VotePollResponse> => {
  try {
    const response = await API.delete(`/polls/${votePollId}`);
    console.log("Delete response:", response);
    console.log("Delete response data:", response.data);
    
    // Ensure the response has the expected structure
    const responseData = response.data;
    if (responseData && typeof responseData === 'object') {
      // If the response doesn't have a success property, assume it's successful
      if (responseData.success === undefined) {
        responseData.success = true;
      }
      return responseData;
    }
    
    // If response.data is not an object, wrap it
    return {
      success: true,
      message: "Vote poll deleted successfully",
      data: responseData
    };
  } catch (error: any) {
    console.error("Error deleting vote poll:", error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to delete vote poll"
    );
  }
};

/**
 * Edit a vote poll by ID
 * @param votePollId - The ID of the vote poll to edit
 * @param votePollData - The updated vote poll data containing dishIds
 * @returns Promise<VotePollResponse>
 */
export const editVotePoll = async (votePollId: number | string, votePollData: { dishIds: (number | string)[] }): Promise<VotePollResponse> => {
  try {
    const response = await API.patch(`/polls/${votePollId}`, votePollData);
    console.log("Edit response:", response);
    console.log("Edit response data:", response.data);
    
    // Ensure the response has the expected structure
    const responseData = response.data;
    if (responseData && typeof responseData === 'object') {
      // If the response doesn't have a success property, assume it's successful
      if (responseData.success === undefined) {
        responseData.success = true;
      }
      return responseData;
    }
    
    // If response.data is not an object, wrap it
    return {
      success: true,
      message: "Vote poll updated successfully",
      data: responseData
    };
  } catch (error: any) {
    console.error("Error editing vote poll:", error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to edit vote poll"
    );
  }
};

// TODO: Add other vote poll functions later
// - getVotePolls
// - getVotePollById