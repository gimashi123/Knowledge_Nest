import axiosInstance from "@/services/axios.ts";

export const getFollowersAndFollowingsForUser = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`/social/user/followers/${userId}`);

        return response.data.result as FollowerFollowing || null;
    } catch (error) {
        console.error("Error fetching current user:", error);
        throw error;
    }
}

export const getUserCoinsByUser= async  (userId: string) => {
    try{
        const response = await axiosInstance.get(`/user/get-coins/${userId}`);

        return response.data as number || null;
    }catch (e) {

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
