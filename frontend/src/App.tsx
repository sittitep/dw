import React, { useEffect } from "react";

import "./index.css";

import { BookTable } from "./components/table";
import { Form } from "./components/form";

import { useBookStore } from "./stores/book-store";
import { useFormStore } from "./stores/form-store";

function App() {
  const books = useBookStore((state) => state.books);
  const isFormOpen = useFormStore((state) => state.isOpen);

  useEffect(() => {
    useBookStore.getState().actions.list();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="w-3/5 pt-10">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Book Library</h1>
          <button
            className="text-sm py-1 px-3 rounded-lg bg-blue-500 text-white"
            onClick={() => useFormStore.getState().actions.open("new")}
          >
            New Book
          </button>
        </div>
        <BookTable books={books} />
      </div>
      {isFormOpen && <Form />}
    </div>
  );
}

export default App;
