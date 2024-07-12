import axios, { AxiosInstance } from "axios";
import { APIResponse, APIResponseError, Book, User } from "../types";
import { useSessionStore } from "../stores/session-store";

const BACKEND_URL = "http://localhost:3000/api";

const axiosInstance: AxiosInstance = axios.create({ baseURL: BACKEND_URL });

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    const data: APIResponseError = response?.data?.error;

    if (data?.code === "10999") {
      useSessionStore.getState().actions.logout();
    }

    return response;
  },
  (error) => {
    console.log(error);
  }
);

export class BackendClient {
  private axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  async login(username: string, password: string): Promise<APIResponse<User>> {
    const res = await this.axios.post(`/auth/login`, {
      username,
      password,
    });
    return res.data;
  }

  async listBooks(): Promise<APIResponse<Book>> {
    const res = await this.axios.get(`/books`);
    return res.data;
  }

  async createBook(book: Book): Promise<APIResponse<Book>> {
    const res = await this.axios.post(`/books`, book);
    return res.data;
  }

  async updateBook(book: Book): Promise<APIResponse<Book>> {
    const res = await this.axios.put(`/books/${book.id}`, book);
    return res.data;
  }

  async deleteBook(id: number): Promise<APIResponse<Book>> {
    const res = await this.axios.delete(`/books/${id}`);
    return res.data;
  }
}

export const backendClient = new BackendClient(axiosInstance);
