import React, { useCallback, useState } from "react";

import { Book } from "../types";
import { useBookStore } from "../stores/book-store";

export type FormProps = {
  display: boolean;
  action?: "add" | "edit";
  data?: Book;
  onClose?: () => void;
};

export function Form(props: FormProps) {
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
