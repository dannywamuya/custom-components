import { Checkbox } from "@chakra-ui/checkbox";
import { Flex, Text } from "@chakra-ui/layout";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@chakra-ui/spinner";
import { useReactTable } from "@tanstack/react-table";
import {
  SortingState,
  RowSelectionState,
  ColumnFiltersState,
  ColumnDef,
  getFilteredRowModel,
  getCoreRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  Column,
} from "@tanstack/table-core";
import { useState, useMemo, useEffect } from "react";
import useSelectedRows from "./hooks/useSelectedRows";
import { convertToTitleCase } from "../../utils/textFormatter";
import { DataTableProps } from "./types/table.types";
import { fuzzyFilter } from "./utils/utils";
import Table from "./components/Table";
import ColumnFilterMenu from "./components/ColumnFilterMenu";
import ColumnToggleMenu from "./components/ColumnToggleMenu";
import DebouncedInput from "./components/DebouncedInput";
import SelectActionsMenu from "./components/SelectActionsMenu";
import { Button } from "@chakra-ui/button";
import { HiOutlineRefresh } from "react-icons/hi";

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
  const { data, isFetching, refetch } = useQuery<T[]>(
    [...dataKey],
    fetchFunction,
    {
      initialData: [],
    }
  );

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
      <Flex w="full" gap="2" align={"center"} justify={"space-between"}>
        <Text fontSize={"xl"} fontWeight="bold">
          {tableTitle ? tableTitle : convertToTitleCase([...dataKey])}
        </Text>
        <Button
          rightIcon={<HiOutlineRefresh />}
          variant="outline"
          size={"sm"}
          isLoading={isFetching}
          onClick={() => refetch()}
        >
          Refresh
        </Button>
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
