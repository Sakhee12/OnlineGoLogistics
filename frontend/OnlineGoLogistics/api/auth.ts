import { api } from "./axios";
import "../api/interceptor";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  _id: string;
  name: string;
  username: string;
  role: string;
  token: string;
}

export interface RegisterRequest {
  name: string;
  username: string;
  password: string;
  role?: string;
  email?: string;
  mobile?: string;
  address?: string;
  company?: string;
}

export const loginApi = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/api/auth/login", data);
  return res.data;
};

export const registerApi = async (
  data: RegisterRequest
): Promise<any> => {
  const res = await api.post("/api/auth/register", data);
  return res.data;
};
