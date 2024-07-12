import { useMemo } from "react";
import { Book } from "../types";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useFormStore } from "../stores/form-store";
import { useBookStore } from "../stores/book-store";

type BookTableProps = {
  books: Book[];
};

export const BookTable = (props: BookTableProps) => {
  const handleOnEdit = useFormStore((state) => state.actions.open);
  const handleOnDelete = useBookStore((state) => state.actions.delete);

  const { books } = props;
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
          <div className="gap-4 flex">
            <button
              className="text-xs py-1 px-3 rounded-lg bg-yellow-500"
              onClick={() => handleOnEdit("edit", info.row.original)}
            >
              Edit
            </button>
            <button
              className="text-xs py-1 px-3 rounded-lg bg-red-700 text-white"
              onClick={() => handleOnDelete(info.row.original.id!)}
            >
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
    <table className="w-full border text-sm">
      <thead className="border-b">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="p-3">
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
          <tr key={row.id} className="hover:bg-slate-200">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="p-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
