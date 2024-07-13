import React, { useCallback } from "react";
import { startCase } from "lodash";

import { Book } from "../types";
import { useFormStore } from "../stores/form-store";

export type FormProps = {
  display?: boolean;
  action?: "add" | "edit";
  data?: Book;
  onClose?: () => void;
};

type InputProps = {
  name: string;
  type?: string;
  defaultValue?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
};

export function Input(props: InputProps) {
  const { errorMessage, type } = props;
  return (
    <div className="flex flex-col gap-1">
      <label>{startCase(props.name)}</label>
      <input
        placeholder={props.name}
        {...props}
        type={type || "text"}
        className="border p-2"
      />
      <div className="h-[20px] text-sm text-red-700">{errorMessage}</div>
    </div>
  );
}

export function Form(props: FormProps) {
  const {
    action,
    resource: defaultValues,
    values,
    errors,
    saved,
    actions: { submit, close, updateValues },
  } = useFormStore((state) => state);
  const formTitle = action === "new" ? "New Book" : "Edit Book";

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateValues({ [e.target.name]: e.target.value });
    },
    [updateValues]
  );

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
            defaultValue={defaultValues?.title}
            onChange={handleChange}
            errorMessage={errors?.title}
          />
          <Input
            name="author"
            defaultValue={defaultValues?.author}
            onChange={handleChange}
            errorMessage={errors?.author}
          />
          <Input
            name="genre"
            defaultValue={defaultValues?.genre}
            onChange={handleChange}
            errorMessage={errors?.genre}
          />
          <Input
            name="year"
            defaultValue={defaultValues?.year}
            onChange={handleChange}
            errorMessage={errors?.year}
          />
          <Input
            name="tag_list"
            defaultValue={defaultValues?.tag_list?.join(",")}
            onChange={handleChange}
            errorMessage={errors?.yeartag_list}
          />          
          <div className="flex justify-between">
            <button
              onClick={() => submit(action!, defaultValues?.id, values)}
              className="bg-emerald-600 py-2 px-4 rounded text-white font-semibold text-sm disabled:opacity-50"
              disabled={!values || saved}
            >
              { saved ? 'Saved' : 'Submit' }
            </button>
            <button
              onClick={close}
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
