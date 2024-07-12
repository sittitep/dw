import { create } from "zustand";
import { APIResponse, Book } from "../types";
import { useBookStore } from "./book-store";

type FormActions = "new" | "edit";

type FormStore = {
  isOpen: boolean;
  action?: FormActions;
  resource?: Book;
  values?: Book;
  errors?: Record<string, string>;
  saved: boolean;
  actions: {
    open: (action: FormActions, resource?: Book) => void;
    close: () => void;
    setErrors: (errors: Record<string, string>) => void;
    clearErrors: () => void;
    updateValues: (values: Book) => void;
    submit: (action: FormActions, id?: number, values?: Book) => void;
  }
};

export const useFormStore = create<FormStore>((set, get) => ({
  isOpen: false,
  saved: false,
  actions: {
    open: (action: FormActions, resource?: Book) =>
      set({ isOpen: true, action, resource }),
    close: () => set({ isOpen: false, resource: undefined, errors: undefined, values: undefined, saved: false}),
    setErrors: (errors: Record<string, string>) => set({ errors }),
    clearErrors: () => set({ errors: undefined }),
    updateValues: (values: Book) =>
      set((state) => ({ values: { ...state.values, ...values } })),
    submit: async (action: FormActions, id?: number, values?: Book): Promise<void> => {
      get().actions.clearErrors();
  
      let response: APIResponse<Book>;
      const { actions } = useBookStore.getState();
  
      if (action === "edit") {
        response = await actions.update({id, ...values});
      } else {
        response = await actions.create(values!);
      }
  
      if (response.error) {
        set({ errors: response.error.details });
        return;
      }

      set({ saved: true })
    },
  }
}));
