import axios from "axios";

const API = "http://localhost:8081/api/auth";

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API}/login`, {
    email,
    password,
  });
  return response.data;
};

export const register = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API}/register`, {
    name,
    email,
    password,
  });
  return response.data;
};