import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  Table as ITable,
  SortingState,
  getSortedRowModel,
  ColumnDef,
  RowSelectionState,
  FilterFn,
  getFilteredRowModel,
  ColumnFiltersState,
  Column,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
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
  Tooltip,
  Input,
  InputGroup,
  InputRightElement,
  InputProps,
  Box,
  IconButton,
  CloseButton,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import "../css/DataTable.css";
import {
  ArrowUpDownIcon,
  ChevronDownIcon,
  CloseIcon,
  SearchIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import { useEffect, useMemo, useState } from "react";
import { convertToTitleCase } from "../utils/textFormatter";
import useSelectedRows from "../hooks/useSelectedRows";
import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";

interface DataTableProps<T> {
  dataKey: Array<string>;
  fetchFunction: () => Promise<T[]>;
  columns: any;
  options?: {
    tableTitle?: string;
    canToggleColumns?: boolean;
    selectActions?: Array<{
      name: string;
      action: (rows: T[], updateLoading: () => void) => void;
    }>;
  };
}

export type CustomSelectedRows<T> = { row: T; idx: number }[];

// Menu that allows for toggling of table columns
function ColumnToggleMenu<T>({ table }: { table: ITable<T> }) {
  return (
    <Flex>
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

// Menu for select actions
function SelectActionsMenu<T>({
  selectedRows,
  selectActions,
}: {
  selectedRows: CustomSelectedRows<T>;
  selectActions: Array<{
    name: string;
    action: (rows: T[], updateLoading: () => void) => void;
  }>;
}) {
  const [loading, setLoading] = useState<Array<string>>([]);

  const updateLoading = (actionName: string) => {
    setLoading((prev) => {
      return prev.filter((item) => item !== actionName);
    });
  };

  return (
    <Flex>
      <Menu closeOnSelect={false}>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          disabled={selectedRows.length === 0}
        >
          Select Actions {`(${selectedRows.length})`}
        </MenuButton>
        <MenuList>
          {selectActions.map(({ action, name }, idx) =>
            selectedRows.length === 0 ? (
              <MenuItem key={`${name}_${idx}`} isDisabled={true}>
                <Tooltip label="Select at least 1 row">
                  {convertToTitleCase(name)}
                </Tooltip>
              </MenuItem>
            ) : (
              <MenuItem
                key={`${name}_${idx}`}
                onClick={() => {
                  action(
                    selectedRows.map((r) => r.row),
                    () => updateLoading(name)
                  );
                  setLoading([...loading, name]);
                }}
                isDisabled={
                  selectedRows.length === 0 ||
                  (loading && loading.includes(name))
                }
                justifyContent={"space-between"}
              >
                {convertToTitleCase(name)}
                {loading && loading.includes(name) ? (
                  <Spinner ml={"2"} size={"sm"} />
                ) : null}
              </MenuItem>
            )
          )}
        </MenuList>
      </Menu>
    </Flex>
  );
}

// Table
function Table<T>({ table }: { table: ITable<T> }) {
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

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  searchIcon = false,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
  searchIcon?: boolean;
} & Omit<InputProps, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <InputGroup>
      <Input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {searchIcon ? <InputRightElement children={<SearchIcon />} /> : null}
    </InputGroup>
  );
}

function Filter({
  column,
  table,
  searchIcon = false,
  setFilteredColumns,
}: {
  column: Column<any, unknown>;
  table: ITable<any>;
  setFilteredColumns: any;
  searchIcon?: boolean;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  const handleSetFilteredColumns = (value: any) => {
    if (value) {
      setFilteredColumns((prev: string[]) => {
        const set = new Set([...prev]);
        set.add(column.id);
        return [...set];
      });
    } else {
      setFilteredColumns((prev: string[]) => {
        const set = new Set([...prev]);
        set.delete(column.id);
        return [...set];
      });
    }
  };

  return typeof firstValue === "number" ? (
    <Flex w="full">
      <Flex gap={"2"} align={"center"} w={"full"}>
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) => {
            column.setFilterValue((old: [number, number]) => [value, old?.[1]]);
            handleSetFilteredColumns(value);
          }}
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
          searchIcon={searchIcon}
          onClick={(e) => e.stopPropagation()}
          fontSize={"sm"}
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) => {
            column.setFilterValue((old: [number, number]) => [old?.[0], value]);
            handleSetFilteredColumns(value);
          }}
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
          onClick={(e) => e.stopPropagation()}
          searchIcon={searchIcon}
          fontSize={"sm"}
        />
        <IconButton
          size={"xxs"}
          borderRadius={"full"}
          p={"1"}
          color={"white"}
          bg={"red.500"}
          aria-label="Clear Filter"
          variant={"ghost"}
          isDisabled={!column.getFilterValue()}
          _hover={{}}
          onClick={(e) => {
            e.stopPropagation();
            column.setFilterValue(null);
          }}
          as={CloseIcon}
        />
      </Flex>
    </Flex>
  ) : (
    <>
      <Flex w="full" align={"center"} gap={2}>
        <datalist id={column.id + "list"}>
          {sortedUniqueValues.slice(0, 5000).map((value: any) => (
            <option value={value} key={value} />
          ))}
        </datalist>
        <DebouncedInput
          type="text"
          value={(columnFilterValue ?? "") as string}
          onChange={(value) => {
            column.setFilterValue(value);
            handleSetFilteredColumns(value);
          }}
          placeholder={`Search (${column.getFacetedUniqueValues().size})`}
          list={column.id + "list"}
          searchIcon={searchIcon}
          onClick={(e) => e.stopPropagation()}
          fontSize={"sm"}
        />
        <IconButton
          size={"xxs"}
          borderRadius={"full"}
          p={"1"}
          color={"white"}
          bg={"red.500"}
          isDisabled={!column.getFilterValue()}
          aria-label="Clear Filter"
          variant={"ghost"}
          _hover={{}}
          onClick={(e) => {
            e.stopPropagation();
            column.setFilterValue(null);
          }}
          as={CloseIcon}
        />
      </Flex>
    </>
  );
}

