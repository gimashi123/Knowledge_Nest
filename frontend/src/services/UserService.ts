import axiosInstance from "@/services/axios.ts";

            const BASE_URL = "http://localhost:8081/api/social";

            export const UserService = {
                followUser: async (userId: string, targetUserId: string) => {
                    try {
                        const response = await axiosInstance.post(`/social/follow`, { userId, targetUserId });
                        return response.data;
                    } catch (error: any) {
                        throw new Error(`Failed to toggle follow: ${error.response?.statusText || error.message}`);
                    }
                },
                unfollowUser: async (userId: string, targetUserId: string) => {
                    try {
                        const response = await axiosInstance.post(`/social/unfollow`, { userId, targetUserId });
                        return response.data;
                    } catch (error: any) {
                        throw new Error(`Failed to toggle follow: ${error.response?.statusText || error.message}`);
                    }
                },
                // isFollowing: async (userId: string) => {
                //     try {
                //         const response = await axiosInstance.get(`${BASE_URL}/following/${userId}`);
                //         return response.data; // Expected: { isFollowing: true }
                //     } catch (error: any) {
                //         throw new Error(`Failed to check follow status: ${error.response?.statusText || error.message}`);
                //     }
                // },
                    isFollowing: async (followerId: string, followeeId: string) => {
                        try {
                            const response = await axiosInstance.get(`${BASE_URL}/isFollowing`, {
                                params: {
                                    followerId,
                                    followeeId
                                }
                            });
                            return response.data; // Expected: { isFollowing: true }
                        } catch (error: any) {
                            throw new Error(`Failed to check follow status: ${error.response?.statusText || error.message}`);
                        }
                    }
            };