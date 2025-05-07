import axiosInstance from "@/utils/axiosInstance.ts";

const API_URL = '/api/progress'

// Updated Progress interface to match frontend needs
// progress-service.tsx
export interface Progress {
    progressId?: string;
    title: string;
    topics: string[];
    progress: number;
    lastUpdate: string;  // Changed to string type
    userId?: string;
    courseId?: string;
}
export const getProgress = async () => {
    return axiosInstance.get<Progress[]>(`${API_URL}/all`)
}

export const createProgress = async (data: Progress) => {
    return axiosInstance.post<Progress>(`${API_URL}/add`, {
        ...data,
        // Add backend required fields if needed
        userId: "current_user_id", // Replace with actual user ID
        courseId: "course_id_here" // Replace with actual course ID
    })
}

export const updateProgress = async (id: string, data: Progress) => {
    return axiosInstance.put<Progress>(`${API_URL}/${id}`, {
        ...data,
        // Add backend required fields if needed

    })
}

export const deleteProgress = async (id: string) => {
    return axiosInstance.delete(`${API_URL}/${id}`)
}