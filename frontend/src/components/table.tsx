import { useMemo } from "react";
import { Book } from "../types";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type BookTableProps = {
  books: Book[];
  onEdit: (book: Book) => void;
};

export const BookTable = (props: BookTableProps) => {
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
