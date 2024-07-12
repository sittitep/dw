import { create } from "zustand";
import axios from "axios";

import { APIResponse, Book } from "../types";
import { backendClient, BackendClient } from "../libs/backend-client";

const BACKEND_URL = "http://localhost:3000/api";

type BookStore = {
  books: Book[];
  actions: {
    list: () => void;
    create: (book: Book) => Promise<APIResponse<Book>>;
    update: (book: Book) => Promise<APIResponse<Book>>;
    delete: (id: number) => Promise<APIResponse<Book>>;
  };
};

export const useBookStore = create<BookStore>((set, get) => ({
  books: [],
  actions: {
    list: async () => {
      const res = await backendClient.listBooks();
      set({ books: res.data as Book[] });
    },
    create: async (book: Book): Promise<APIResponse<Book>> => {
      const res = await backendClient.createBook(book);

      if (!res.error) {
        get().actions.list();
      }

      return res;
    },
    update: async (book: Book): Promise<APIResponse<Book>> => {
      const res = await backendClient.updateBook(book);

      if (!res.error) {
        get().actions.list();
      }

      return res;
    },
    delete: async (id: number): Promise<APIResponse<Book>> => {
      const res = await backendClient.deleteBook(id);

      if (!res.error) {
        get().actions.list();
      }

      return res;
    },
  },
}));
