import axios, { AxiosInstance } from "axios";
import { APIResponse, Book, User } from "../types";

const BACKEND_URL = "http://localhost:3000/api";

const axiosInstance: AxiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export class BackendClient {
  private axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  async login(username: string, password: string): Promise<APIResponse<User>> {
    const res = await this.axios.post(`${BACKEND_URL}/auth/login`, {
      username,
      password,
    });
    return res.data;
  }

  async listBooks(): Promise<APIResponse<Book>> {
    const res = await this.axios.get(`${BACKEND_URL}/books`);
    return res.data;
  }

  async createBook(book: Book): Promise<APIResponse<Book>> {
    const res = await this.axios.post(`${BACKEND_URL}/books`, book);
    return res.data;
  }

  async updateBook(book: Book): Promise<APIResponse<Book>> {
    const res = await this.axios.put(`${BACKEND_URL}/books/${book.id}`, book);
    return res.data;
  }

  async deleteBook(id: number): Promise<APIResponse<Book>> {
    const res = await this.axios.delete(`${BACKEND_URL}/books/${id}`);
    return res.data;
  }
}

export const backendClient = new BackendClient(axiosInstance);
