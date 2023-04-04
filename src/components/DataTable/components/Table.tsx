import { Flex, Text } from "@chakra-ui/layout";
import { flexRender } from "@tanstack/react-table";
import { Table as ITable } from "@tanstack/react-table";
import "../css/DataTable.css";
import { FaSortDown, FaSortUp, FaSort } from "react-icons/fa";
import { Spinner } from "@chakra-ui/react";

// Table
export default function Table<T>({
  table,
  isLoading,
}: {
  table: ITable<T>;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Flex
        borderRadius={"5px"}
        h={"100vh"}
        bg={"gray.100"}
        justify={"center"}
        align={"center"}
      >
        <Spinner thickness="3px" emptyColor="gray.200" color="#004f98" />
      </Flex>
    );
  } else if (table.getCoreRowModel().rows.length === 0) {
    return (
      <Flex
        borderRadius={"5px"}
        h={"calc(100vh - 220px)"}
        bg={"gray.100"}
        justify={"center"}
        align={"center"}
      >
        <Text fontWeight={"semibold"}>No Data</Text>
      </Flex>
    );
  }

  return (
    <Flex
      overflow={"auto"}
      direction={"column"}
      boxShadow="0 0 25px rgba(0, 0, 0, 0.274)"
      borderRadius={"5px"}
    >
      {/* Actual Table */}
      <table
        {...{
          style: {
            width: "100%",
          },
        }}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  {...{
                    key: header.id,
                    colSpan: header.colSpan,
                    style: {
                      width: header.getSize(),
                    },
                    onClick: header.column.getCanSort()
                      ? header.column.getToggleSortingHandler()
                      : () => null,
                  }}
                >
                  <Flex
                    align={"center"}
                    width={"full"}
                    gap={"2"}
                    cursor={header.column.getCanSort() ? "pointer" : ""}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.getCanSort()
                      ? {
                          asc: <FaSortUp />,
                          desc: <FaSortDown />,
                        }[header.column.getIsSorted() as string] ?? <FaSort />
                      : null}
                  </Flex>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  {...{
                    key: cell.id,
                    style: {
                      width: cell.column.getSize(),
                      justifyContent: "flex-end",
                    },
                  }}
                >
                  <div className={"row-cell"}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th
                  {...{
                    key: header.id,
                    colSpan: header.colSpan,
                    style: {
                      width: header.getSize(),
                    },
                  }}
                >
                  <Flex justify={"flex-start"}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </Flex>
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </Flex>
  );
}
