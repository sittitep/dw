import { create } from "zustand";
import axios from "axios";

import { APIResponse, Book } from "../types";

const BACKEND_URL = "http://localhost:3000/api";

type BookStore = {
  books: Book[];
  actions: {
    list: () => void;
    create: (book: Book) => Promise<APIResponse>;
    update: (book: Book) => Promise<APIResponse>;
    delete: (id: number) => Promise<APIResponse>;
  };
};

export const useBookStore = create<BookStore>((set, get) => ({
  books: [],
  actions: {
    list: async () => {
      const res = await axios.get(`${BACKEND_URL}/books`);
      set({ books: res.data.data });
    },
    create: async (book: Book): Promise<APIResponse> => {
      const res = await axios.post(`${BACKEND_URL}/books`, book);

      if (!res.data.error) {
        get().actions.list();
      }

      return res.data;
    },
    update: async (book: Book): Promise<APIResponse> => {
      const res = await axios.put(`${BACKEND_URL}/books/${book.id}`, book);

      if (!res.data.error) {
        get().actions.list();
      }

      return res.data;
    },
    delete: async (id: number): Promise<APIResponse> => {
      const res = await axios.delete(`${BACKEND_URL}/books/${id}`);

      if (!res.data.error) {
        get().actions.list();
      }

      return res.data;
    },
  },
}));
