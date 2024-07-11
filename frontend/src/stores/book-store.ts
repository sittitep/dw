import { create } from "zustand";
import { Book } from "../types";
import axios from "axios";

const BACKEND_URL = "http://localhost:3000/api";

type BookStore = {
  books: Book[];
  getList: () => void;
  update: (book: Book) => Promise<APIResponse>;
};

type Error = {
  code: string;
  message: string;
  details: Record<string, any>;
};

type APIResponse = {
  data: Book;
  error: Error;
};

export const useBookStore = create<BookStore>((set) => ({
  books: [],
  getList: async () => {
    const res = await axios.get(`${BACKEND_URL}/books`);
    set({ books: res.data.data });
  },
  update: async (book: Book): Promise<APIResponse> => {
    const res = await axios.put(`${BACKEND_URL}/books/${book.id}`, book);
    const updatedBook = res.data.data;

    if (!res.data.error) {
      set((state) => ({
        books: state.books.map((b) =>
          b.id === updatedBook.id ? updatedBook : b
        ),
      }));
    }

    return res.data;
  },
}));
