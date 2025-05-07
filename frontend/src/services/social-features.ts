import api from "@/utils/axiosInstance.ts";

export const getFollowersAndFollowingsForUser = async (userId: string) => {
    try {
        const response = await api.get(`/api/social/user/followers/${userId}`);

        return response.data.result as FollowerFollowing || null;
    } catch (error) {
        console.error("Error fetching current user:", error);
        throw error;
    }
}


export interface FollowerFollowing {
    followers: UserResponse[],
    followings: UserResponse[]
}

export interface UserResponse {
    userId: string;
    name: string;
    email: string;
    profilePic: string;
}
