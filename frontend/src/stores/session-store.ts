import { create } from "zustand";
import { backendClient } from "../libs/backend-client";
import { User } from "../types";

type SessionStore = {
  token?: string;
  errors?: Record<string, any>;
  actions: {
    setToken: (token: string) => void;
    login: (username: string, password: string) => void;
    logout: () => void;
  };
};

export const useSessionStore = create<SessionStore>((set, get) => ({
  token: undefined,
  actions: {
    setToken: (token) => {
      set({ token });
      localStorage.setItem("token", token);
    },
    login: async (username, password) => {
      set({ errors: undefined });
      const res = await backendClient.login(username, password);

      if (!res.error) {
        const accessToken = (res.data as User).access_token;
        get().actions.setToken(accessToken!);
      } else {
        set({ errors: { password: res.error?.message} });
      }
    },
    logout: () => {
      set({ token: undefined });
      localStorage.removeItem("token");
    },
  },
}));
