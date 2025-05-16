import api from "@/utils/axiosInstance.ts";
import {User} from "@/contexts/auth-context.tsx";


export interface LoginResponse {
  accessToken: string;
  user: User;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post("/api/auth/login", { email, password });
  return response.data.result;
};

export const register = async (name: string, email: string, password: string) => {
  const response = await api.post(`/api/auth/register`, {
    name,
    email,
    password,
  });
  return response.data;
};

// Get current user details
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get("/api/auth/me");
    // Assuming the API returns the user object directly
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

/*
export const getCurrentUser = async () => {
  const response = await axios.get(`${API}/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};*/

export const loginWithGoogle = async (email: string): Promise<LoginResponse> => {
  const response = await api.post("/api/auth/google-login", { email }, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data.result;
};

