import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { create } from "zustand";

const BACKEND_URL = "http://localhost:3000/api";

type Book = {
  id?: number;
  title?: string;
  author?: string;
  genre?: string;
  year?: number;
};

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

const useBookStore = create<BookStore>((set) => ({
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

type BookTableProps = {
  books: Book[];
  onEdit: (book: Book) => void;
};

const BookTable = (props: BookTableProps) => {
  const { books, onEdit } = props;
  const columns = useMemo(
    () => [
      {
        header: "Title",
        accessorKey: "title",
      },
      {
        header: "Author",
        accessorKey: "author",
      },
      {
        header: "Genre",
        accessorKey: "genre",
      },
      {
        header: "Year",
        accessorKey: "year",
      },
      {
        header: "Actions",
        cell: (info: { row: { original: Book } }) => (
          <div>
            <button onClick={() => onEdit(info.row.original)}>Edit</button>
            <button onClick={() => console.log("Delete", info.row.original)}>
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: books,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        {table.getFooterGroups().map((footerGroup) => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  );
};

type FormProps = {
  display: boolean;
  action?: "add" | "edit";
  data?: Book;
  onClose?: () => void;
};

function Form(props: FormProps) {
  const { action, data: defaultValue } = props;
  const formTitle = action === "add" ? "Add Book" : "Edit Book";

  const [formData, setFormData] = useState<Book>({});
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = useCallback(
    async (id?: number) => {
      setErrors({});
      if (action === "edit") {
        const response = await useBookStore
          .getState()
          .update({ id, ...formData });
        if (response.error) {
          setErrors(response.error.details);
        }
      }
    },
    [action, formData]
  );

  if (!props.display) {
    return null;
  }

  return (
    <div key={props.data?.id}>
      {formTitle}
      <div>
        <div>
          <label>Title</label>
          <input
            name="title"
            type="text"
            placeholder="Title"
            defaultValue={defaultValue?.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Author</label>
          <input
            name="author"
            type="text"
            placeholder="Author"
            defaultValue={defaultValue?.author}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Genre</label>
          <input
            name="genre"
            type="text"
            placeholder="Genre"
            defaultValue={defaultValue?.genre}
            onChange={handleChange}
          />
        </div>
        <div>
          <div>
            <label>Year</label>
            <input
              name="year"
              type="number"
              placeholder="Year"
              defaultValue={defaultValue?.year}
              onChange={handleChange}
            />
          </div>
          {errors.year && <div style={{ color: "red" }}>{errors.year}</div>}
        </div>
        <div>
          <button onClick={() => handleSubmit(defaultValue?.id)}>Submit</button>
          <button onClick={props.onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

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
    <div>
      <BookTable books={books} onEdit={handleEditBook} ></BookTable>
      {<Form {...form} onClose={handleClose}/>}
    </div>
  );
}

export default App;
