import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  Table,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Flex,
  Text,
  Spinner,
  Checkbox,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import "../css/DataTable.css";
import {
  ArrowUpDownIcon,
  ChevronDownIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import { useState } from "react";
import { convertToTitleCase } from "../utils/textFormatter";

interface DataTableProps<T> {
  dataKey: Array<string>;
  fetchFunction: () => Promise<T[]>;
  columns: any;
  options?: {
    tableTitle?: string;
    canToggleColumns?: boolean;
  };
}

// Menu that allows for toggling of table columns
function ColumnToggleMenu<T>({ table }: { table: Table<T> }) {
  return (
    <Flex my={"4"} w="full" gap="2" align={"center"}>
      <Menu closeOnSelect={false}>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          Columns
        </MenuButton>
        <MenuList>
          {table.getAllLeafColumns().map((column) =>
            column.getCanHide() ? (
              <MenuItem key={column.id}>
                <Checkbox
                  size={"md"}
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                  defaultChecked
                >
                  {column.id}
                </Checkbox>
              </MenuItem>
            ) : null
          )}
        </MenuList>
      </Menu>
    </Flex>
  );
}

function DataTable<T>({
  dataKey,
  columns,
  fetchFunction,
  options = {
    tableTitle: "",
    canToggleColumns: false,
  },
}: DataTableProps<T>) {
  const { data, isFetching } = useQuery<T[]>([...dataKey], fetchFunction, {
    initialData: [],
  });

  // Destructure the options passed to the table
  const { canToggleColumns, tableTitle } = options;

  // Sorting State
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable<T>({
    columns,
    data,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
  });

  return (
    <div style={{ width: "100%", padding: "1rem" }}>
      {/* Table Title and Description  */}
      <Flex my={"2"} w="full" gap="2" align={"center"}>
        <Text fontSize={"xl"} fontWeight="bold">
          {tableTitle ? tableTitle : convertToTitleCase([...dataKey])}
        </Text>
        {isFetching ? <Spinner size={"sm"} /> : null}
      </Flex>

      {/* Table Controls */}

      {/* Toggle Columns */}
      {canToggleColumns ? <ColumnToggleMenu table={table} /> : null}

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
                    justify={"space-between"}
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
                          asc: <TriangleUpIcon />,
                          desc: <TriangleDownIcon />,
                        }[header.column.getIsSorted() as string] ?? (
                          <ArrowUpDownIcon />
                        )
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
                    },
                  }}
                >
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
    </div>
  );
}

export default DataTable;
