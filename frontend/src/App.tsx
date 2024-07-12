import React, { useEffect } from "react";

import "./index.css";

import { BookTable } from "./components/table";
import { Form } from "./components/form";
import { Actions } from "./components/actions";

import { useBookStore } from "./stores/book-store";
import { useFormStore } from "./stores/form-store";

function App() {
  const {books, actions: bookStoreActions} = useBookStore((state) => state)
  const isFormOpen = useFormStore((state) => state.isOpen);

  useEffect(() => {
    bookStoreActions.list();
  }, [bookStoreActions]);

  return (
    <div className="flex justify-center">
      <div className="w-3/5 pt-10">
        <Actions />
        <BookTable books={books} />
      </div>
      {isFormOpen && <Form />}
    </div>
  );
}

export default App;