function ColumnFilterMenu<T>({
  canFilterColumns,
  table,
}: {
  canFilterColumns: Column<T>[];
  table: ITable<T>;
}) {
  const [filteredColumns, setFilteredColumns] = useState<string[]>([]);

  return (
    <Flex gap={"2"} fontSize={"sm"} align={"center"} w="full">
      <Menu closeOnSelect={false}>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          Filter Columns {`(${filteredColumns.length})`}
        </MenuButton>
        <MenuList>
          {canFilterColumns.map((column, idx) => (
            <MenuItem key={`${column.id}_${idx}`} gap={"2"}>
              <Flex align={"center"} fontWeight={"semibold"} gap={"2"}>
                {convertToTitleCase(column.id)}
              </Flex>
              <Filter
                column={column}
                table={table}
                searchIcon={false}
                setFilteredColumns={setFilteredColumns}
              />
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      {filteredColumns.length > 0 ? (
        <IconButton
          size={"xs"}
          borderRadius={"full"}
          p={"1"}
          cursor={"pointer"}
          color={"white"}
          bg={"red.500"}
          aria-label="Clear Filters"
          _hover={{}}
          onClick={(e) => {
            table.resetColumnFilters();
          }}
          as={CloseIcon}
        />
      ) : null}
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
    selectActions: [],
  },
}: DataTableProps<T>) {
  const { data, isFetching } = useQuery<T[]>([...dataKey], fetchFunction, {
    initialData: [],
  });

  // Destructure the options passed to the table
  const { canToggleColumns, tableTitle, selectActions } = options;

  // Sorting State
  const [sorting, setSorting] = useState<SortingState>([]);

  // Row selection state
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Global Filter state
  const [globalFilter, setGlobalFilter] = useState("");

  // Column Filter State
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Column containing the select row checkboxes
  const rowSelectionColumn = useMemo<ColumnDef<T>>(
    () => ({
      id: "select",
      header: ({ table }) => (
        <Flex w="full" justify={"center"}>
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
        <Flex w="full" justify={"center"} marginLeft={"4px"}>
          <Checkbox
            {...{
              isChecked: row.getIsSelected(),
              isIndeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
            borderColor="#c9d4cc"
          />
        </Flex>
      ),
      enableHiding: false,
      size: 20,
    }),
    [selectActions]
  );

  const table = useReactTable<T>({
    columns: selectActions ? [rowSelectionColumn, ...columns] : columns,
    data,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      rowSelection,
      globalFilter,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onRowSelectionChange: setRowSelection,
    columnResizeMode: "onChange",
  });

  const canFilterColumns = useMemo<Column<T>[]>(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    [table]
  );

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
    <Flex p={"8"} direction={"column"} maxW="full">
      {/* Table Title and Description  */}
      <Flex w="full" gap="2" align={"center"}>
        <Text fontSize={"xl"} fontWeight="bold">
          {tableTitle ? tableTitle : convertToTitleCase([...dataKey])}
        </Text>
        {isFetching ? <Spinner size={"sm"} /> : null}
      </Flex>

      {/* Table Controls */}

      <Flex gap={"2"} my={"4"} align="center">
        {/* Select Actions */}
        {selectActions ? (
          <SelectActionsMenu
            selectActions={selectActions}
            selectedRows={selectedRows}
          />
        ) : null}

        {/* Toggle Columns */}
        {canToggleColumns ? <ColumnToggleMenu table={table} /> : null}

        {/* Column Filters */}
        {canFilterColumns.length > 0 ? (
          <ColumnFilterMenu canFilterColumns={canFilterColumns} table={table} />
        ) : null}

        {/* Global Filter */}
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          placeholder="Search all columns..."
          searchIcon
        />
      </Flex>

      {/* Table */}
      <Table table={table} />
    </Flex>
  );
}

export default DataTable;
