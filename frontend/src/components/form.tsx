import React, { useCallback, useEffect, useState } from "react";

import { Book } from "../types";
import { useBookStore } from "../stores/book-store";

export type FormProps = {
  display: boolean;
  action?: "add" | "edit";
  data?: Book;
  onClose?: () => void;
};

type InputProps = {
  name: string;
  defaultValue?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
};

function Input(props: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="capitalize">{props.name}</label>
      <input
        type="text"
        placeholder={props.name}
        {...props}
        className="border p-2"
      />
      <div className="h-[20px] text-sm text-red-700">{props.errorMessage}</div>
    </div>
  );
}

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

  const handleOnClose = useCallback(() => {
    setFormData({});
    setErrors({});
    props.onClose?.();
  }, [props]);

  if (!props.display) {
    return null;
  }

  return (
    <div
      key={props.data?.id}
      className="fixed bg-black bg-opacity-25 w-full h-full flex justify-center items-center"
    >
      <div className="bg-white p-6 w-2/6">
        <div className="mb-4">
          <span className="font-bold text-lg">{formTitle}</span>
        </div>
        <div className="flex flex-col gap-2">
          <Input
            name="title"
            defaultValue={defaultValue?.title}
            onChange={handleChange}
            errorMessage={errors.title}
          />
          <Input
            name="author"
            defaultValue={defaultValue?.author}
            onChange={handleChange}
            errorMessage={errors.author}
          />
          <Input
            name="genre"
            defaultValue={defaultValue?.genre}
            onChange={handleChange}
            errorMessage={errors.genre}
          />
          <Input
            name="year"
            defaultValue={defaultValue?.year}
            onChange={handleChange}
            errorMessage={errors.year}
          />
          <div className="flex justify-between">
            <button
              onClick={() => handleSubmit(defaultValue?.id)}
              className="bg-emerald-600 py-2 px-4 rounded text-white font-semibold text-sm"
            >
              Submit
            </button>
            <button
              onClick={handleOnClose}
              className="bg-slate-500 py-2 px-4 rounded text-white font-semibold text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
