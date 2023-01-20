import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  Table,
  SortingState,
  getSortedRowModel,
  ColumnDef,
  RowSelectionState,
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
import { useEffect, useMemo, useState } from "react";
import { convertToTitleCase } from "../utils/textFormatter";
import useSelectedRows from "../hooks/useSelectedRows";

interface DataTableProps<T> {
  dataKey: Array<string>;
  fetchFunction: () => Promise<T[]>;
  columns: any;
  options?: {
    tableTitle?: string;
    canToggleColumns?: boolean;
    canSelectRows?: boolean;
  };
}

export type CustomSelectedRows<T> = { row: T; idx: number }[];

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
    canSelectRows: false,
  },
}: DataTableProps<T>) {
  const { data, isFetching } = useQuery<T[]>([...dataKey], fetchFunction, {
    initialData: [],
  });

  // Destructure the options passed to the table
  const { canToggleColumns, tableTitle, canSelectRows } = options;

  // Sorting State
  const [sorting, setSorting] = useState<SortingState>([]);

  // Row selection state
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Column containing the select row checkboxes
  const rowSelectionColumn = useMemo<ColumnDef<T>>(
    () => ({
      id: "select",
      header: ({ table }) => (
        <Flex w="full" align={"center"} justify={"center"}>
          <Checkbox
            {...{
              isChecked: table.getIsAllRowsSelected(),
              isIndeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        </Flex>
      ),
      cell: ({ row }) => (
        <Flex w="full" align={"center"} justify={"center"}>
          <Checkbox
            {...{
              isChecked: row.getIsSelected(),
              isIndeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        </Flex>
      ),
      enableHiding: false,
      size: 20,
    }),
    [canSelectRows]
  );

  const table = useReactTable<T>({
    columns: canSelectRows ? [rowSelectionColumn, ...columns] : columns,
    data,
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    columnResizeMode: "onChange",
  });

  const { selectedRows } = useSelectedRows(
    ["selected", ...dataKey],
    table,
    rowSelection
  );

  useEffect(() => {
    setRowSelection(() => {
      /**
       * Chat GPT did this LMFAO!
       *
       * Basically takes the state of the selected rows from react-query
       * which is an array with the selected rows and returns the an object with key value pairs
       * of the selected row index and true because the row is selected
       */
      return selectedRows.reduce((prev, { idx }) => {
        prev[idx] = true;
        return prev;
      }, {} as { [x: string]: boolean });
    });
  }, [selectedRows]);

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
