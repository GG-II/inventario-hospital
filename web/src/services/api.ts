import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export interface User {
  id: number;
  username: string;
  nombre: string;
  rol: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface Subgrupo {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  total?: number;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private getHeaders() {
    const headers: any = {
      'Content-Type': 'application/json',
    };
    
    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password
    });
    return response.data;
  }

  async getSubgrupos(): Promise<ApiResponse<Subgrupo[]>> {
    const response = await axios.get(`${API_BASE_URL}/api/subgrupos`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async getMe(): Promise<{ user: User }> {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders()
    });
    return response.data;
  }
}

export const apiService = new ApiService();