import React, { useCallback, useEffect, useState } from "react";

import "./index.css";

import { BookTable } from "./components/table";
import { Form, FormProps } from "./components/form";

import { useBookStore } from "./stores/book-store";

import { Book } from "./types";

function App() {
  const books = useBookStore((state) => state.books);

  const [form, setForm] = useState<Omit<FormProps, "onClose">>({
    display: false,
  });

  const handleEditBook = useCallback((book: Book) => {
    setForm({
      display: true,
      action: "edit",
      data: book,
    });
  }, []);

  const handleClose = useCallback(() => {
    setForm((prev) => ({ ...prev, display: false }));
  }, []);

  useEffect(() => {
    useBookStore.getState().getList();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="w-3/5 pt-10">
        <BookTable books={books} onEdit={handleEditBook} />
      </div>
      {<Form {...form} onClose={handleClose} />}
    </div>
  );
}

export default App;
